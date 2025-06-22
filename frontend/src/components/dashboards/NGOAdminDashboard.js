import React, { useState } from "react";
import "./NgoAdminProfileForm.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function NgoAdminProfileForm({ user, onProfileSubmit }) {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    ngo_name: "",
    ngo_location: "",
    district: "",
    state: "",
    total_shgs: 1,
    shg_names: [""],
    contact_person: "",
    contact_number: "",
    designation: "",
    years_of_experience: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShgNameChange = (index, value) => {
    const updated = [...form.shg_names];
    updated[index] = value;
    setForm((prev) => ({ ...prev, shg_names: updated }));
  };

  const addShgName = () => {
    setForm((prev) => ({ ...prev, shg_names: [...prev.shg_names, ""] }));
  };

  const removeShgName = (index) => {
    const updated = [...form.shg_names];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, shg_names: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/update-ngo-profile", {
        identifier: user.identifier,
        profile: form,
      });
      toast.success("Profile submitted!");
      setSubmitted(true);
      onProfileSubmit(); // Let parent know it's done
    } catch {
      toast.error("Submission failed.");
    }
  };

  if (submitted || user.profile_filled) {
    return <p className="submitted-message">✅ Profile already submitted.</p>;
  }

  return (
    <div className="profile-wrapper">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>NGO Admin Profile</h2>

        <div className="form-section">
          <h3>Personal Info</h3>
          <div className="form-grid">
            <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>NGO Details</h3>
          <div className="form-grid">
            <input name="ngo_name" placeholder="NGO Name" value={form.ngo_name} onChange={handleChange} />
            <input name="ngo_location" placeholder="Location" value={form.ngo_location} onChange={handleChange} />
            <input name="district" placeholder="District" value={form.district} onChange={handleChange} />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h3>SHG Details</h3>
          <div className="shg-wrapper">
            {form.shg_names.map((name, i) => (
              <div key={i} className="shg-row">
                <input
                  placeholder={`SHG Name ${i + 1}`}
                  value={name}
                  onChange={(e) => handleShgNameChange(i, e.target.value)}
                />
                {i > 0 && (
                  <button type="button" onClick={() => removeShgName(i)} className="remove-btn">×</button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addShgName}>+ Add SHG</button>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact & Work Info</h3>
          <div className="form-grid">
            <input name="contact_person" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} />
            <input name="contact_number" placeholder="Phone Number" value={form.contact_number} onChange={handleChange} />
            <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
            <input name="years_of_experience" placeholder="Years of Experience" value={form.years_of_experience} onChange={handleChange} />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="submit-btn">Submit Profile</button>
        </div>
      </form>
    </div>
  );
}
