import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const VerifyEmail = () => {
    const [email, setEmail] = useState(""); // Define email state
    const [code, setCode] = useState(""); // Define verification code state
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            console.log("Sending verification request:", { email, code });

            const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
                email,
                code,
            });

            alert(response.data.message);
            navigate("/login"); // Redirect to login after verification
        } catch (err) {
            console.error("Verification error:", err);
            setMessage("Verification failed. Try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Verify Email</h2>
            {message && <p className="error">{message}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />
            <button onClick={handleVerify}>Verify</button>
        </div>
    );
};

export default VerifyEmail;
