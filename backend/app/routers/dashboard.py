from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import User, Doctor, Appointment, MedicalRecord
from ..dependencies import get_db
from ..role_checker import admin_required

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db), current_user=Depends(admin_required)):
    return {
        "total_users": db.query(User).count(),
        "total_doctors": db.query(Doctor).count(),
        # ONLY count active appointments in the dashboard stats
        "total_appointments": db.query(Appointment).filter(Appointment.status == "Booked").count(),
        "total_medical_records": db.query(MedicalRecord).count()
    }
