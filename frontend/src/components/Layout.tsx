import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, CircleUser as UserCircle, Menu, X, LayoutDashboard, Users, Stethoscope, CalendarDays, FileText, Bell, ChevronRight } from 'lucide-react';

const navConfig: Record<string, { label: string; icon: React.ReactNode; path: string }[]> = {
  admin: [
    { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { label: 'Doctors', icon: <Stethoscope size={18} />, path: '/admin?tab=doctors' },
    { label: 'Users', icon: <Users size={18} />, path: '/admin?tab=users' },
    { label: 'Reminders', icon: <Bell size={18} />, path: '/admin?tab=reminders' },
  ],
  doctor: [
    { label: 'Appointments', icon: <CalendarDays size={18} />, path: '/doctor' },
    { label: 'Records', icon: <FileText size={18} />, path: '/doctor?tab=records' },
  ],
  patient: [
    { label: 'Book Visit', icon: <CalendarDays size={18} />, path: '/patient' },
    { label: 'My Appointments', icon: <CalendarDays size={18} />, path: '/patient?tab=myAppts' },
    { label: 'My History', icon: <FileText size={18} />, path: '/patient?tab=myRecords' },
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

  const roleColors: Record<string, string> = {
    admin: 'bg-primary-100 text-primary-700',
    doctor: 'bg-accent-100 text-accent-700',
    patient: 'bg-warning-100 text-warning-700',
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    doctor: 'Doctor',
    patient: 'Patient',
  };

  return (
    <div className="min-h-screen flex bg-secondary-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-secondary-900/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-secondary-100 flex flex-col shadow-lg lg:shadow-none`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-glow">
              <Stethoscope size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900 leading-tight">ClinicIQ</h1>
              <p className="text-[10px] text-secondary-400 font-medium uppercase tracking-widest">Management</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-secondary-50 to-secondary-100/50 rounded-2xl border border-secondary-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${roleColors[role] || 'bg-secondary-100 text-secondary-600'}`}>
              <UserCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-secondary-900 truncate">{user?.name}</p>
              <p className="text-xs text-secondary-500">{roleLabel[role] || role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 shadow-soft'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <span className={isActive(item.path) ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight
                size={14}
                className={`transition-transform ${isActive(item.path) ? 'text-primary-400 translate-x-0 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-secondary-300'}`}
              />
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-secondary-100">
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-600 hover:bg-danger-50 transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-secondary-100 px-6 py-3 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 text-secondary-600 transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${roleColors[role] || ''}`}>
              {roleLabel[role] || role}
            </span>
            <div className="flex items-center gap-2 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
              <UserCircle size={16} className="text-secondary-400" />
              <span className="text-sm font-medium text-secondary-700 hidden sm:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
