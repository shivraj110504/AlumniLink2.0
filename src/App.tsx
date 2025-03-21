
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import NotFound from "./pages/NotFound";
import DoubtsForumPage from "./pages/DoubtsForumPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import NetworkPage from "./pages/NetworkPage";
import SessionsPage from "./pages/SessionsPage";
import MessagesPage from "./pages/MessagesPage";

const queryClient = new QueryClient();

// Protected route component for student routes
const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== 'student') {
    return <Navigate to="/alumni-dashboard" />;
  }
  
  return <>{children}</>;
};

// Protected route component for alumni routes
const AlumniRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (user.role !== 'alumni') {
    return <Navigate to="/student-dashboard" />;
  }
  
  return <>{children}</>;
};

// Main component with authenticated routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Student Routes */}
      <Route 
        path="/student-dashboard" 
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/doubts" 
        element={
          <StudentRoute>
            <DoubtsForumPage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/interviews" 
        element={
          <StudentRoute>
            <InterviewPrepPage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/events" 
        element={
          <StudentRoute>
            <EventsPage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/profile" 
        element={
          <StudentRoute>
            <ProfilePage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/network" 
        element={
          <StudentRoute>
            <NetworkPage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/sessions" 
        element={
          <StudentRoute>
            <SessionsPage userType="student" />
          </StudentRoute>
        } 
      />
      <Route 
        path="/student-dashboard/messages" 
        element={
          <StudentRoute>
            <MessagesPage userType="student" />
          </StudentRoute>
        } 
      />
      
      {/* Alumni Routes */}
      <Route 
        path="/alumni-dashboard" 
        element={
          <AlumniRoute>
            <AlumniDashboard />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/doubts" 
        element={
          <AlumniRoute>
            <DoubtsForumPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/interviews" 
        element={
          <AlumniRoute>
            <InterviewPrepPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/events" 
        element={
          <AlumniRoute>
            <EventsPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/profile" 
        element={
          <AlumniRoute>
            <ProfilePage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/network" 
        element={
          <AlumniRoute>
            <NetworkPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/sessions" 
        element={
          <AlumniRoute>
            <SessionsPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      <Route 
        path="/alumni-dashboard/messages" 
        element={
          <AlumniRoute>
            <MessagesPage userType="alumni" />
          </AlumniRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
