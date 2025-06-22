import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardDragon.css";
import { toast } from "react-toastify";

export default function RestoreDeletedAdmins() {
  const [admins, setAdmins] = useState([]);

  const fetchDeletedAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/deleted-ngo-admins");
      setAdmins(res.data);
    } catch (err) {
      toast.error("Failed to load deleted NGO admins.");
    }
  };

  const restoreAdmin = async (identifier) => {
    try {
      await axios.post(`http://localhost:5000/restore-ngo-admin/${identifier}`);
      toast.success("NGO Admin restored successfully.");
      fetchDeletedAdmins();
    } catch (err) {
      toast.error("Failed to restore NGO admin.");
    }
  };

  useEffect(() => {
    fetchDeletedAdmins();
  }, []);

  return (
    <div className="dashboard">
      <h2>Restore Deleted NGO Admins</h2>
      <div className="dashboard-grid">
        {admins.length === 0 ? (
          <p>No deleted NGO Admins to restore.</p>
        ) : (
          admins.map((admin) => (
            <div key={admin.identifier} className="dashboard-card">
              <h4>{admin.username}</h4>
              <p><strong>Email:</strong> {admin.identifier}</p>
              <button onClick={() => restoreAdmin(admin.identifier)}>Restore</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
