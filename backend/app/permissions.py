from fastapi import HTTPException

# Ownership-Based Access Control (OBAC)
def verify_patient_access(current_user, patient_id):
    if current_user["role"] == "admin": return True
    if current_user["role"] == "patient" and current_user["id"] != patient_id:
        raise HTTPException(status_code=403, detail="Ownership Validation Failed: Access Denied")
    return True
