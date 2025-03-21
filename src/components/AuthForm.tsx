
import React, { useState } from 'react';
import { Eye, EyeOff, User, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ defaultTab = 'login' }) => {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [userType, setUserType] = useState<'student' | 'alumni'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (tab === 'login') {
        await login(email, password, userType);
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          toast({
            title: "Error",
            description: "Please provide your first and last name",
            variant: "destructive"
          });
          return;
        }
        
        const fullName = `${firstName} ${lastName}`;
        await signup(email, password, fullName, userType);
        // After successful signup, switch to login tab
        setTab('login');
        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Toast is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md rounded-xl p-6 animate-scale-in">
      <h2 className="text-2xl font-semibold text-center mb-2">Welcome back</h2>
      <p className="text-muted-foreground text-center mb-6">
        Enter your credentials to access your account
      </p>
      
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 rounded-l-md transition-all ${tab === 'login' ? 'bg-alumni-primary text-white' : 'bg-secondary text-muted-foreground'}`}
          onClick={() => setTab('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 rounded-r-md transition-all ${tab === 'register' ? 'bg-alumni-primary text-white' : 'bg-secondary text-muted-foreground'}`}
          onClick={() => setTab('register')}
        >
          Register
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {tab === 'register' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-2">First name</label>
              <input
                id="firstName"
                type="text"
                className="glass-input w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm mb-2">Last name</label>
              <input
                id="lastName"
                type="text"
                className="glass-input w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-2">Email</label>
          <input
            id="email"
            type="email"
            className="glass-input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm">Password</label>
            {tab === 'login' && (
              <a href="#" className="text-xs text-alumni-primary hover:underline">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"} 
              className="glass-input w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="block text-sm mb-2">I am a</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                checked={userType === 'student'}
                onChange={() => setUserType('student')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${userType === 'student' ? 'border-alumni-primary' : 'border-muted-foreground'}`}>
                {userType === 'student' && (
                  <div className="w-3 h-3 rounded-full bg-alumni-primary"></div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <User size={18} />
                <span>Student</span>
              </div>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                checked={userType === 'alumni'}
                onChange={() => setUserType('alumni')}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${userType === 'alumni' ? 'border-alumni-primary' : 'border-muted-foreground'}`}>
                {userType === 'alumni' && (
                  <div className="w-3 h-3 rounded-full bg-alumni-primary"></div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <UserCheck size={18} />
                <span>Alumni/Teacher</span>
              </div>
            </label>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full py-3 bg-alumni-primary hover:bg-alumni-primary/90 text-white rounded-md transition-all font-medium disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : tab === 'login' ? 'Login' : 'Create Account'}
        </button>
        
        <p className="text-center text-sm mt-6">
          {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="text-alumni-primary hover:underline"
          >
            {tab === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
