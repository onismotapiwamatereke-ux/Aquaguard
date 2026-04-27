from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# dep: Flask-SQLAlchemy — ORM for database interactions
db = SQLAlchemy()

class SensorData(db.Model):
    __tablename__ = 'sensor_data'
    
    id = db.Column(db.Integer, primary_key=True)
    ph = db.Column(db.Float, nullable=False)
    turbidity = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "ph": self.ph,
            "turbidity": self.turbidity,
            "temperature": self.temperature,
            "timestamp": self.timestamp.isoformat()
        }
