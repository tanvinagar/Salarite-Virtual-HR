import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function HRDashboard() {

  const [hrName, setHrName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [candidate, setCandidate] = useState("");
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("");
  const [interviews, setInterviews] = useState([]);


  const [participants, setParticipants] = useState({});
  const [newPerson, setNewPerson] = useState("");

  const fetchTasks = useCallback(() => {
    if (!hrName) return;

    axios
      .get(`http://127.0.0.1:8000/tasks/hr/${hrName}`)
      .then((res) => setTasks(res.data));
  }, [hrName]);

  const fetchInterviews = useCallback(() => {
    axios.get("http://127.0.0.1:8000/interviews")
      .then((res) => {
        const filtered = res.data.filter(i => i.hr_name === hrName);
        setInterviews(filtered);
      });
  }, [hrName]);

  useEffect(() => {
    fetchTasks();
    fetchInterviews();

    const interval = setInterval(() => {
      fetchTasks();
      fetchInterviews();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchTasks, fetchInterviews]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/tasks/${id}`,
        null,
        { params: { status } }
      );
    } catch {
      alert("Error updating status");
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
  };

  const scheduleInterview = async () => {
    await axios.post("http://127.0.0.1:8000/interviews", {
      candidate_name: candidate,
      hr_name: hrName,
      interview_date: date,
      mode
    });

    setCandidate("");
    setDate("");
    setMode("");
  };

  const deleteInterview = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/interviews/${id}`);
  };

  
  const addParticipant = (interviewId) => {
    if (!newPerson) return;

    setParticipants(prev => ({
      ...prev,
      [interviewId]: [...(prev[interviewId] || []), newPerson]
    }));

    setNewPerson("");
  };

 
  const removeParticipant = (interviewId, index) => {
    const updated = [...participants[interviewId]];
    updated.splice(index, 1);

    setParticipants(prev => ({
      ...prev,
      [interviewId]: updated
    }));
  };

  return (
    <div style={{ padding: 30 }}>

      <h2>Virtual HR Dashboard</h2>

      <h3>Enter HR Name</h3>
      <input
        value={hrName}
        onChange={(e) => setHrName(e.target.value)}
        placeholder="e.g. HR1 or Anita Verma"
      />

      <h3>Assigned Tasks</h3>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{ border: "1px solid gray", padding: 10, margin: 10 }}
        >
          <b>{task.title}</b> — {task.candidate_name} <br />

          <p><b>Description:</b> {task.description}</p>

          Priority: {task.priority} <br />
          Status: {task.status} <br />
          Deadline: {task.deadline} <br />

          <button onClick={() => updateStatus(task.id, "In Progress")}>
            In Progress
          </button>

          <button onClick={() => updateStatus(task.id, "Completed")}>
            Completed
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete Task
          </button>
        </div>
      ))}

      <h3>Schedule Interview</h3>

      <input
        placeholder="Candidate Name"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="">Select Mode</option>
        <option>Voice</option>
        <option>Video</option>
        <option>Chat</option>
      </select>

      <button onClick={scheduleInterview}>
        Schedule Interview
      </button>

      <h3>Scheduled Interviews</h3>

      {interviews.map((i) => (
        <div
          key={i.id}
          style={{ border: "1px solid gray", padding: 10, margin: 10 }}
        >
          Candidate: {i.candidate_name} <br />
          HR: {i.hr_name} <br />
          Date: {i.interview_date} <br />
          Mode: {i.mode} <br />

          <button onClick={() => deleteInterview(i.id)}>
            Delete Interview
          </button>

          {/* ⭐ NEW — Participants section */}
          <h4>Add Participants</h4>

          <input
            placeholder="Enter name or email"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
          />

          <button onClick={() => addParticipant(i.id)}>
            Add Person
          </button>

          <div style={{ marginTop: 10 }}>
            {(participants[i.id] || []).map((p, index) => (
              <div key={index}>
                👤 {p}
                <button onClick={() => removeParticipant(i.id, index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => alert("Voice Call Started")}>
              Voice
            </button>

            <button onClick={() => alert("Video Call Started")}>
              Video
            </button>

            <button onClick={() => alert("Chat Started")}>
              Chat
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default HRDashboard;