from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from models import Task, Interview
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/tasks")
def create_task(task: dict, db: Session = Depends(get_db)):
    new_task = Task(**task)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


@app.get("/tasks/hr/{hr_name}")
def get_tasks_by_hr(hr_name: str, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.hr_name == hr_name).all()


@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    status: str = Query(...),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = status
    db.commit()
    db.refresh(task)
    return {"message": "Status updated"}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}


@app.post("/interviews")
def create_interview(interview: dict, db: Session = Depends(get_db)):
    new_interview = Interview(**interview)
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return new_interview


@app.get("/interviews")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(Interview).all()


@app.delete("/interviews/{interview_id}")
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()

    if not interview:
        return {"error": "Interview not found"}

    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted"}