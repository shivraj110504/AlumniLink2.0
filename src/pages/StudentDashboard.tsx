
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, CheckCircle, Clock, ArrowRightCircle, SendHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


interface InterviewPrep {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

const StatCard = ({ title, subtitle, count, icon: Icon, link }: {
  title: string,
  subtitle: string,
  count: number | string,
  icon: React.ElementType,
  link: string
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card rounded-xl p-6 flex flex-col animate-fade-in cursor-pointer hover:border-alumni-primary/50 transition-colors"
      onClick={() => navigate(link)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="p-2 bg-alumni-primary/20 rounded-lg">
          <Icon size={20} className="text-alumni-primary" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-4xl font-semibold">{count}</span>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviewPreps, setInterviewPreps] = useState<InterviewPrep[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data for now
        setInterviewPreps([]);
        setEvents([]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (user && user.role !== 'student') {
      navigate('/alumni-dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userType="student" />

      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center">
          <button className="p-2 rounded-lg bg-secondary text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <h1 className="text-2xl font-semibold">Student Dashboard</h1>

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
              onClick={() => navigate('/student-dashboard/profile')}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alumni-primary"></span>
            </button>

            <button
              className="p-2 rounded-full bg-secondary"
              onClick={() => navigate('/student-dashboard/profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-2 animate-fade-in">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground mb-8 animate-fade-in">Here's what's happening in your student community.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Live Sessions"
              subtitle="Upcoming sessions"
              count={events.length}
              icon={() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video">
                <path d="m22 8-6 4 6 4V8Z" />
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
              </svg>}
              link="/student-dashboard/sessions"
            />
            <StatCard
              title="Interview Sessions"
              subtitle="Available sessions"
              count={interviewPreps.length}
              icon={() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-check">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="m9 15 2 2 4-4" />
              </svg>}
              link="/student-dashboard/interviews"
            />
            <StatCard
              title="Upcoming Events"
              subtitle="College events"
              count={events.length}
              icon={() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>}
              link="/student-dashboard/events"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <Link to="/student-dashboard/sessions" className="text-alumni-primary hover:underline flex items-center gap-1 text-sm">
              View all <ArrowRightCircle size={16} />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="glass-card rounded-xl p-6 animate-fade-in">
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="p-4 bg-secondary/30 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                    </div>
                    <button className="px-3 py-1 bg-alumni-primary rounded text-white text-sm">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Clock size={36} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Upcoming Sessions</h3>
              <p className="text-muted-foreground mb-4">There are no live sessions scheduled right now.</p>
              <p className="text-muted-foreground">Check back later or browse past recordings.</p>
            </div>
          )}

          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Doubts</h2>
              <Link to="/student-dashboard/doubts" className="text-alumni-primary hover:underline flex items-center gap-1 text-sm">
                View all doubts <ArrowRightCircle size={16} />
              </Link>
            </div>

            <div className="glass-card rounded-xl p-4 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="glass-input w-full pr-12"
                />
                <Link to="/student-dashboard/doubts">
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-alumni-primary rounded-md text-white">
                    <SendHorizontal size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Interview Preparation</h2>
              <Link to="/student-dashboard/interviews" className="text-alumni-primary hover:underline flex items-center gap-1 text-sm">
                View all interview sessions <ArrowRightCircle size={16} />
              </Link>
            </div>

            {interviewPreps.length > 0 ? (
              <div className="glass-card rounded-xl p-6 animate-fade-in">
                <div className="space-y-4">
                  {interviewPreps.slice(0, 3).map(interview => (
                    <div key={interview.id} className="p-4 bg-secondary/30 rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{interview.title}</h3>
                        <p className="text-sm text-muted-foreground">{interview.date} at {interview.time}</p>
                      </div>
                      <button className="px-3 py-1 bg-alumni-primary rounded text-white text-sm">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-medium mb-2">Practice with alumni from top companies</h3>
                <p className="text-muted-foreground mb-6">No interview sessions available right now</p>
                <p className="text-muted-foreground">Check back later for new opportunities</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
