
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-red-600 md:text-3xl">
            STREAMNEXUS
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/" className="hover:text-white transition-colors">TV Shows</Link>
            <Link to="/" className="hover:text-white transition-colors">Movies</Link>
            {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-red-500 font-bold hover:text-red-400">Admin Panel</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Titles, people, genres"
                  className="w-48 lg:w-64 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all focus:w-80"
                />
             </div>
          </div>
          
          <div className="group relative">
            <button className="flex items-center gap-2 rounded-full bg-red-600 p-1 transition-transform hover:scale-105 active:scale-95">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} className="h-8 w-8 rounded-full" alt="avatar" />
            </button>
            <div className="invisible absolute right-0 top-10 w-48 scale-95 rounded-md border border-white/10 bg-black p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
              <div className="border-b border-white/10 pb-2 mb-2 px-2">
                <p className="text-xs font-bold truncate">{user?.username}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user?.role}</p>
              </div>
              {user?.role === UserRole.ADMIN && (
                <button onClick={() => navigate('/admin')} className="w-full px-2 py-1.5 text-left text-xs hover:bg-white/10 rounded">Admin Dashboard</button>
              )}
              <button onClick={onLogout} className="w-full px-2 py-1.5 text-left text-xs hover:bg-white/10 rounded text-red-500">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
