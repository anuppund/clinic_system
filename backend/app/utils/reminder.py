from datetime import date, timedelta
from sqlalchemy.orm import Session
from ..models import Appointment, User, Doctor

def check_tomorrow_appointments(db: Session):
    # Convert date to string to ensure perfect matching with SQLite databases
    tomorrow_str = str(date.today() + timedelta(days=1))

    # Strictly filter by tomorrow's date AND status == 'Booked'
    appointments = db.query(Appointment).filter(
        Appointment.appointment_date == tomorrow_str, 
        Appointment.status == "Booked"
    ).all()

    reminders = []
    for app in appointments:
        patient = db.query(User).filter(User.id == app.patient_id).first()
        doctor = db.query(Doctor).filter(Doctor.id == app.doctor_id).first()
        if patient and doctor:
            reminders.append(f"Reminder: {patient.name} has an appointment with {doctor.name} tomorrow ({app.appointment_date}) at {app.appointment_time}")
    return reminders
