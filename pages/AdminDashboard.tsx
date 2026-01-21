
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useApp } from '../App';

const AdminDashboard: React.FC = () => {
  const { users, addUser, updateUser } = useApp();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const toggleBlock = (userId: string, currentStatus: boolean) => {
    updateUser(userId, { isBlocked: !currentStatus });
  };

  const toggleDownload = (userId: string, currentStatus: boolean) => {
    updateUser(userId, { canDownload: !currentStatus });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword, // Store password for demo credential matching
      role: UserRole.USER,
      isBlocked: false,
      canDownload: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    addUser(newUser);
    setNewUsername('');
    setNewPassword('');
    setShowCreateUser(false);
    alert(`User ${newUsername} created successfully! They can now log in from any device.`);
  };

  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">ADMIN PANEL</h1>
          <p className="text-gray-400">Manage your OTT Platform users and content</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateUser(true)}
            className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all active:scale-95"
          >
            Create New User
          </button>
          <Link 
            to="/admin/upload"
            className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            Upload Movie
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#141414] p-6 rounded-xl border border-white/5 h-fit">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Users</span>
              <span className="text-2xl font-black">{users.length}</span>
            </div>
            <div className="flex justify-between items-center text-green-500">
              <span>Active Streams</span>
              <span className="text-2xl font-black">Ready</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#141414] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold">Managed Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/5">
                  <th className="p-4 font-medium">Username</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs uppercase">
                          {user.username.charAt(0)}
                        </div>
                        <span className="font-bold">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.createdAt}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => toggleBlock(user.id, user.isBlocked)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button 
                        onClick={() => toggleDownload(user.id, user.canDownload)}
                        className={`px-3 py-1 rounded text-xs font-bold border transition-all ${user.canDownload ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-gray-500 text-gray-500 bg-gray-500/10'}`}
                      >
                        DL: {user.canDownload ? 'ON' : 'OFF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-white/10 animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-6">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="e.g., moviefan24"
                  className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full bg-white/5 border border-white/10 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="flex-1 px-4 py-3 bg-white/10 rounded font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 rounded font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
