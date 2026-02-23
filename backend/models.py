from sqlalchemy import Column, Integer, String, Text
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    description = Column(Text)

    candidate_name = Column(String)
    hr_name = Column(String)

    priority = Column(String) 
    deadline = Column(String)

    status = Column(String, default="Pending")
    notes = Column(Text, default="")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    candidate_name = Column(String)
    hr_name = Column(String)

    interview_date = Column(String)
    mode = Column(String)  # Voice / Video / Chat
    status = Column(String, default="Scheduled")