import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HRDashboard from "./components/HRDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>SALARITE VIRTUAL HR</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/hr" style={{ marginRight: "20px" }}>
            HR Dashboard
          </Link>
          <Link to="/employee">
            Employee Dashboard
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<HRDashboard />} />
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
