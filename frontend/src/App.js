import React, { useState } from "react";
import EmployeeDashboard from "./components/EmployeeDashboard";
import HRDashboard from "./components/HRDashboard";

function App() {

  const [role, setRole] = useState("employer");

  return (
    <div>

      {/* Top Navigation */}
      <div style={{
        padding: 15,
        background: "#1f2937",
        color: "white",
        display: "flex",
        justifyContent: "center",
        gap: 20
      }}>
        <button onClick={() => setRole("employee")}>
          Employee Dashboard
        </button>

        <button onClick={() => setRole("hr")}>
          Virtual HR Dashboard
        </button>
      </div>

      {/* Show only one dashboard at a time */}
      {role === "employee" && <EmployeeDashboard />}
      {role === "hr" && <HRDashboard />}

    </div>
  );
}

export default App;