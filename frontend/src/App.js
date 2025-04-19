import { Toaster } from "react-hot-toast";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import PersonalDetailsPage from "./pages/PersonalDetailsPage";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import VoterIDSearchPage from "./pages/VoterIDSearchPage";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminHomePage from "./pages/AdminHomePage";
import CreateElection from "./pages/CreateElection";
import ViewVoters from "./pages/ViewVoters";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Candidates from "./pages/Candidates";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/registerpage" element={<RegistrationPage />} />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route
            path="/details"
            element={
              <ProtectedRoute>
                <PersonalDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/searchpage" element={<VoterIDSearchPage />} />
          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-election"
            element={
              <ProtectedRoute>
                <CreateElection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-voters"
            element={
              <ProtectedRoute>
                <ViewVoters />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/candidates" element={<Candidates />} />
        </Routes>
      </Router>
      <div>
        <Toaster position="top-right"></Toaster>
      </div>
    </>
  );
}

export default App;
