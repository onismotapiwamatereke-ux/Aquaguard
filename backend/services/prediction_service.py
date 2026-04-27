import joblib
import pandas as pd
import numpy as np
import shap
import os
from models import db, Prediction, RegionData
from services import SensorService

# dep: shap — For model explainability

class PredictionService:
    _model = None
    _scaler = None
    _features = None
    _explainer = None

    @classmethod
    def _load_resources(cls):
        if cls._model is None:
            basedir = os.path.abspath(os.path.dirname(__file__))
            backend_dir = os.path.dirname(basedir)
            
            try:
                model_path = os.path.join(backend_dir, 'best_model.pkl')
                scaler_path = os.path.join(backend_dir, 'scaler.pkl')
                features_path = os.path.join(backend_dir, 'features.pkl')
                
                if not os.path.exists(model_path):
                    return False

                cls._model = joblib.load(model_path)
                cls._scaler = joblib.load(scaler_path)
                cls._features = joblib.load(features_path)
                
                # Initialize SHAP explainer
                # TreeExplainer is best for RF/XGBoost
                cls._explainer = shap.TreeExplainer(cls._model)
            except Exception as e:
                print(f"Error loading ML resources: {e}")
                return False
        return True

    @staticmethod
    def run_prediction():
        # 1. Fetch latest sensor data
        latest_sensor = SensorService.get_latest_data()
        if not latest_sensor:
            return {"error": "No sensor data available for prediction"}, 400

        # 2. Load ML models
        if not PredictionService._load_resources():
            return {"error": "ML models not trained or found. Please run train_model.py first."}, 500

        # 3. Combine with static regional data
        region_name = "North" # Default for now
        region_info = RegionData.query.filter_by(region=region_name).first()
        
        if not region_info:
            # Fallback to sensible defaults
            reg_data = {
                "sanitation": 50.0,
                "healthcare_index": 50.0,
                "population_density": 500.0
            }
        else:
            reg_data = region_info.to_dict()

        # 4. Prepare feature vector
        # Construct input dict matching training features
        input_data = {
            'Contaminant Level (ppm)': 5.0, # Average
            'pH Level': latest_sensor.ph,
            'Turbidity (NTU)': latest_sensor.turbidity,
            'Dissolved Oxygen (mg/L)': 5.0,
            'Nitrate Level (mg/L)': 20.0,
            'Lead Concentration (µg/L)': 5.0,
            'Bacteria Count (CFU/mL)': 2500.0,
            'Access to Clean Water (% of Population)': 50.0,
            'Infant Mortality Rate (per 1,000 live births)': 40.0,
            'GDP per Capita (USD)': 20000.0,
            'Healthcare Access Index (0-100)': reg_data['healthcare_index'],
            'Urbanization Rate (%)': 50.0,
            'Sanitation Coverage (% of Population)': reg_data['sanitation'],
            'Rainfall (mm per year)': 1000.0,
            'Temperature (°C)': latest_sensor.temperature,
            'Population Density (people per km²)': reg_data['population_density'],
            'Country': 'Mexico', # Example from CSV
            'Region': region_name,
            'Water Source Type': 'Lake',
            'Water Treatment Method': 'Filtration'
        }

        # Align with training features
        df_input = pd.DataFrame([input_data])
        
        # One-hot encoding
        categorical_cols = ['Country', 'Region', 'Water Source Type', 'Water Treatment Method']
        df_input = pd.get_dummies(df_input, columns=categorical_cols)
        
        # Add missing columns
        for col in PredictionService._features:
            if col not in df_input.columns:
                df_input[col] = 0
        
        # Reorder and scale
        df_input = df_input[PredictionService._features]
        X_scaled = PredictionService._scaler.transform(df_input)

        # 5. Run Model
        prob = float(PredictionService._model.predict_proba(X_scaled)[0][1])
        
        if prob > 0.7:
            risk = "HIGH RISK"
        elif prob > 0.4:
            risk = "MEDIUM RISK"
        else:
            risk = "LOW RISK"

        # 6. SHAP Explainability
        try:
            # For newer versions of SHAP, checking the explainer output
            shap_values = PredictionService._explainer.shap_values(X_scaled)
            
            # Select the class 1 impact
            if isinstance(shap_values, list):
                impacts = shap_values[1][0]
            else:
                impacts = shap_values[0]
            
            explanation = []
            for i, val in enumerate(impacts):
                explanation.append({
                    "feature": PredictionService._features[i],
                    "impact": float(val)
                })
            
            # Top 3 factors
            explanation = sorted(explanation, key=lambda x: abs(x['impact']), reverse=True)[:3]
        except Exception as e:
            print(f"SHAP Error: {e}")
            explanation = []

        # 7. Save and Return
        new_pred = Prediction(risk_level=risk, probability=prob)
        db.session.add(new_pred)
        db.session.commit()
        
        res = new_pred.to_dict()
        res['explanation'] = explanation
        return res
