import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/DashboardDragon.css";

export default function ManageNgoAdmins() {
  const [ngoAdmins, setNgoAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/ngo-admins");
      setNgoAdmins(res.data);
    } catch (err) {
      console.error("Error fetching NGO admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (identifier) => {
    try {
      await axios.delete(`http://localhost:5000/ngo-admins/${identifier}`);
      setNgoAdmins((prev) => prev.filter((admin) => admin.identifier !== identifier));
    } catch (err) {
      console.error("Error deleting NGO admin:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="dashboard">
      <h2>Manage NGO Admins</h2>
      {loading ? (
        <p>Loading...</p>
      ) : ngoAdmins.length === 0 ? (
        <p>No NGO Admins found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>NGO Name</th>
              <th>Staff</th>
              <th>Location</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ngoAdmins.map((admin) => (
              <tr key={admin.identifier}>
                <td>{admin.username}</td>
                <td>{admin.age || "-"}</td>
                <td>{admin.ngoName || "-"}</td>
                <td>{admin.ngoStaff || "-"}</td>
                <td>{admin.location || "-"}</td>
                <td>{admin.ngoType || "-"}</td>
                <td>
                  <button onClick={() => deleteAdmin(admin.identifier)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
