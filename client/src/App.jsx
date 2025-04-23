import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
// import Search from "./pages/Search";
// import Explore from "./pages/Explore";
// import Reels from "./pages/Reels";
// import Messages from "./pages/Messages";
// import Notifications from "./pages/Notifications";
// import Create from "./pages/Create";
import { getProfile, clearError, clearSuccess } from "./redux/auth/authSlice";
import { resetPostState, clearPostErrors } from "./redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const dispatch = useDispatch();
  const {
    error: authError,
    message: authMessage,
    isAuthenticated,
    success: authSuccess,
  } = useSelector((state) => state.auth);
  const {
    loading,
    error: postError,
    success: postSuccess,
    message: postMessage,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    if (authError || postError) {
      if (authError) dispatch(clearError());
      if (postError) dispatch(clearPostErrors());
    }
  }, [authError, postError, dispatch]);

  useEffect(() => {
    if (authSuccess || postSuccess) {
      if (authSuccess) dispatch(clearSuccess());
      if (postSuccess) dispatch(resetPostState());
    }
  }, [authSuccess, postSuccess, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verify" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 
        <Route path="/explore" element={<Explore />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/create" element={<Create />} /> */}
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
