from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Appointment
from ..schemas import AppointmentCreate, AppointmentResponse
from ..dependencies import get_db
from ..security import get_current_user
from ..role_checker import patient_required, admin_required
from ..permissions import verify_patient_access

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentResponse)
def book_appointment(app: AppointmentCreate, db: Session = Depends(get_db), current_user=Depends(patient_required)):
    verify_patient_access(current_user, app.patient_id)

    # DOUBLE BOOKING PREVENTION
    conflict = db.query(Appointment).filter_by(
        doctor_id=app.doctor_id, 
        appointment_date=app.appointment_date, 
        appointment_time=app.appointment_time, 
        status="Booked"
    ).first()

    if conflict: 
        raise HTTPException(status_code=400, detail="Conflict Detected: Doctor is already booked at this time.")

    new_app = Appointment(**app.dict())
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

# Admin & Doctor can view all
@router.get("/", response_model=list[AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

# Patient views own
@router.get("/my", response_model=list[AppointmentResponse])
def my_appointments(db: Session = Depends(get_db), current_user=Depends(patient_required)):
    return db.query(Appointment).filter(Appointment.patient_id == current_user["id"]).all()

# Cancel Appointment
@router.put("/{app_id}/cancel")
def cancel_app(app_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    app = db.query(Appointment).filter(Appointment.id == app_id).first()
    if not app: raise HTTPException(status_code=404, detail="Not Found")
    app.status = "Cancelled"
    db.commit()
    return {"message": "Appointment Cancelled"}
