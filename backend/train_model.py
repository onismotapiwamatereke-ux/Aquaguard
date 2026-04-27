import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os

# dep: pandas — Data manipulation
# dep: scikit-learn — ML tools and Random Forest
# dep: xgboost — Gradient boosting model
# dep: joblib — Model serialization

def train_model():
    # 1. Load Dataset
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'water_pollution_disease.csv')
    df = pd.read_csv(csv_path)

    # 2. Preprocess Data
    # Clean column names (strip whitespace)
    df.columns = [c.strip() for c in df.columns]

    # Create target variable: Outbreak
    # We'll define an outbreak if the total cases exceed the 75th percentile
    disease_cols = ['Diarrheal Cases per 100,000 people', 
                    'Cholera Cases per 100,000 people', 
                    'Typhoid Cases per 100,000 people']
    
    # Ensure columns are numeric
    for col in disease_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
    df['total_cases'] = df[disease_cols].sum(axis=1)
    threshold = df['total_cases'].quantile(0.75)
    df['outbreak'] = (df['total_cases'] > threshold).astype(int)

    # Define features and target
    target = 'outbreak'
    drop_cols = disease_cols + ['total_cases', 'outbreak', 'Year'] # Drop year as it might not generalize
    
    X = df.drop(columns=drop_cols)
    y = df[target]

    # Handle Categorical Features
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)

    # Save feature names for prediction consistency
    feature_names = X.columns.tolist()
    joblib.dump(feature_names, os.path.join(os.path.dirname(__file__), 'features.pkl'))

    # Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Scale Features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    joblib.dump(scaler, os.path.join(os.path.dirname(__file__), 'scaler.pkl'))

    # 3. Train Models
    print("Training RandomForest...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train_scaled, y_train)
    y_pred_rf = rf.predict(X_test_scaled)

    print("Training XGBoost...")
    xgb = XGBClassifier(n_estimators=100, random_state=42, use_label_encoder=False, eval_metric='logloss')
    xgb.fit(X_train_scaled, y_train)
    y_pred_xgb = xgb.predict(X_test_scaled)

    # 4. Evaluate
    metrics = {
        "RandomForest": {
            "accuracy": accuracy_score(y_test, y_pred_rf),
            "precision": precision_score(y_test, y_pred_rf),
            "recall": recall_score(y_test, y_pred_rf),
            "f1": f1_score(y_test, y_pred_rf)
        },
        "XGBoost": {
            "accuracy": accuracy_score(y_test, y_pred_xgb),
            "precision": precision_score(y_test, y_pred_xgb),
            "recall": recall_score(y_test, y_pred_xgb),
            "f1": f1_score(y_test, y_pred_xgb)
        }
    }

    print("\nModel Results:")
    for model_name, m in metrics.items():
        print(f"{model_name}: F1={m['f1']:.4f}, Accuracy={m['accuracy']:.4f}")

    # 5. Save Best Model
    if metrics["XGBoost"]["f1"] > metrics["RandomForest"]["f1"]:
        best_model = xgb
        print("\nBest Model: XGBoost")
    else:
        best_model = rf
        print("\nBest Model: RandomForest")

    joblib.dump(best_model, os.path.join(os.path.dirname(__file__), 'best_model.pkl'))
    print("Model saved to backend/best_model.pkl")

if __name__ == "__main__":
    train_model()
