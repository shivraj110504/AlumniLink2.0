import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, Send, Search, Plus, Trash2,
  ArrowLeft, MoreVertical, Phone, Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  senderName?: string;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  role: 'student' | 'alumni';
}

interface GroupedMessages {
  [date: string]: Message[];
}

interface MessagesPageProps {
  userType: 'student' | 'alumni';
}

const MessagesPage: React.FC<MessagesPageProps> = ({ userType }) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Mock real-time subscription
  }, [user]);

  const handleMessageChange = async (payload: any) => {
    // Mock handler
  };

  const fetchContacts = async () => {
    if (!user) return;

    try {
      // Mock contacts
      setContacts([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error loading contacts",
        description: "Could not load your message contacts",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  useEffect(() => {
    const contactId = searchParams.get('contactId');
    const contactName = searchParams.get('contactName');
    const fromDoubt = searchParams.get('fromDoubt');

    if (contactId && contactName && user) {
      // Mock contact selection logic
    }
  }, [searchParams, contacts, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact || !user) return;

      try {
        // Mock messages
        setMessages([]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedContact, user]);

  const handleSendMessageWithText = async (text: string, receiverId: string) => {
    if (!text.trim() || !user) return;

    try {
      // Mock send message
      const newMessage: Message = {
        id: Math.random().toString(),
        sender_id: user.id,
        receiver_id: receiverId,
        content: text,
        created_at: new Date().toISOString(),
        senderName: user.name
      };

      setMessages([...messages, newMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Your message could not be sent",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    if (!selectedContact) return;

    handleSendMessageWithText(messageInput, selectedContact.id);
    setMessageInput('');
  };

  const handleDeleteChat = async (contactId: string) => {
    if (!user) return;

    try {
      // Mock delete chat
      setMessages([]);

      toast({
        title: "Chat deleted",
        description: "All messages have been deleted from this conversation.",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error deleting chat",
        description: "Could not delete the conversation",
        variant: "destructive"
      });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContactTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setMobileView('chat');
  };

  const groupedMessages = messages.reduce((groups: GroupedMessages, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && contacts.length === 0) {
    return (
      <PageLayout title="Messages" userType={userType}>
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in h-[calc(100vh-12rem)] flex items-center justify-center">
          <p>Loading conversations...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Messages" userType={userType}>
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in h-[calc(100vh-12rem)]">
        <div className="grid h-full" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
          <div className={`lg:grid lg:grid-cols-12 h-full ${mobileView === 'list' ? 'block' : 'hidden lg:grid'
            }`}>
            <div className={`${mobileView === 'chat' ? 'hidden lg:block' : 'block'
              } lg:col-span-4 border-r border-border bg-card`}>
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  {userType === 'student' && (
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Plus size={20} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Input
                    className="bg-secondary/50 pl-10"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>

                <div className="space-y-1">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                      <div
                        key={contact.id}
                        className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${selectedContact?.id === contact.id
                          ? 'bg-secondary/70'
                          : 'hover:bg-secondary/40'
                          }`}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={`${contact.isOnline ? 'bg-alumni-primary/20' : 'bg-secondary'
                              }`}>
                              {contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></span>
                          )}
                        </div>

                        <div className="ml-3 flex-1 overflow-hidden">
                          <h4 className="font-medium truncate">{contact.name}</h4>
                          <div className="flex">
                            <p className="text-sm text-muted-foreground truncate mr-1 max-w-[120px]">
                              {contact.lastMessage}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              · {formatContactTime(contact.lastMessageTime)}
                            </span>
                          </div>
                        </div>

                        {contact.unreadCount > 0 && (
                          <div className="ml-2 h-5 min-w-5 rounded-full bg-alumni-primary flex items-center justify-center">
                            <span className="text-white text-xs">{contact.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground p-4">No conversations yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'
              } lg:col-span-8 flex-col h-full`}>
              {selectedContact ? (
                <>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="lg:hidden mr-2"
                        onClick={() => setMobileView('list')}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${selectedContact.isOnline ? 'bg-alumni-primary/20' : 'bg-secondary'
                          }`}>
                          {selectedContact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h4 className="font-medium">{selectedContact.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {selectedContact.isOnline ? 'Active now' : 'Offline'}
                          {selectedContact.role === 'alumni' ? ' • Alumni' : ' • Student'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Phone size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Video size={20} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDeleteChat(selectedContact.id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {Object.entries(groupedMessages).length > 0 ? (
                      Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date} className="space-y-4">
                          <div className="text-center">
                            <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full">
                              {new Date(date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {dateMessages.map(message => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.sender_id !== user?.id && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarFallback className="bg-alumni-primary/20">
                                    {selectedContact.avatar}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div className={`max-w-[70%] rounded-2xl p-3 ${message.sender_id === user?.id
                                ? 'bg-alumni-primary text-white'
                                : 'bg-secondary'
                                }`}>
                                <p>{message.content}</p>
                                <p className={`text-xs mt-1 text-right ${message.sender_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                                  }`}>
                                  {formatMessageTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-muted-foreground">No messages yet</p>
                        <p className="text-sm mt-2">Start the conversation below</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-border">
                    <div className="flex">
                      <Input
                        className="flex-1 rounded-full"
                        placeholder="Message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        className="ml-2 rounded-full bg-alumni-primary hover:bg-alumni-primary/90"
                        onClick={handleSendMessage}
                        size="icon"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                  <p className="text-muted-foreground max-w-md">
                    Send private messages to a friend or group.
                  </p>
                  <Button className="mt-6 bg-alumni-primary hover:bg-alumni-primary/90">
                    Send Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MessagesPage;
