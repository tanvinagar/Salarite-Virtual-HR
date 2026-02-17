import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCandidate, setNewCandidate] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
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

 
  const updateTaskStatus = async (task, newStatus) => {
    try {
      await axios.put(`${API}/tasks/${task.id}`, {
  title: task.title,
  description: task.description,
  priority: task.priority,   
  candidate_name: task.candidate_name,
  status: newStatus
});

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
const assignNewTask = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/tasks/", {
      title: newTitle,
      description: newDescription,
      candidate_name: newCandidate,
      priority: newPriority,
      status: "Pending"
    });

    setNewTitle("");
    setNewDescription("");
    setNewCandidate("");
    setNewPriority("Medium");

    fetchData(); 
  } catch (error) {
    console.log(error);
  }
};

  
  const totalInterviews = interviews.length;
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;

  return (
   
    <div style={styles.container}>
      <h2 style={styles.heading}>Employee Dashboard</h2>

      {/*  STATISTICS  */}
      <div style={styles.card}>
        <h3>Statistics</h3>
        <p>Total Interviews: {totalInterviews}</p>
        <p>Pending Tasks: {pendingTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
      </div>

      {/*  MY TASKS  */}
      <hr />

<h3>Assign Task to Candidate</h3>

<input
  placeholder="Task Title"
  value={newTitle}
  onChange={(e) => setNewTitle(e.target.value)}
  style={styles.input}
/>

<input
  placeholder="Description"
  value={newDescription}
  onChange={(e) => setNewDescription(e.target.value)}
  style={styles.input}
/>

<input
  placeholder="Candidate Name"
  value={newCandidate}
  onChange={(e) => setNewCandidate(e.target.value)}
  style={styles.input} 
/>

<select
  value={newPriority}
  onChange={(e) => setNewPriority(e.target.value)}
  style={styles.input}
>
  <option>Low</option>
  <option>Medium</option>
  <option>High</option>
</select>

<button onClick={assignNewTask}>
  Assign Task
</button>

<hr />

      <div style={styles.card}>
        <h3>My Tasks</h3>

        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={styles.listItem}>
              <strong>{task.title}</strong>
              <p>Candidate: {task.candidate_name}</p>

              <select
                value={task.status}
                onChange={(e) =>
                  updateTaskStatus(task, e.target.value)
                }
                style={styles.select}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))
        )}
      </div>

      {/*  MY INTERVIEWS  */}
      <div style={styles.card}>
        <h3>My Interviews</h3>

        {interviews.length === 0 ? (
          <p>No interviews scheduled</p>
        ) : (
          interviews.map(interview => (
            <div key={interview.id} style={styles.listItem}>
              <strong>{interview.candidate_name}</strong>
              <p>Type: {interview.interview_type}</p>
              <p>Time: {interview.scheduled_time}</p>
            </div>
          ))
        )}
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
   input: {
    display: "block",
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  editBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default EmployeeDashboard;
