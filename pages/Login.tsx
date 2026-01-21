
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useApp } from '../App';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { users } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded Admin fallback for first-time setup
    if (username === 'admin' && password === 'admin123') {
      const adminUser = users.find(u => u.username === 'admin') || {
        id: 'admin_id',
        username: 'admin',
        role: UserRole.ADMIN,
        isBlocked: false,
        canDownload: true,
        createdAt: '2023-01-01'
      };
      onLogin(adminUser, 'mock_token_admin');
      navigate('/admin');
      return;
    }

    // Check against users created by Admin (stored in global context)
    const foundUser = users.find(u => u.username === username && (u.password === password || (!u.password && password === 'user123')));

    if (foundUser) {
      if (foundUser.isBlocked) {
        setError('Your account has been blocked by an administrator.');
        return;
      }
      onLogin(foundUser, `token_${foundUser.id}`);
      navigate(foundUser.role === UserRole.ADMIN ? '/admin' : '/');
      return;
    }

    setError('Invalid credentials. Please contact your administrator.');
  };

  const isBlocked = searchParams.get('error') === 'blocked';

  return (
    <div className="relative h-screen w-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-black/80 p-8 shadow-2xl backdrop-blur-xl border border-white/10 md:p-12">
          <h1 className="mb-2 text-4xl font-black text-red-600 tracking-tighter">STREAMNEXUS</h1>
          <h2 className="mb-8 text-xl font-bold text-white">Sign In</h2>
          
          {(error || isBlocked) && (
            <div className="mb-6 rounded-lg bg-red-600/20 border border-red-600/50 p-4 text-sm font-medium text-red-200">
              {isBlocked ? 'Your account has been blocked by an administrator.' : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Username</label>
              <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 p-4 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 p-4 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className="mt-4 w-full rounded-lg bg-red-600 p-4 font-black text-white transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-600/20"
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-red-600" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="hover:text-white">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
