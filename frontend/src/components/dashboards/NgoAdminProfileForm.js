import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./NgoAdminProfileForm.css";

export default function NgoAdminProfileForm({ user, onProfileSubmit }) {
  const [form, setForm] = useState({
    dob: "",
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

  const [currentStep, setCurrentStep] = useState(0);

  // Prevent "Enter" from triggering form submit on intermediate steps
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "years_of_experience" && value < 0) return;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total_shgs" ? parseInt(value) || 1 : value,
    }));
  };

  const handleShgNameChange = (index, value) => {
    const updated = [...form.shg_names];
    updated[index] = value;
    setForm((prev) => ({ ...prev, shg_names: updated }));
  };

  const addShgName = () => {
    setForm((prev) => ({
      ...prev,
      shg_names: [...prev.shg_names, ""],
      total_shgs: prev.total_shgs + 1,
    }));
  };

  const removeShgName = (index) => {
    const updated = [...form.shg_names];
    updated.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      shg_names: updated,
      total_shgs: updated.length,
    }));
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return form.dob && form.gender;
      case 1:
        return (
          form.ngo_name.trim() &&
          form.ngo_location.trim() &&
          form.district.trim() &&
          form.state.trim()
        );
      case 2:
        return form.shg_names.every((name) => name.trim().length > 0);
      case 3:
        return (
          form.contact_person.trim() &&
          form.contact_number.trim() &&
          form.designation.trim() &&
          form.years_of_experience !== "" &&
          parseInt(form.years_of_experience) >= 0
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCurrentStepValid()) {
      toast.error("Please complete the form correctly.");
      return;
    }

    const age = calculateAge(form.dob);
    if (age < 18 || age > 90) {
      toast.error("Age must be between 18 and 90.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/update-ngo-profile", {
        identifier: user.identifier,
        profile: { ...form, age },
      });
      toast.success("Profile submitted!");
      onProfileSubmit();
    } catch (err) {
      toast.error("Submission failed.");
      console.error(err);
    }
  };

  const steps = [
    {
      title: "Personal Info",
      content: (
        <>
          <label>Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </>
      ),
    },
    {
      title: "NGO Details",
      content: (
        <>
          <input name="ngo_name" placeholder="NGO Name" value={form.ngo_name} onChange={handleChange} />
          <input name="ngo_location" placeholder="Location" value={form.ngo_location} onChange={handleChange} />
          <input name="district" placeholder="District" value={form.district} onChange={handleChange} />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
        </>
      ),
    },
    {
      title: "SHG Details",
      content: (
        <>
          <div className="shg-wrapper">
            {form.shg_names.map((name, i) => (
              <div key={i} className="shg-row">
                <input
                  className="shg-input"
                  placeholder={`SHG Name ${i + 1}`}
                  value={name}
                  onChange={(e) => handleShgNameChange(i, e.target.value)}
                />
                {form.shg_names.length > 1 && (
                  <button type="button" onClick={() => removeShgName(i)} className="remove-btn">
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addShgName} className="add-btn">
              + Add SHG
            </button>
          </div>
        </>
      ),
    },
    {
      title: "Contact Info",
      content: (
        <>
          <input
            name="contact_person"
            placeholder="Contact Person"
            value={form.contact_person}
            onChange={handleChange}
          />
          <input
            name="contact_number"
            placeholder="Phone Number"
            type="tel"
            value={form.contact_number}
            onChange={handleChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />
          <input
            name="years_of_experience"
            placeholder="Years of Experience"
            type="number"
            value={form.years_of_experience}
            onChange={handleChange}
          />
        </>
      ),
    },
  ];

  return (
    <div className="profile-container">
      <h2>NGO Admin Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-step">
          <h3>{steps[currentStep].title}</h3>
          <div className="step-content">{steps[currentStep].content}</div>
        </div>

        <div className="form-navigation">
          {currentStep > 0 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
              ⬅ Prev
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isCurrentStepValid()}
            >
              Next ➡
            </button>
          ) : (
            <button
              type="submit"
              className="submit-btn"
              disabled={!isCurrentStepValid()}
            >
              ✅ Submit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
