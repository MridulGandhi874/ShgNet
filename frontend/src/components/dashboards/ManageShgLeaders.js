import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardDragon.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ManageShgLeaders() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  const fetchLeaders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/shg-leaders");
      setLeaders(res.data);
    } catch {
      toast.error("Failed to fetch SHG leaders.");
    }
  };

  const deleteLeader = async (identifier) => {
    try {
      await axios.delete(
        `http://localhost:5000/shg-leaders?identifier=${identifier}`
      );
      toast.success("Leader removed successfully.");
      fetchLeaders();
    } catch {
      toast.error("Error deleting SHG Leader.");
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <div className="dashboard">
      <h2>Manage SHG Leaders</h2>
      <div className="dashboard-grid">
        {leaders.length === 0 ? (
          <p>No SHG Leaders found.</p>
        ) : (
          leaders.map((leader) => (
            <div key={leader.identifier} className="dashboard-card">
              <h4>{leader.username}</h4>
              <p><strong>Email:</strong> {leader.identifier}</p>
              <button onClick={() => deleteLeader(leader.identifier)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      <button
        className="logout-button"
        onClick={() => navigate("/")}
      >
        ⬅ Back
      </button>
    </div>
  );
}
