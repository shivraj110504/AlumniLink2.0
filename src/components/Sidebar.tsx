
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Video, MessageSquare, FileCheck, Calendar, Users, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  userType: 'student' | 'alumni';
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Video, label: 'Live Sessions', path: `/${userType}-dashboard/sessions` },
    { icon: MessageSquare, label: 'Doubt Forum', path: `/${userType}-dashboard/doubts` },
    { icon: MessageSquare, label: 'Messages', path: `/${userType}-dashboard/messages` },
    { icon: FileCheck, label: 'Interview Prep', path: `/${userType}-dashboard/interviews` },
    { icon: Calendar, label: 'Events', path: `/${userType}-dashboard/events` },
    { icon: Users, label: 'Alumni Network', path: `/${userType}-dashboard/network` },
    { icon: User, label: 'Profile', path: `/${userType}-dashboard/profile` },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      // The navigation will happen inside the logout function
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-sidebar fixed left-0 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center">
        <NavLink to="/" className="flex items-center">
          <Logo size="sm" />
        </NavLink>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={item.label} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-in">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-alumni-primary/20 flex items-center justify-center overflow-hidden">
            {user && (
              <span className="text-alumni-primary text-sm">{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role || userType}</span>
          </div>
          <button 
            className="ml-auto flex items-center gap-2 text-muted-foreground hover:text-white"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="text-sm">Logout</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
