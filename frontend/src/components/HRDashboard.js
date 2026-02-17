import React, { useEffect, useState } from "react";
import axios from "axios";

function HRDashboard() {
  const [candidate, setCandidate] = useState("");
  const [mode, setMode] = useState("Google Meet");
  const [link, setLink] = useState("");
  const [time, setTime] = useState("");
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksRes = await axios.get(`${API}/tasks/`);
      const interviewsRes = await axios.get(`${API}/interviews/`);

      setTasks(tasksRes.data);
      setInterviews(interviewsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteInterview = async (id) => {
    try {
      await axios.delete(`${API}/interviews/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const scheduleInterview = async () => {
    try {
      if (editingInterviewId) {
        await axios.put(`${API}/interviews/${editingInterviewId}`, {
          candidate_name: candidate,
          interview_type: mode,
          meet_link: link,
          scheduled_time: time
        });
        setEditingInterviewId(null);
      } else {
        await axios.post(`${API}/interviews/`, {
          candidate_name: candidate,
          interview_type: mode,
          meet_link: link,
          scheduled_time: time
        });
      }

      setCandidate("");
      setMode("Google Meet");
      setLink("");
      setTime("");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const editInterview = (interview) => {
    setEditingInterviewId(interview.id);
    setCandidate(interview.candidate_name);
    setMode(interview.interview_type);
    setLink(interview.meet_link || "");
    setTime(interview.scheduled_time);
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;

  const totalInterviews = interviews.length;
  const googleMeetCount = interviews.filter(i => i.interview_type === "Google Meet").length;
  const phoneCallCount = interviews.filter(i => i.interview_type === "Phone Call").length;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>HR Dashboard</h2>

      {/* STATISTICS */}
      <div style={styles.card}>
        <h3>Statistics</h3>
        <p>Total Tasks: {totalTasks}</p>
        <p>Pending Tasks: {pendingTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Total Interviews: {totalInterviews}</p>
        <p>Google Meet: {googleMeetCount}</p>
        <p>Phone Call: {phoneCallCount}</p>
      </div>

      {/* SCHEDULE INTERVIEW */}
      <div style={styles.card}>
        <h3>{editingInterviewId ? "Update Interview" : "Schedule Interview"}</h3>

        <input
          placeholder="Candidate Name"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          style={styles.input}
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={styles.input}
        >
          <option>Google Meet</option>
          <option>Phone Call</option>
        </select>

        {mode === "Google Meet" && (
          <input
            placeholder="Meet Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          placeholder="Scheduled Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />

        <button style={styles.editBtn} onClick={scheduleInterview}>
          {editingInterviewId ? "Update Interview" : "Schedule Interview"}
        </button>
      </div>

      {/* ALL TASKS */}
      <div style={styles.card}>
        <h3>All Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={styles.listItem}>
              <strong>{task.title}</strong>
              <p>Candidate: {task.candidate_name}</p>
              <p>Status: {task.status}</p>
            </div>
          ))
        )}
      </div>

      {/* LIVE INTERVIEW STATUS */}
      <div style={styles.card}>
        <h3>Live Interview Status</h3>

        <h4>Google Meet Interviews ({googleMeetCount})</h4>
        {interviews
          .filter(i => i.interview_type === "Google Meet")
          .map(interview => (
            <div key={interview.id} style={styles.listItem}>
              <p><strong>{interview.candidate_name}</strong></p>
              <p>Time: {interview.scheduled_time}</p>

              <button
                style={styles.editBtn}
                onClick={() => editInterview(interview)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteInterview(interview.id)}
              >
                Delete
              </button>
            </div>
          ))}

        <h4 style={{ marginTop: "20px" }}>
          Phone Call Interviews ({phoneCallCount})
        </h4>
        {interviews
          .filter(i => i.interview_type === "Phone Call")
          .map(interview => (
            <div key={interview.id} style={styles.listItem}>
              <p><strong>{interview.candidate_name}</strong></p>
              <p>Time: {interview.scheduled_time}</p>

              <button
                style={styles.editBtn}
                onClick={() => editInterview(interview)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteInterview(interview.id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#1f2937"
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "10px 0"
  },
  editBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    marginRight: "10px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc"
  }
};

export default HRDashboard;
