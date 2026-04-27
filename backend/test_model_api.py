import json
import urllib.request
import time

def test_prediction():
    base_url = "http://localhost:5000/api"
    
    # 1. Post mock sensor data
    sensor_data = {
        "ph": 8.5,
        "turbidity": 12.0,
        "temperature": 28.5
    }
    
    print(f"Sending mock sensor data: {sensor_data}")
    
    try:
        req = urllib.request.Request(
            f"{base_url}/sensor-data",
            data=json.dumps(sensor_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"Sensor data added: {res_data}")
            
        # 2. Trigger prediction
        print("\nTriggering prediction...")
        with urllib.request.urlopen(f"{base_url}/prediction") as response:
            pred_data = json.loads(response.read().decode())
            print("\nPrediction Result:")
            print(json.dumps(pred_data, indent=4))
            
            risk = pred_data.get('risk_level', 'Unknown')
            prob = pred_data.get('probability', 0)
            print(f"\nResult: {risk} ({prob*100:.2f}%)")
            
            if 'explanation' in pred_data:
                print("\nTop Contributing Factors (SHAP):")
                for factor in pred_data['explanation']:
                    print(f"- {factor['feature']}: {factor['impact']:.4f}")
                    
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the Flask server is running on http://localhost:5000")

if __name__ == "__main__":
    test_prediction()
