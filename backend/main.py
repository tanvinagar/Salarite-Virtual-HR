from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
import models
import schemas
from schemas import TaskUpdate

models.Base.metadata.create_all(bind=engine)

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


@app.get("/")
def root():
    return {"message": "Backend Running Successfully"}



@app.get("/tasks/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@app.post("/tasks/")
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.put("/tasks/{id}")
def update_task(id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == id).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db_task.priority = task.priority
    db_task.candidate_name = task.candidate_name
    db_task.status = task.status

    db.commit()
    db.refresh(db_task)
    return db_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}


@app.get("/interviews/")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(models.Interview).all()


@app.post("/interviews/")
def create_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    new_interview = models.Interview(**interview.dict())
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return new_interview


@app.delete("/interviews/{id}")
def delete_interview(id: int, db: Session = Depends(get_db)):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}

@app.put("/interviews/{id}")
def update_interview(id: int, interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    db_interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not db_interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    db_interview.candidate_name = interview.candidate_name
    db_interview.interview_type = interview.interview_type
    db_interview.meet_link = interview.meet_link
    db_interview.scheduled_time = interview.scheduled_time

    db.commit()
    db.refresh(db_interview)
    return db_interview
