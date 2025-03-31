import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import Uploaded from "./pages/Uploaded";
import Recent from "./pages/Recent";
import Categories from "./pages/Categories";
import Bin from "./pages/Bin";
import Profile from "./pages/Profile";
import FileDetail from "./pages/FileDetail";
import Shared from "./pages/Shared";
import Logout from "./pages/Logout";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import "./styles/styles.css";

const PrivateRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>; // Show a loading state while checking auth

  return user ? element : <Navigate to="/login" />;
};

const Layout = () => {
  const location = useLocation();
  const hideNavbarPages = ["/login", "/signup"]; // Pages where navbar should be hidden

  return (
    <>
      {!hideNavbarPages.includes(location.pathname) && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
          <Route path="/uploaded" element={<PrivateRoute element={<Uploaded />} />} />
          <Route path="/recent" element={<PrivateRoute element={<Recent />} />} />
          <Route path="/categories" element={<PrivateRoute element={<Categories />} />} />
          <Route path="/bin" element={<PrivateRoute element={<Bin />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/file/:fileId" element={<PrivateRoute element={<FileDetail />} />} />
          <Route path="/shared" element={<Shared />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

export default App;
