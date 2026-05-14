from flask import Blueprint, jsonify, request
from services import PredictionService
from models import RegionData

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/prediction', methods=['POST'])
def run_prediction():
    body = request.get_json(silent=True) or {}

    country          = body.get('country', 'Zimbabwe')
    region           = body.get('region', '')
    water_source     = body.get('water_source', 'Well')
    treatment_method = body.get('treatment_method', 'Boiling')

    extra = {
        'contaminant_level':   body.get('contaminant_level'),
        'dissolved_oxygen':    body.get('dissolved_oxygen'),
        'nitrate_level':       body.get('nitrate_level'),
        'lead_concentration':  body.get('lead_concentration'),
        'bacteria_count':      body.get('bacteria_count'),
        'access_clean_water':  body.get('access_clean_water'),
        'rainfall':            body.get('rainfall'),
    }

    result = PredictionService.run_prediction(
        country=country,
        region=region,
        water_source=water_source,
        treatment_method=treatment_method,
        extra_params=extra,
    )
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result), 200


@prediction_bp.route('/regions', methods=['GET'])
def get_regions():
    regions = RegionData.query.all()
    return jsonify([r.to_dict() for r in regions]), 200
