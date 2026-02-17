from pydantic import BaseModel



class TaskCreate(BaseModel):
    title: str
    description: str
    priority: str
    candidate_name: str


class TaskUpdate(BaseModel):
    title: str
    description: str
    priority: str
    candidate_name: str
    status: str



class InterviewCreate(BaseModel):
    candidate_name: str
    interview_type: str
    meet_link: str
    scheduled_time: str


class InterviewUpdate(BaseModel):
    candidate_name: str
    interview_type: str
    meet_link: str
    scheduled_time: str
    status: str
