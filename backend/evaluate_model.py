import joblib
import pandas as pd
import numpy as np
import os
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

def evaluate_saved_model():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Load Resources
    print("Loading model and resources...")
    try:
        model = joblib.load(os.path.join(backend_dir, 'best_model.pkl'))
        scaler = joblib.load(os.path.join(backend_dir, 'scaler.pkl'))
        features = joblib.load(os.path.join(backend_dir, 'features.pkl'))
    except FileNotFoundError:
        print("Error: Model files not found. Please run 'python train_model.py' first.")
        return

    # 2. Load and Preprocess Data (Same logic as training)
    print("Loading dataset...")
    csv_path = os.path.join(backend_dir, '..', 'water_pollution_disease.csv')
    df = pd.read_csv(csv_path)
    df.columns = [c.strip() for c in df.columns]

    disease_cols = ['Diarrheal Cases per 100,000 people', 
                    'Cholera Cases per 100,000 people', 
                    'Typhoid Cases per 100,000 people']
    
    for col in disease_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
    df['total_cases'] = df[disease_cols].sum(axis=1)
    threshold = df['total_cases'].quantile(0.75)
    df['outbreak'] = (df['total_cases'] > threshold).astype(int)

    X = df.drop(columns=disease_cols + ['total_cases', 'outbreak', 'Year'])
    y = df['outbreak']

    # One-hot encoding
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    X = pd.get_dummies(X, columns=categorical_cols)

    # Align features with the saved feature list
    for col in features:
        if col not in X.columns:
            X[col] = 0
    X = X[features]

    # 3. Scale and Predict
    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)

    # 4. Results
    print("\n" + "="*30)
    print("SAVED MODEL ACCURACY REPORT")
    print("="*30)
    
    acc = accuracy_score(y, y_pred)
    f1 = f1_score(y, y_pred)
    
    print(f"Overall Accuracy: {acc:.4f}")
    print(f"Overall F1 Score: {f1:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y, y_pred, target_names=['No Outbreak', 'Outbreak']))
    
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y, y_pred)
    print(f"True Negatives: {cm[0][0]}")
    print(f"False Positives: {cm[0][1]}")
    print(f"False Negatives: {cm[1][0]}")
    print(f"True Positives: {cm[1][1]}")

if __name__ == "__main__":
    evaluate_saved_model()
