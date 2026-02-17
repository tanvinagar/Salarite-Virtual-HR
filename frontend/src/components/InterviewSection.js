import React, { useState } from "react";
import axios from "axios";

function InterviewSection() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("Google Meet");
  const [link, setLink] = useState("");
  const [time, setTime] = useState("");

  const schedule = async () => {
    await axios.post("http://127.0.0.1:8000/interviews", {
      candidate_name: name,
      interview_mode: mode,
      meet_link: link,
      scheduled_time: time
    });
  };

  return (
    <div>
      <h3>Schedule Interview</h3>
      <input placeholder="Candidate Name" onChange={(e) => setName(e.target.value)} />
      <select onChange={(e) => setMode(e.target.value)}>
        <option>Google Meet</option>
        <option>Phone Call</option>
      </select>
      <input placeholder="Meet Link" onChange={(e) => setLink(e.target.value)} />
      <input placeholder="Scheduled Time" onChange={(e) => setTime(e.target.value)} />
      <button onClick={schedule}>Schedule Interview</button>
    </div>
  );
}

export default InterviewSection;
