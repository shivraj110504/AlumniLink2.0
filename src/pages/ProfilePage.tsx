
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Settings, Edit, Save, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  userType: 'student' | 'alumni';
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userType }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'myEvents'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    bio: userType === 'student' 
      ? 'Computer Science student passionate about web development and machine learning.'
      : 'Software Engineer at Google with 5+ years of experience in full-stack development.',
    department: userType === 'student' ? 'Computer Science' : 'Computer Science (2018)',
    position: userType === 'alumni' ? 'Senior Software Engineer' : '',
    company: userType === 'alumni' ? 'Google' : '',
    graduationYear: userType === 'student' ? '2023' : '2018',
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    interests: ['Web Development', 'AI', 'Cloud Computing']
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Would save the profile to the backend
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };
  
  return (
    <PageLayout title="My Profile" userType={userType}>
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
        <div className="border-b border-border">
          <div className="flex">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
            <button 
              className={`tab-button ${activeTab === 'myEvents' ? 'active' : ''}`}
              onClick={() => setActiveTab('myEvents')}
            >
              My Events
            </button>
          </div>
        </div>
        
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <Button 
                variant="outline" 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save size={16} className="mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full bg-alumni-primary/20 flex items-center justify-center mb-4">
                    <span className="text-alumni-primary text-4xl">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                  {isEditing ? (
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="text-center font-medium mb-1"
                    />
                  ) : (
                    <h3 className="text-lg font-medium">{profile.name}</h3>
                  )}
                  
                  {isEditing && userType === 'alumni' ? (
                    <Input 
                      value={profile.position} 
                      onChange={(e) => setProfile({...profile, position: e.target.value})}
                      className="text-center text-sm text-muted-foreground mt-1"
                      placeholder="Your position"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {userType === 'student' ? 'Student' : profile.position}
                    </p>
                  )}
                  
                  {!isEditing ? (
                    <>
                      <div className="mt-6 space-y-2 w-full">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={16} className="text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={16} className="text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 space-y-4 w-full">
                      <div>
                        <label className="text-sm text-muted-foreground">Email (read-only)</label>
                        <Input 
                          value={profile.email} 
                          readOnly
                          className="mt-1 bg-secondary/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Phone</label>
                        <Input 
                          value={profile.phone} 
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Location</label>
                        <Input 
                          value={profile.location} 
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Biography</h3>
                    {!isEditing ? (
                      <p className="text-sm">{profile.bio}</p>
                    ) : (
                      <Textarea 
                        value={profile.bio} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="min-h-[100px]"
                      />
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Education & Work</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-alumni-primary/20 rounded-lg mt-1">
                          <GraduationCap size={20} className="text-alumni-primary" />
                        </div>
                        {isEditing ? (
                          <div className="space-y-2 flex-1">
                            <Input 
                              value={profile.department} 
                              onChange={(e) => setProfile({...profile, department: e.target.value})}
                              placeholder="Department"
                            />
                            <Input 
                              value={profile.graduationYear} 
                              onChange={(e) => setProfile({...profile, graduationYear: e.target.value})}
                              placeholder="Graduation Year"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">{profile.department}</p>
                            <p className="text-sm text-muted-foreground">
                              Graduation: {profile.graduationYear}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {userType === 'alumni' && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-alumni-primary/20 rounded-lg mt-1">
                            <Briefcase size={20} className="text-alumni-primary" />
                          </div>
                          {isEditing ? (
                            <div className="space-y-2 flex-1">
                              <Input 
                                value={profile.position} 
                                onChange={(e) => setProfile({...profile, position: e.target.value})}
                                placeholder="Position"
                              />
                              <Input 
                                value={profile.company} 
                                onChange={(e) => setProfile({...profile, company: e.target.value})}
                                placeholder="Company"
                              />
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium">{profile.position}</p>
                              <p className="text-sm text-muted-foreground">
                                {profile.company}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Skills & Interests</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.skills.map(skill => (
                            <span key={skill} className="bg-secondary px-3 py-1 rounded-full text-xs">
                              {skill}
                              {isEditing && (
                                <button 
                                  className="ml-2 text-red-400 hover:text-red-500"
                                  onClick={() => setProfile({
                                    ...profile,
                                    skills: profile.skills.filter(s => s !== skill)
                                  })}
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input 
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a new skill"
                              className="flex-1"
                              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <Button onClick={addSkill} size="sm">
                              <Plus size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.interests.map(interest => (
                            <span key={interest} className="bg-secondary px-3 py-1 rounded-full text-xs">
                              {interest}
                              {isEditing && (
                                <button 
                                  className="ml-2 text-red-400 hover:text-red-500"
                                  onClick={() => setProfile({
                                    ...profile,
                                    interests: profile.interests.filter(i => i !== interest)
                                  })}
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input 
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              placeholder="Add a new interest"
                              className="flex-1"
                              onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                            />
                            <Button onClick={addInterest} size="sm">
                              <Plus size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div></div>
                  <div>
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Confirm New Password</label>
                    <Input type="password" className="mt-1" />
                  </div>
                </div>
                <Button className="mt-4 btn-primary">Update Password</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about events and updates via email</p>
                    </div>
                    <div className="flex items-center h-6">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        defaultChecked={true}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-alumni-primary focus:ring-alumni-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
                    </div>
                    <div className="flex items-center h-6">
                      <input 
                        type="checkbox" 
                        id="eventReminders" 
                        defaultChecked={true}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-alumni-primary focus:ring-alumni-primary"
                      />
                    </div>
                  </div>
                </div>
                <Button className="mt-4 btn-primary">Save Preferences</Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'myEvents' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">My Events</h2>
            
            <div className="bg-secondary/30 p-6 rounded-lg border border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <Calendar size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No events to display</h3>
              <p className="text-muted-foreground mb-6">
                {userType === 'student' 
                  ? "You haven't joined any events yet." 
                  : "You haven't created any events yet."}
              </p>
              {userType === 'student' ? (
                <Button className="btn-primary">Browse Events</Button>
              ) : (
                <Button className="btn-primary">
                  <Plus size={16} className="mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
