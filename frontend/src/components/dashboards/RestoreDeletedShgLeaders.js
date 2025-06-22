import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardDragon.css";
import { toast } from "react-toastify";

export default function RestoreDeletedShgLeaders() {
  const [leaders, setLeaders] = useState([]);

  const fetchDeletedLeaders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/deleted-shg-leaders");
      setLeaders(res.data);
    } catch (err) {
      toast.error("Failed to load deleted SHG leaders.");
    }
  };

  const restoreLeader = async (identifier) => {
    try {
      await axios.post("http://localhost:5000/restore-shg-leader", {
        identifier,
      });
      toast.success("SHG Leader restored successfully.");
      fetchDeletedLeaders();
    } catch (err) {
      toast.error("Failed to restore SHG Leader.");
    }
  };

  useEffect(() => {
    fetchDeletedLeaders();
  }, []);

  return (
    <div className="dashboard">
      <h2>Restore Deleted SHG Leaders</h2>
      <div className="dashboard-grid">
        {leaders.length === 0 ? (
          <p>No deleted SHG Leaders to restore.</p>
        ) : (
          leaders.map((leader) => (
            <div key={leader.identifier} className="dashboard-card">
              <h4>{leader.username}</h4>
              <p><strong>Email:</strong> {leader.identifier}</p>
              <button onClick={() => restoreLeader(leader.identifier)}>Restore</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
