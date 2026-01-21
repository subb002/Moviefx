
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Watch from './pages/Watch';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import { AuthState, User, UserRole, Movie } from './types';
import { DUMMY_MOVIES, DUMMY_USERS } from './constants';

interface AppContextType {
  movies: Movie[];
  users: User[];
  addMovie: (movie: Movie) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

export const AppContext = createContext<AppContextType>({
  movies: [],
  users: [],
  addMovie: () => {},
  addUser: () => {},
  updateUser: () => {},
});

export const useApp = () => useContext(AppContext);

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('nexus_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('nexus_movies');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...DUMMY_MOVIES];
      parsed.forEach((m: Movie) => {
        if (!merged.find(dm => dm.id === m.id)) merged.push(m);
      });
      return merged;
    }
    return DUMMY_MOVIES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexus_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...DUMMY_USERS];
      parsed.forEach((u: User) => {
        if (!merged.find(du => du.id === u.id)) merged.push(u);
      });
      return merged;
    }
    return DUMMY_USERS;
  });

  useEffect(() => {
    localStorage.setItem('nexus_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    const customMovies = movies.filter(m => !DUMMY_MOVIES.find(dm => dm.id === m.id));
    localStorage.setItem('nexus_movies', JSON.stringify(customMovies));
  }, [movies]);

  useEffect(() => {
    const customUsers = users.filter(u => !DUMMY_USERS.find(du => du.id === u.id));
    localStorage.setItem('nexus_users', JSON.stringify(customUsers));
  }, [users]);

  const login = (user: User, token: string) => {
    setAuth({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('nexus_auth');
  };

  const addMovie = (newMovie: Movie) => setMovies(prev => [newMovie, ...prev]);
  const addUser = (newUser: User) => setUsers(prev => [...prev, newUser]);
  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const ProtectedRoute = ({ children, role }: { children?: React.ReactNode; role?: UserRole }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" />;
    
    const currentUser = users.find(u => u.id === auth.user?.id);
    if (currentUser?.isBlocked) {
      logout();
      return <Navigate to="/login?error=blocked" />;
    }
    
    if (role && auth.user?.role !== role) return <Navigate to="/" />;
    return <>{children}</>;
  };

  return (
    <AppContext.Provider value={{ movies, users, addMovie, addUser, updateUser }}>
      <Router>
        <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
          {auth.isAuthenticated && <Navbar user={auth.user} onLogout={logout} />}
          <Routes>
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/upload" element={<ProtectedRoute role={UserRole.ADMIN}><AdminUpload /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
