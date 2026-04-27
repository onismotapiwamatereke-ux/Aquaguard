from flask import Blueprint, request, jsonify
from services import SensorService

sensor_bp = Blueprint('sensor', __name__)

@sensor_bp.route('/sensor-data', methods=['POST'])
def add_sensor_data():
    data = request.get_json()
    if not data or 'ph' not in data or 'turbidity' not in data or 'temperature' not in data:
        return jsonify({"error": "Missing required fields (ph, turbidity, temperature)"}), 400
    
    new_entry = SensorService.add_sensor_data(
        ph=data['ph'],
        turbidity=data['turbidity'],
        temperature=data['temperature']
    )
    return jsonify(new_entry.to_dict()), 201

@sensor_bp.route('/history', methods=['GET'])
def get_history():
    history = SensorService.get_all_history()
    return jsonify([entry.to_dict() for entry in history]), 200
