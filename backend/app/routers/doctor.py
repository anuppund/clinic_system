from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Doctor
from ..schemas import DoctorCreate, DoctorUpdate, DoctorResponse
from ..dependencies import get_db
from ..role_checker import admin_required

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/", response_model=DoctorResponse)
def create_doctor(doc: DoctorCreate, db: Session = Depends(get_db), _: dict = Depends(admin_required)):
    new_doc = Doctor(**doc.dict())
    db.add(new_doc); db.commit(); db.refresh(new_doc)
    return new_doc

@router.get("/", response_model=list[DoctorResponse])
def get_all_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.put("/{doc_id}", response_model=DoctorResponse)
def update_doc(doc_id: int, data: DoctorUpdate, db: Session = Depends(get_db), _: dict = Depends(admin_required)):
    doc = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doc: raise HTTPException(status_code=404, detail="Not Found")
    doc.name = data.name; doc.specialization = data.specialization; doc.experience = data.experience
    doc.consultation_fee = data.consultation_fee; doc.available_days = data.available_days
    db.commit(); db.refresh(doc)
    return doc

@router.delete("/{doc_id}")
def delete_doc(doc_id: int, db: Session = Depends(get_db), _: dict = Depends(admin_required)):
    doc = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if doc: db.delete(doc); db.commit()
    return {"message": "Deleted"}
