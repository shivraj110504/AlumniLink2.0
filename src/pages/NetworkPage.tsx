
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Mail, Users, Filter } from 'lucide-react';

interface Alumni {
  id: string;
  name: string;
  position: string;
  company: string;
  graduationYear: string;
  department: string;
  email: string;
  isConnected: boolean;
}

interface NetworkPageProps {
  userType: 'student' | 'alumni';
}

const NetworkPage: React.FC<NetworkPageProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected'>('all');
  
  // Mock alumni data
  const [alumni, setAlumni] = useState<Alumni[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      position: 'Software Engineer',
      company: 'Microsoft',
      graduationYear: '2019',
      department: 'Computer Science',
      email: 'priya.sharma@example.com',
      isConnected: true
    },
    {
      id: '2',
      name: 'Rahul Patel',
      position: 'Product Manager',
      company: 'Amazon',
      graduationYear: '2017',
      department: 'Computer Science',
      email: 'rahul.patel@example.com',
      isConnected: false
    },
    {
      id: '3',
      name: 'Sneha Gupta',
      position: 'Data Scientist',
      company: 'Google',
      graduationYear: '2020',
      department: 'Computer Science',
      email: 'sneha.gupta@example.com',
      isConnected: false
    }
  ]);
  
  const toggleConnection = (id: string) => {
    setAlumni(
      alumni.map(person => 
        person.id === id ? { ...person, isConnected: !person.isConnected } : person
      )
    );
  };
  
  const handleMessageClick = (person: Alumni) => {
    // Navigate to the messages page with the alumni's information
    const basePath = userType === 'alumni' ? '/alumni-dashboard/messages' : '/student-dashboard/messages';
    navigate(`${basePath}?contactId=${person.id}&contactName=${person.name}`);
  };
  
  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          person.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'connected') {
      return matchesSearch && person.isConnected;
    }
    
    return matchesSearch;
  });
  
  return (
    <PageLayout title="Alumni Network" userType={userType}>
      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Connect with Alumni</h2>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                type="text"
                placeholder="Search by name, company..."
                className="glass-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <div className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-1 flex mb-6 w-64">
          <button
            className={`flex-1 py-2 rounded-md text-center transition-all ${filter === 'all' ? 'bg-card text-white' : 'text-muted-foreground'}`}
            onClick={() => setFilter('all')}
          >
            All Alumni
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-center transition-all ${filter === 'connected' ? 'bg-card text-white' : 'text-muted-foreground'}`}
            onClick={() => setFilter('connected')}
          >
            Connected
          </button>
        </div>
        
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map(person => (
              <div key={person.id} className="bg-secondary/30 p-4 rounded-lg border border-border">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-alumni-primary/20 flex items-center justify-center">
                    <span className="text-alumni-primary text-lg font-medium">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Briefcase size={12} />
                      <span>{person.position} at {person.company}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {person.department} ({person.graduationYear})
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleMessageClick(person)}
                  >
                    <Mail size={14} />
                    <span className="text-xs">Message</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={person.isConnected ? "default" : "outline"}
                    className={person.isConnected ? "bg-alumni-primary hover:bg-alumni-primary/90 gap-1" : "gap-1"}
                    onClick={() => toggleConnection(person.id)}
                  >
                    <Users size={14} />
                    <span className="text-xs">
                      {person.isConnected ? "Connected" : "Connect"}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Users size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NetworkPage;
