from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import MedicalRecord
from ..schemas import MedicalRecordCreate, MedicalRecordResponse
from ..dependencies import get_db
from ..role_checker import doctor_required, patient_required

router = APIRouter(prefix="/medical-records", tags=["Medical Records"])

@router.post("/", response_model=MedicalRecordResponse)
def create_record(rec: MedicalRecordCreate, db: Session = Depends(get_db), current_user=Depends(doctor_required)):
    new_rec = MedicalRecord(**rec.dict())
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    return new_rec

@router.get("/my", response_model=list[MedicalRecordResponse])
def my_medical_records(db: Session = Depends(get_db), current_user=Depends(patient_required)):
    return db.query(MedicalRecord).filter(MedicalRecord.patient_id == current_user["id"]).all()

@router.get("/", response_model=list[MedicalRecordResponse])
def get_all_records(db: Session = Depends(get_db)):
    return db.query(MedicalRecord).all()

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db), current_user=Depends(doctor_required)):
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if record:
        db.delete(record)
        db.commit()
    return {"message": "Record Deleted"}
