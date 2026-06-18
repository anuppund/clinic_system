import { useAuthStore } from '../store/authStore'; import { LogOut, UserCircle } from 'lucide-react'; import { useNavigate } from 'react-router-dom';
export default function Layout({ children }: any) {
  const { user, logout } = useAuthStore(); const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-secondary text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">ClinicIQ Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full"><UserCircle size={18} /><span className="text-sm font-medium uppercase tracking-wider">{user?.role}: {user?.name}</span></div>
          <button onClick={() => { logout(); navigate('/auth'); }} className="text-red-400 hover:text-red-300 transition-colors"><LogOut size={22} /></button>
        </div>
      </nav>
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
