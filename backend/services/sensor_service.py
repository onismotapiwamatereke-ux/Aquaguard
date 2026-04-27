from models import db, SensorData

class SensorService:
    @staticmethod
    def add_sensor_data(ph, turbidity, temperature):
        new_data = SensorData(ph=ph, turbidity=turbidity, temperature=temperature)
        db.session.add(new_data)
        db.session.commit()
        return new_data

    @staticmethod
    def get_all_history():
        return SensorData.query.order_by(SensorData.timestamp.desc()).all()

    @staticmethod
    def get_latest_data():
        return SensorData.query.order_by(SensorData.timestamp.desc()).first()
