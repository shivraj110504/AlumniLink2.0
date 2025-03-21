
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Plus, ThumbsUp, X, Link } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isInterested: boolean;
  organizer: string;
  type: 'conference' | 'workshop' | 'meetup' | 'hackathon';
  meetLink?: string;
}

interface EventsPageProps {
  userType: 'student' | 'alumni';
}

const EventsPage: React.FC<EventsPageProps> = ({ userType }) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  // Mock data for events
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Technical Workshop on Cloud Computing',
      description: 'Learn about AWS, Azure, and Google Cloud fundamentals in this workshop conducted by industry experts.',
      date: 'June 20, 2023',
      time: '10:00 AM - 2:00 PM',
      location: 'Engineering Block, Room 302',
      attendees: 45,
      isInterested: false,
      organizer: 'Computer Science Department',
      type: 'workshop',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'Annual Alumni Reunion',
      description: 'Join us for the annual alumni reunion where you can network with graduates across different batches.',
      date: 'July 15, 2023',
      time: '6:00 PM - 9:00 PM',
      location: 'College Auditorium',
      attendees: 120,
      isInterested: false,
      organizer: 'Alumni Association',
      type: 'meetup'
    }
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'workshop' as const,
    meetLink: ''
  });
  
  const toggleInterest = (id: string) => {
    setEvents(
      events.map(event => 
        event.id === id ? { ...event, isInterested: !event.isInterested, attendees: event.isInterested ? event.attendees - 1 : event.attendees + 1 } : event
      )
    );
  };
  
  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      attendees: 0,
      isInterested: false,
      organizer: 'Shivraj Taware'
    };
    
    setEvents([event, ...events]);
    setOpenCreateDialog(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'workshop',
      meetLink: ''
    });
  };
  
  return (
    <PageLayout title="College Events" userType={userType}>
      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          {userType === 'alumni' && (
            <Button className="btn-primary" onClick={() => setOpenCreateDialog(true)}>
              <Plus size={16} className="mr-2" />
              Create Event
            </Button>
          )}
        </div>
        
        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map(event => (
              <div key={event.id} className="bg-secondary/30 p-6 rounded-lg border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-alumni-primary/20 text-alumni-primary">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-muted-foreground" />
                    <span>{event.attendees} attendees</span>
                  </div>
                  
                  {event.meetLink && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Link size={16} className="text-muted-foreground" />
                      <a 
                        href={event.meetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-alumni-primary hover:underline"
                      >
                        Google Meet Link
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Organized by: {event.organizer}</span>
                  <Button
                    variant={event.isInterested ? "default" : "outline"}
                    className={event.isInterested ? "bg-alumni-primary hover:bg-alumni-primary/90" : ""}
                    onClick={() => toggleInterest(event.id)}
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    {event.isInterested ? "Interested" : "Mark Interested"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Calendar size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-6">There are no events scheduled at the moment.</p>
            {userType === 'alumni' && (
              <Button className="btn-primary" onClick={() => setOpenCreateDialog(true)}>
                <Plus size={16} className="mr-2" />
                Create Event
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="e.g., Technical Workshop"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Brief description of the event"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="e.g., Engineering Block, Room 302"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <select 
                className="glass-input w-full"
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="meetup">Meetup</option>
                <option value="hackathon">Hackathon</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Meet Link (Optional)</label>
              <Input 
                value={newEvent.meetLink}
                onChange={(e) => setNewEvent({...newEvent, meetLink: e.target.value})}
                placeholder="e.g., https://meet.google.com/abc-defg-hij"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleCreateEvent}>
              <Plus size={16} className="mr-2" />
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default EventsPage;
