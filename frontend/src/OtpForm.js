import React, { useState } from "react";

const OtpForm = ({ identifier }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp }),
    });
    const result = await res.json();
    alert(result.message || result.error);
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </>
  );
};

export default OtpForm;
