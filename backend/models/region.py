from models.sensor import db

class RegionData(db.Model):
    __tablename__ = 'region_data'
    
    region = db.Column(db.String(100), primary_key=True)
    sanitation = db.Column(db.Float, nullable=False)
    healthcare_index = db.Column(db.Float, nullable=False)
    population_density = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "region": self.region,
            "sanitation": self.sanitation,
            "healthcare_index": self.healthcare_index,
            "population_density": self.population_density
        }
