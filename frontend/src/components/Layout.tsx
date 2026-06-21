import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  CircleUser as UserCircle, 
  Menu, 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  CalendarDays, 
  FileText, 
  Bell, 
  ChevronRight,
  Activity
} from 'lucide-react';

const navConfig: Record<string, { label: string; icon: React.ReactNode; path: string }[]> = {
  admin: [
    { label: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'Doctors', icon: <Stethoscope size={20} />, path: '/admin?tab=doctors' },
    { label: 'Users', icon: <Users size={20} />, path: '/admin?tab=users' },
    { label: 'Reminders', icon: <Bell size={20} />, path: '/admin?tab=reminders' },
  ],
  doctor: [
    { label: 'Appointments', icon: <CalendarDays size={20} />, path: '/doctor' },
    { label: 'Records', icon: <FileText size={20} />, path: '/doctor?tab=records' },
  ],
  patient: [
    { label: 'Book Visit', icon: <CalendarDays size={20} />, path: '/patient' },
    { label: 'My Appointments', icon: <CalendarDays size={20} />, path: '/patient?tab=myAppts' },
    { label: 'My History', icon: <FileText size={20} />, path: '/patient?tab=myRecords' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role as string;
  const navItems = navConfig[role] || [];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      const [base, query] = path.split('?');
      return location.pathname === base && location.search.includes(query);
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const roleStyles: Record<string, { bg: string; text: string; badge: string }> = {
    admin: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    doctor: { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    patient: { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    doctor: 'Doctor',
    patient: 'Patient',
  };

  const currentStyle = roleStyles[role] || { bg: 'bg-slate-100', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-500/30">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">ClinicIQ</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Health Portal</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${currentStyle.bg} ${currentStyle.text}`}>
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs font-medium text-slate-500 truncate">{user?.email || roleLabel[role] || role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {active && (
                  <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Logout (Desktop focus) */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-sm border border-red-100 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Secure Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
              {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${currentStyle.badge}`}>
              {roleLabel[role] || role}
            </span>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {/* TOP LOGOUT BUTTON (Always accessible) */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <span className="hidden sm:block">Sign Out</span>
              <div className="p-2 bg-slate-100 rounded-full hover:bg-red-50 transition-colors">
                <LogOut size={18} />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
