
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileCheck, Video, Plus, X, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface InterviewSession {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  alumni: string;
  status: 'upcoming' | 'completed';
  meetLink?: string;
}

interface InterviewPrepPageProps {
  userType: 'student' | 'alumni';
}

const InterviewPrepPage: React.FC<InterviewPrepPageProps> = ({ userType }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  // Mock data for interview sessions
  const [sessions, setSessions] = useState<InterviewSession[]>([
    {
      id: '1',
      title: 'Frontend Developer Mock Interview',
      company: 'Google',
      date: 'June 15, 2023',
      time: '10:00 AM',
      duration: '45 minutes',
      alumni: 'Suresh Kumar',
      status: 'upcoming',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'System Design Interview Practice',
      company: 'Amazon',
      date: 'May 8, 2023',
      time: '2:30 PM',
      duration: '60 minutes',
      alumni: 'Amrita Patel',
      status: 'completed'
    }
  ]);

  const [newSession, setNewSession] = useState({
    title: '',
    company: '',
    date: '',
    time: '',
    duration: '',
    meetLink: ''
  });
  
  const handleCreateSession = () => {
    // Validate form
    if (!newSession.title || !newSession.company || !newSession.date || !newSession.time || !newSession.duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new session
    const session: InterviewSession = {
      id: Date.now().toString(),
      ...newSession,
      alumni: 'You', // Current user name would be used in a real app
      status: 'upcoming'
    };
    
    setSessions([session, ...sessions]);
    setOpenCreateDialog(false);
    
    // Reset form
    setNewSession({
      title: '',
      company: '',
      date: '',
      time: '',
      duration: '',
      meetLink: ''
    });

    toast({
      title: "Interview session created",
      description: "Your interview prep session has been scheduled successfully"
    });
  };

  const handleStartSession = (meetLink: string | undefined) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    } else {
      toast({
        title: "No meeting link",
        description: "This session doesn't have a meeting link set up",
        variant: "destructive"
      });
    }
  };
  
  const filteredSessions = sessions.filter(session => session.status === activeTab);
  
  return (
    <PageLayout title="Interview Preparation" userType={userType}>
      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Interview Sessions</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map(session => (
              <div key={session.id} className="bg-secondary/30 p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.company}</p>
                  </div>
                  <div className="p-2 bg-alumni-primary/20 rounded-lg">
                    <FileCheck size={20} className="text-alumni-primary" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Alumni:</span>
                    <span>{session.alumni}</span>
                  </div>
                  {session.meetLink && (
                    <div className="flex items-center gap-2 text-sm">
                      <Link size={14} className="text-muted-foreground" />
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
                
                <div className="mt-4">
                  {session.status === 'upcoming' ? (
                    <Button 
                      className="w-full bg-alumni-primary hover:bg-alumni-primary/90"
                      onClick={() => handleStartSession(session.meetLink)}
                    >
                      <Video size={16} className="mr-2" />
                      {userType === 'student' ? 'Join Session' : 'Start Session'}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      View Recording
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <FileCheck size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No {activeTab} interview sessions</h3>
            <p className="text-muted-foreground mb-6">
              {userType === 'student' 
                ? "You don't have any interview sessions scheduled yet." 
                : "You haven't created any interview sessions yet."}
            </p>
            {userType === 'student' ? (
              <Button className="btn-primary">Browse Available Sessions</Button>
            ) : (
              <Button className="btn-primary" onClick={() => setOpenCreateDialog(true)}>
                <Plus size={16} className="mr-2" />
                Create Interview Session
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Interview Session Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Create Interview Session</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input 
                id="title"
                value={newSession.title}
                onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                placeholder="e.g., Frontend Developer Mock Interview"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company/Role Focus</Label>
              <Input 
                id="company"
                value={newSession.company}
                onChange={(e) => setNewSession({...newSession, company: e.target.value})}
                placeholder="e.g., Google, Frontend Developer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time"
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input 
                id="duration"
                value={newSession.duration}
                onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                placeholder="e.g., 45 minutes"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetLink">Google Meet Link</Label>
              <Input 
                id="meetLink"
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

export default InterviewPrepPage;
