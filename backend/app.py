import os
# dep: Flask — Micro web framework for the backend API
from flask import Flask
# dep: Flask-Cors — Handles Cross-Origin Resource Sharing for frontend integration
from flask_cors import CORS
from models import db, SensorData, Prediction, RegionData
from routes import sensor_bp, prediction_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database configuration (SQLite for local development)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'waterborne_diseases.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Register blueprints
    app.register_blueprint(sensor_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')

    # Create tables and seed data
    with app.app_context():
        db.create_all()
        
        # Seed default regions if empty
        if not RegionData.query.first():
            regions = [
                RegionData(region="North", sanitation=65.0, healthcare_index=70.0, population_density=400.0),
                RegionData(region="South", sanitation=40.0, healthcare_index=35.0, population_density=600.0),
                RegionData(region="East", sanitation=55.0, healthcare_index=50.0, population_density=300.0),
                RegionData(region="West", sanitation=80.0, healthcare_index=85.0, population_density=200.0),
                RegionData(region="Central", sanitation=75.0, healthcare_index=75.0, population_density=1000.0)
            ]
            db.session.bulk_save_objects(regions)
            db.session.commit()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
