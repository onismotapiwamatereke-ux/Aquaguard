import os
# dep: Flask — Micro web framework for the backend API
from flask import Flask
# dep: Flask-Cors — Handles Cross-Origin Resource Sharing for frontend integration
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, SensorData, Prediction, RegionData, User
from routes import sensor_bp, prediction_bp, auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    JWTManager(app)

    # Database configuration (SQLite for local development)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'waterborne_diseases.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change in production

    db.init_app(app)

    # Register blueprints
    app.register_blueprint(sensor_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    # Create tables and seed data
    with app.app_context():
        db.create_all()
        
        # Seed default regions if empty
        if not RegionData.query.first():
            regions = [
                RegionData(region="Harare", sanitation=60.0, healthcare_index=75.0, population_density=2585.0, gdp_per_capita=2500.0, urbanization_rate=95.0),
                RegionData(region="Bulawayo", sanitation=56.0, healthcare_index=70.0, population_density=1220.0, gdp_per_capita=2200.0, urbanization_rate=95.0),
                RegionData(region="Manicaland", sanitation=45.0, healthcare_index=50.0, population_density=50.0, gdp_per_capita=1200.0, urbanization_rate=25.0),
                RegionData(region="Mashonaland Central", sanitation=40.0, healthcare_index=45.0, population_density=30.0, gdp_per_capita=1100.0, urbanization_rate=20.0),
                RegionData(region="Mashonaland East", sanitation=50.0, healthcare_index=55.0, population_density=40.0, gdp_per_capita=1300.0, urbanization_rate=30.0),
                RegionData(region="Mashonaland West", sanitation=48.0, healthcare_index=52.0, population_density=35.0, gdp_per_capita=1250.0, urbanization_rate=28.0),
                RegionData(region="Masvingo", sanitation=42.0, healthcare_index=48.0, population_density=25.0, gdp_per_capita=1150.0, urbanization_rate=22.0),
                RegionData(region="Matabeleland North", sanitation=30.0, healthcare_index=40.0, population_density=11.0, gdp_per_capita=1000.0, urbanization_rate=10.0),
                RegionData(region="Matabeleland South", sanitation=35.0, healthcare_index=42.0, population_density=15.0, gdp_per_capita=1050.0, urbanization_rate=15.0),
                RegionData(region="Midlands", sanitation=38.0, healthcare_index=46.0, population_density=20.0, gdp_per_capita=1180.0, urbanization_rate=18.0)
            ]
            db.session.bulk_save_objects(regions)
            db.session.commit()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
