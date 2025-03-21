
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Video, Users, Plus, File, X, Link } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  attendees: number;
  status: 'upcoming' | 'completed' | 'live';
  materials?: string[];
  meetLink?: string;
}

interface SessionsPageProps {
  userType: 'student' | 'alumni';
}

const SessionsPage: React.FC<SessionsPageProps> = ({ userType }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  // Mock data for live sessions
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn the basics of React Hooks and how to use them in your projects.',
      date: 'June 18, 2023',
      time: '3:00 PM',
      duration: '60 minutes',
      host: 'Ankit Sharma',
      attendees: 24,
      status: 'upcoming',
      materials: ['React Hooks Cheatsheet.pdf', 'Example Project.zip'],
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript concepts like closures, prototypes, and async patterns.',
      date: 'May 10, 2023',
      time: '4:30 PM',
      duration: '90 minutes',
      host: 'Priya Patel',
      attendees: 45,
      status: 'completed',
      materials: ['Advanced JS Slides.pdf'],
      meetLink: 'https://meet.google.com/xyz-abcd-efg'
    }
  ]);
  
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    meetLink: ''
  });
  
  const handleCreateSession = () => {
    // Logic to create a new session
    const session: Session = {
      id: Date.now().toString(),
      ...newSession,
      host: user?.name || 'Alumni',
      attendees: 0,
      status: 'upcoming'
    };
    
    setSessions([session, ...sessions]);
    setOpenCreateDialog(false);
    setNewSession({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      meetLink: ''
    });
  };

  const handleStartSession = (meetLink: string | undefined) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  };
  
  const filteredSessions = sessions.filter(session => 
    activeTab === 'upcoming' ? session.status !== 'completed' : session.status === 'completed'
  );
  
  return (
    <PageLayout title="Live Sessions" userType={userType}>
      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Learning Sessions</h2>
          {userType === 'alumni' && (
            <Button className="btn-primary" onClick={() => setOpenCreateDialog(true)}>
              <Plus size={16} className="mr-2" />
              Create Session
            </Button>
          )}
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-1 flex mb-6 w-64">
          <button
            className={`flex-1 py-2 rounded-md text-center transition-all ${activeTab === 'upcoming' ? 'bg-card text-white' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-center transition-all ${activeTab === 'completed' ? 'bg-card text-white' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
        
        {filteredSessions.length > 0 ? (
          <div className="space-y-6">
            {filteredSessions.map(session => (
              <div key={session.id} className="bg-secondary/30 p-6 rounded-lg border border-border">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{session.time} ({session.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{session.attendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Host:</span>
                        <span>{session.host}</span>
                      </div>
                      
                      {session.meetLink && (
                        <div className="flex items-center gap-2 text-sm col-span-2">
                          <Link size={16} className="text-muted-foreground" />
                          <a 
                            href={session.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-alumni-primary hover:underline"
                          >
                            Google Meet Link
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {session.materials && session.materials.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Session Materials:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.materials.map((material, index) => (
                            <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-xs">
                              <File size={12} />
                              <span>{material}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-48 shrink-0">
                    {session.status === 'upcoming' ? (
                      <Button 
                        className="w-full bg-alumni-primary hover:bg-alumni-primary/90"
                        onClick={() => userType === 'alumni' ? handleStartSession(session.meetLink) : session.meetLink ? window.open(session.meetLink, '_blank') : null}
                      >
                        <Video size={16} className="mr-2" />
                        {userType === 'student' ? 'Join Session' : 'Start Session'}
                      </Button>
                    ) : session.status === 'live' ? (
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600"
                        onClick={() => session.meetLink ? window.open(session.meetLink, '_blank') : null}
                      >
                        <Video size={16} className="mr-2" />
                        Join Live Session
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        View Recording
                      </Button>
                    )}
                    
                    {userType === 'alumni' && session.status === 'upcoming' && (
                      <Button variant="outline" className="w-full mt-2">
                        Edit Session
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Video size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No {activeTab} sessions</h3>
            <p className="text-muted-foreground mb-6">
              {userType === 'student' 
                ? "There are no sessions scheduled at the moment." 
                : "You haven't created any sessions yet."}
            </p>
            {userType === 'alumni' && (
              <Button className="btn-primary" onClick={() => setOpenCreateDialog(true)}>
                <Plus size={16} className="mr-2" />
                Create Session
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Create Session Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Title</label>
              <Input 
                value={newSession.title}
                onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                placeholder="e.g., Introduction to React"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={newSession.description}
                onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                placeholder="Brief description of the session"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input 
                value={newSession.duration}
                onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                placeholder="e.g., 60 minutes"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Meet Link</label>
              <Input 
                value={newSession.meetLink}
                onChange={(e) => setNewSession({...newSession, meetLink: e.target.value})}
                placeholder="e.g., https://meet.google.com/abc-defg-hij"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleCreateSession}>
              <Plus size={16} className="mr-2" />
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SessionsPage;
