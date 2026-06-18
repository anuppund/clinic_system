from fastapi import Depends, HTTPException
from .security import get_current_user

# RBAC: Admin
def admin_required(current_user=Depends(get_current_user)):
    if current_user["role"] != "admin": raise HTTPException(status_code=403, detail="Admin Access Required")
    return current_user

# RBAC: Doctor
def doctor_required(current_user=Depends(get_current_user)):
    if current_user["role"] != "doctor": raise HTTPException(status_code=403, detail="Doctor Access Required")
    return current_user

# RBAC: Patient
def patient_required(current_user=Depends(get_current_user)):
    if current_user["role"] != "patient": raise HTTPException(status_code=403, detail="Patient Access Required")
    return current_user
