import { useState } from 'react'; import { useForm } from 'react-hook-form'; import { useAuthStore } from '../store/authStore'; import { useNavigate } from 'react-router-dom'; import { api } from '../api/axios';
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); const { register, handleSubmit } = useForm(); const { login } = useAuthStore(); const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        const fd = new URLSearchParams(); fd.append('username', data.email); fd.append('password', data.password);
        const res = await api.post('/users/login', fd, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        login(res.data.access_token, res.data.user); navigate('/');
      } else {
        await api.post('/users/', { ...data, role: 'patient' }); alert('Patient account created! Please sign in.'); setIsLogin(true);
      }
    } catch (e: any) { alert(e.response?.data?.detail || 'Authentication failed'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-secondary">{isLogin ? 'Welcome Back' : 'Patient Registration'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!isLogin && <input {...register('name')} required className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:border-primary focus:outline-none" placeholder="Full Name" />}
          <input type="email" {...register('email')} required className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:border-primary focus:outline-none" placeholder="Email Address" />
          <input type="password" {...register('password')} required className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl focus:border-primary focus:outline-none" placeholder="Password" />
          <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-600 transition-colors shadow-md">{isLogin ? 'Sign In' : 'Register Account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 cursor-pointer hover:text-primary transition-colors" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "New patient? Create an account here." : "Already registered? Sign in."}</p>
      </div>
    </div>
  );
}
