import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, CheckCircle, ArrowRightCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('doubts');
  const [doubtsTab, setDoubtsTab] = useState('unresolved');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userType="alumni" />
      
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center">
          <button className="p-2 rounded-lg bg-secondary text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          
          <h1 className="text-2xl font-semibold">Alumni Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 rounded-lg bg-secondary text-white border border-border focus:outline-none focus:ring-2 focus:ring-alumni-primary/50 w-64"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <button 
              className="p-2 rounded-lg bg-secondary text-muted-foreground relative"
              onClick={() => navigate('/alumni-dashboard/profile')}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alumni-primary"></span>
            </button>
            
            <button 
              className="p-2 rounded-full bg-secondary"
              onClick={() => navigate('/alumni-dashboard/profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-2 animate-fade-in">Welcome, {user?.name || 'Alumni'}!</h2>
          <p className="text-muted-foreground mb-8 animate-fade-in">Manage your sessions, events and help students with their doubts.</p>
          
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="border-b border-border">
              <div className="flex">
                <button 
                  className={`tab-button ${activeTab === 'doubts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('doubts')}
                >
                  Student Doubts
                </button>
                <button 
                  className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  Sessions
                </button>
                <button 
                  className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  Events
                </button>
              </div>
            </div>
            
            {activeTab === 'doubts' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Student Doubts</h3>
                
                <div className="bg-secondary/50 rounded-lg p-1 flex mb-6">
                  <button
                    className={`flex-1 py-2 rounded-md text-center transition-all ${doubtsTab === 'unresolved' ? 'bg-card text-white' : 'text-muted-foreground'}`}
                    onClick={() => setDoubtsTab('unresolved')}
                  >
                    Unresolved
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-md text-center transition-all ${doubtsTab === 'resolved' ? 'bg-card text-white' : 'text-muted-foreground'}`}
                    onClick={() => setDoubtsTab('resolved')}
                  >
                    Resolved
                  </button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-muted-foreground" />
                  </div>
                  <h4 className="text-xl font-medium mb-2">All doubts are resolved! Great job.</h4>
                  <Link to="/alumni-dashboard/doubts">
                    <Button variant="outline" className="mt-4">View All Doubts</Button>
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'sessions' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your Sessions</h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Manage your upcoming and past sessions</p>
                  <Link to="/alumni-dashboard/sessions">
                    <Button className="btn-primary flex items-center gap-2">
                      <Plus size={16} />
                      Create Session
                    </Button>
                  </Link>
                </div>
                
                <div className="glass-card rounded-xl p-8 text-center mt-8">
                  <p className="text-muted-foreground mb-4">You haven't created any sessions yet.</p>
                  <p className="text-muted-foreground">Create a new session to help students with their learning journey.</p>
                  <Link to="/alumni-dashboard/sessions">
                    <Button className="btn-primary mt-4">Manage Sessions</Button>
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'events' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">College Events</h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">View and manage college events</p>
                  <Link to="/alumni-dashboard/events">
                    <Button className="btn-primary flex items-center gap-2">
                      <Plus size={16} />
                      Create Event
                    </Button>
                  </Link>
                </div>
                
                <div className="glass-card rounded-xl p-8 text-center mt-8">
                  <p className="text-muted-foreground mb-4">No upcoming events to display.</p>
                  <p className="text-muted-foreground">Create a new event or check back later.</p>
                  <Link to="/alumni-dashboard/events">
                    <Button className="btn-primary mt-4">Manage Events</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
