
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ThumbsUp, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Doubt {
  id: string;
  title: string;
  content: string;
  student_id: string;
  created_at: string;
  is_resolved: boolean;
  author_name?: string;
  likes?: number;
  replies?: number;
}

interface DoubtsForumPageProps {
  userType: 'student' | 'alumni';
}

const DoubtsForumPage: React.FC<DoubtsForumPageProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedDoubtId, setExpandedDoubtId] = useState<string | null>(null);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch doubts from database
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const { data, error } = await supabase
          .from('doubts')
          .select(`
            id,
            title,
            content,
            student_id,
            created_at,
            is_resolved,
            profiles:student_id(name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }

        // Transform data to include author name
        const transformedData = data.map(doubt => ({
          ...doubt,
          author_name: doubt.profiles?.name || 'Unknown User',
          likes: Math.floor(Math.random() * 10), // Mock data for likes 
          replies: Math.floor(Math.random() * 5)  // Mock data for replies
        }));
        
        setDoubts(transformedData);
      } catch (error) {
        console.error('Error fetching doubts:', error);
        toast({
          title: "Error fetching doubts",
          description: "Could not load doubt forum data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, []);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !user) return;
    
    try {
      // Insert new doubt into database
      const { data, error } = await supabase
        .from('doubts')
        .insert({
          title: newQuestion,
          content: newQuestion, // Using the same content as title for simplicity
          student_id: user.id,
          is_resolved: false
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add to local state with author name
      const newDoubt: Doubt = {
        ...data,
        author_name: user.name,
        likes: 0,
        replies: 0
      };
      
      setDoubts([newDoubt, ...doubts]);
      setNewQuestion('');
      
      toast({
        title: "Question submitted",
        description: "Your question has been posted to the forum",
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error submitting question",
        description: "Could not post your question",
        variant: "destructive"
      });
    }
  };
  
  const filteredDoubts = doubts.filter(doubt => {
    if (activeTab === 'resolved') return doubt.is_resolved;
    if (activeTab === 'unresolved') return !doubt.is_resolved;
    return true;
  });
  
  const resolveDoubt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('doubts')
        .update({ is_resolved: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setDoubts(
        doubts.map(doubt => 
          doubt.id === id ? { ...doubt, is_resolved: true } : doubt
        )
      );
      
      toast({
        title: "Doubt resolved",
        description: "The doubt has been marked as resolved",
      });
    } catch (error) {
      console.error('Error resolving doubt:', error);
      toast({
        title: "Error resolving doubt",
        description: "Could not update the doubt status",
        variant: "destructive"
      });
    }
  };
  
  const toggleExpandDoubt = (id: string) => {
    setExpandedDoubtId(expandedDoubtId === id ? null : id);
  };
  
  const handleSolveClick = (doubt: Doubt) => {
    const basePath = userType === 'alumni' ? '/alumni-dashboard/messages' : '/student-dashboard/messages';
    navigate(`${basePath}?contactId=${doubt.student_id}&contactName=${doubt.author_name}&fromDoubt=true`);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  if (loading) {
    return (
      <PageLayout title="Doubt Forum" userType={userType}>
        <div className="glass-card rounded-xl p-6 animate-fade-in text-center">
          <p>Loading doubts...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Doubt Forum" userType={userType}>
      <div className="glass-card rounded-xl p-6 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <div className="flex gap-2">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="glass-input flex-1"
              disabled={userType !== 'student'}
            />
            <Button 
              onClick={handleSubmitQuestion} 
              className="btn-primary"
              disabled={userType !== 'student'}
            >
              <Send size={16} className="mr-2" />
              Submit
            </Button>
          </div>
          {userType !== 'student' && (
            <p className="text-sm text-muted-foreground mt-2">Only students can post questions</p>
          )}
        </div>
        
        <div className="border-t border-border pt-6">
          <div className="flex mb-6">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Doubts
            </button>
            <button
              className={`tab-button ${activeTab === 'unresolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('unresolved')}
            >
              Unresolved
            </button>
            <button
              className={`tab-button ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved
            </button>
          </div>
          
          <div className="space-y-4">
            {filteredDoubts.length > 0 ? (
              filteredDoubts.map(doubt => (
                <div 
                  key={doubt.id} 
                  className={`bg-secondary/30 p-4 rounded-lg border border-border transition-all ${expandedDoubtId === doubt.id ? 'ring-1 ring-primary' : ''}`}
                >
                  <div 
                    className="flex justify-between cursor-pointer"
                    onClick={() => toggleExpandDoubt(doubt.id)}
                  >
                    <p className="font-medium">{doubt.author_name}</p>
                    <p className="text-sm text-muted-foreground">{formatTimestamp(doubt.created_at)}</p>
                  </div>
                  <p className="my-2">{doubt.title}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white">
                      <ThumbsUp size={14} />
                      {doubt.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white">
                      <MessageSquare size={14} />
                      {doubt.replies}
                    </button>
                    {userType === 'alumni' && !doubt.is_resolved && (
                      <div className="ml-auto flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-sm flex items-center gap-1 text-alumni-primary hover:text-alumni-primary/80 border-alumni-primary/30 hover:bg-alumni-primary/10"
                          onClick={() => handleSolveClick(doubt)}
                        >
                          <MessageSquare size={14} />
                          Solve via Message
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-sm flex items-center gap-1 text-alumni-primary hover:text-alumni-primary/80 border-alumni-primary/30 hover:bg-alumni-primary/10"
                          onClick={() => resolveDoubt(doubt.id)}
                        >
                          <CheckCircle size={14} />
                          Mark as Resolved
                        </Button>
                      </div>
                    )}
                    {doubt.is_resolved && (
                      <span className="ml-auto flex items-center gap-1 text-sm text-green-500">
                        <CheckCircle size={14} />
                        Resolved
                      </span>
                    )}
                    {expandedDoubtId === doubt.id && !doubt.is_resolved && userType === 'student' && (
                      <Button 
                        className="ml-auto flex items-center gap-2"
                        size="sm"
                        variant="default"
                      >
                        Ask Follow-up
                        <ArrowRight size={14} />
                      </Button>
                    )}
                  </div>
                  
                  {expandedDoubtId === doubt.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Click the buttons above to interact with this doubt.
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No doubts to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DoubtsForumPage;
