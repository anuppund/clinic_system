from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import user, doctor, appointment, medical_record, dashboard, reminder

app = FastAPI(title="Clinic Appointment Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(doctor.router)
app.include_router(appointment.router)
app.include_router(medical_record.router)
app.include_router(dashboard.router)
app.include_router(reminder.router)

@app.get("/")
def root(): return {"message": "Clinic API Running"}
