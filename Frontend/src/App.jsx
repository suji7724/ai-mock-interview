import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewScreen from "./pages/InterviewScreen";
import Feedback from "./pages/Feedback";
import Assesment from "./pages/Assesment";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ProtectedRoute  from "./components/ProtectedRoute";


function App() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>}
          
        />
        <Route path="/interview-setup" element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>}
        />
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewScreen />
          </ProtectedRoute>
          
          } 
        />
        <Route path="/feedback/:id" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        
          } 
        />
        <Route path="/assesment" element={
          <ProtectedRoute>
            <Assesment />
          </ProtectedRoute>
          
          } 
        />
        <Route path="/resume-analyzer" element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;  
