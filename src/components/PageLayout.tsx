
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, ChevronLeft, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  userType: 'student' | 'alumni';
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, userType }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userType={userType} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center">
          <button 
            className="p-2 rounded-lg bg-secondary text-muted-foreground"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </button>
          
          <h1 className="text-2xl font-semibold">{title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 rounded-lg bg-secondary text-white border border-border focus:outline-none focus:ring-2 focus:ring-alumni-primary/50 w-64"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <div className="relative">
              <button 
                className="p-2 rounded-lg bg-secondary text-muted-foreground relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alumni-primary"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">No new notifications</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
              <button 
                className="p-2 rounded-full bg-secondary"
                onClick={() => navigate(`/${userType}-dashboard/profile`)}
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
