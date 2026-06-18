from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String) # admin, doctor, patient

    appointments = relationship("Appointment", back_populates="patient", foreign_keys="[Appointment.patient_id]")
    medical_records = relationship("MedicalRecord", back_populates="patient", foreign_keys="[MedicalRecord.patient_id]")

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    experience = Column(Integer)
    consultation_fee = Column(Integer)
    available_days = Column(String)

    appointments = relationship("Appointment", back_populates="doctor")
    medical_records = relationship("MedicalRecord", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    appointment_date = Column(Date)
    appointment_time = Column(Time)
    status = Column(String, default="Booked")

    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    diagnosis = Column(String, nullable=False)
    prescription = Column(String, nullable=False)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
