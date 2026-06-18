from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional

class UserResponse(BaseModel):
    id: int; name: str; email: str; role: str
    class Config: from_attributes = True

class DoctorResponse(BaseModel):
    id: int; name: str; specialization: str; experience: int; consultation_fee: int; available_days: str
    class Config: from_attributes = True

class AppointmentResponse(BaseModel):
    id: int; patient_id: int; doctor_id: int; appointment_date: date; appointment_time: time; status: str
    patient: Optional[UserResponse] = None; doctor: Optional[DoctorResponse] = None
    class Config: from_attributes = True

class MedicalRecordResponse(BaseModel):
    id: int; patient_id: int; doctor_id: int; diagnosis: str; prescription: str; notes: str; created_at: datetime
    patient: Optional[UserResponse] = None; doctor: Optional[DoctorResponse] = None
    class Config: from_attributes = True

class UserCreate(BaseModel): name: str; email: str; password: str; role: str
class UserUpdate(BaseModel): name: str; email: str; role: str

class DoctorCreate(BaseModel): name: str; specialization: str; experience: int; consultation_fee: int; available_days: str
class DoctorUpdate(BaseModel): name: str; specialization: str; experience: int; consultation_fee: int; available_days: str

class AppointmentCreate(BaseModel): patient_id: int; doctor_id: int; appointment_date: date; appointment_time: time
class MedicalRecordCreate(BaseModel): patient_id: int; doctor_id: int; diagnosis: str; prescription: str; notes: str
