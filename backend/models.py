from sqlalchemy import Column, Integer, String
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    priority = Column(String)
    candidate_name = Column(String)
    status = Column(String, default="Pending")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String)
    interview_type = Column(String)  
    meet_link = Column(String)
    scheduled_time = Column(String)
    status = Column(String, default="Scheduled")
