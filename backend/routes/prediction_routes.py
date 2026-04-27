from flask import Blueprint, jsonify
from services import PredictionService

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/prediction', methods=['GET'])
def get_prediction():
    result = PredictionService.run_prediction()
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result), 200
