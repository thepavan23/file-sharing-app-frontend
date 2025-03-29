import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Clear token or user data
    navigate("/Login"); // Redirect to Home Page or Login Page
  }, [navigate]);

  return <h2>Logging out...</h2>;
};

export default Logout;
