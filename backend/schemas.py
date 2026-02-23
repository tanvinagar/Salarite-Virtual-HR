from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str
    candidate_name: str
    hr_name: str
    priority: str
    deadline: str


class TaskUpdate(BaseModel):
    status: str
    notes: str


class InterviewCreate(BaseModel):
    candidate_name: str
    hr_name: str
    interview_date: str
    mode: str