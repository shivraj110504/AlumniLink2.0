
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goHome = () => {
    if (user) {
      // Redirect based on user role
      const dashboardPath = user.role === 'student' ? '/student-dashboard' : '/alumni-dashboard';
      navigate(dashboardPath);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-alumni-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or you may not have permission to access it.
        </p>
        <Button 
          onClick={goHome}
          className="bg-alumni-primary hover:bg-alumni-primary/90"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
