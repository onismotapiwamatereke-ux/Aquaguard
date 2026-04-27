from flask import Blueprint, jsonify, request
from services import PredictionService

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/prediction', methods=['GET'])
def get_prediction():
    # Get optional parameters from query string
    water_source = request.args.get('water_source', 'Well')
    treatment_method = request.args.get('treatment_method', 'Boiling')
    
    result = PredictionService.run_prediction(water_source=water_source, treatment_method=treatment_method)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result), 200
