import joblib
import pandas as pd
import numpy as np
import shap
import os
from models import db, Prediction, RegionData
from services import SensorService


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
                model_path   = os.path.join(backend_dir, 'best_model.pkl')
                scaler_path  = os.path.join(backend_dir, 'scaler.pkl')
                features_path = os.path.join(backend_dir, 'features.pkl')
                if not os.path.exists(model_path):
                    return False
                cls._model    = joblib.load(model_path)
                cls._scaler   = joblib.load(scaler_path)
                cls._features = joblib.load(features_path)
                cls._explainer = shap.TreeExplainer(cls._model)
            except Exception as e:
                print(f"Error loading ML resources: {e}")
                return False
        return True

    @staticmethod
    def run_prediction(country='Zimbabwe', region='', water_source='Well',
                       treatment_method='Boiling', extra_params=None):
        if extra_params is None:
            extra_params = {}

        # 1. Latest sensor reading
        latest_sensor = SensorService.get_latest_data()
        if not latest_sensor:
            return {"error": "No water readings found. Please enter sensor data first."}, 400

        # 2. Load ML model
        if not PredictionService._load_resources():
            return {"error": "AI model not ready. Please contact support."}, 500

        # 3. Regional socioeconomic data (DB lookup, then global defaults)
        region_name = region or 'Harare'
        region_info = RegionData.query.filter_by(region=region_name).first()
        if region_info:
            reg = region_info.to_dict()
        else:
            # Reasonable global defaults when no specific region data is available
            reg = {
                "sanitation":          50.0,
                "healthcare_index":    50.0,
                "population_density": 200.0,
                "gdp_per_capita":    3000.0,
                "urbanization_rate":  45.0,
            }

        def _get(key, default):
            v = extra_params.get(key)
            return float(v) if v is not None else default

        # 4. Build feature vector — values come from user input; only fallback if not provided
        input_data = {
            'Contaminant Level (ppm)':                   _get('contaminant_level',  5.0),
            'pH Level':                                   latest_sensor.ph,
            'Turbidity (NTU)':                            latest_sensor.turbidity,
            'Dissolved Oxygen (mg/L)':                   _get('dissolved_oxygen',   6.0),
            'Nitrate Level (mg/L)':                      _get('nitrate_level',     10.0),
            'Lead Concentration (µg/L)':                 _get('lead_concentration',  2.0),
            'Bacteria Count (CFU/mL)':                   _get('bacteria_count',    500.0),
            'Access to Clean Water (% of Population)':   _get('access_clean_water', 60.0),
            'Infant Mortality Rate (per 1,000 live births)': 30.0,
            'GDP per Capita (USD)':                       reg['gdp_per_capita'],
            'Healthcare Access Index (0-100)':            reg['healthcare_index'],
            'Urbanization Rate (%)':                      reg['urbanization_rate'],
            'Sanitation Coverage (% of Population)':      reg['sanitation'],
            'Rainfall (mm per year)':                    _get('rainfall',         800.0),
            'Temperature (°C)':                           latest_sensor.temperature,
            'Population Density (people per km²)':        reg['population_density'],
            'Country':               country or 'Zimbabwe',
            'Region':                region_name,
            'Water Source Type':     water_source,
            'Water Treatment Method': treatment_method,
        }

        # 5. Encode & scale
        df = pd.DataFrame([input_data])
        cat_cols = ['Country', 'Region', 'Water Source Type', 'Water Treatment Method']
        df = pd.get_dummies(df, columns=cat_cols)
        for col in PredictionService._features:
            if col not in df.columns:
                df[col] = 0
        df = df[PredictionService._features]
        X_scaled = PredictionService._scaler.transform(df)

        # 6. Predict
        prob = float(PredictionService._model.predict_proba(X_scaled)[0][1])
        if prob > 0.7:
            risk = "HIGH RISK"
        elif prob > 0.4:
            risk = "MEDIUM RISK"
        else:
            risk = "LOW RISK"

        # 7. SHAP explanation
        explanation = []
        try:
            shap_values = PredictionService._explainer.shap_values(X_scaled)
            impacts = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]
            raw = sorted(
                [{"feature": PredictionService._features[i], "impact": float(v)}
                 for i, v in enumerate(impacts)],
                key=lambda x: abs(x['impact']), reverse=True
            )[:3]
            explanation = raw
        except Exception as e:
            print(f"SHAP Error: {e}")

        # 8. Persist & return
        new_pred = Prediction(risk_level=risk, probability=prob)
        db.session.add(new_pred)
        db.session.commit()

        res = new_pred.to_dict()
        res['explanation'] = explanation
        return res
