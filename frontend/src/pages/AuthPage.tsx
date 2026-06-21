import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const fd = new URLSearchParams();
        fd.append('username', data.email);
        fd.append('password', data.password);
        const res = await api.post('/users/login', fd, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        login(res.data.access_token, res.data.user);
        addToast(`Welcome back, ${res.data.user.name}!`, 'success');
        navigate('/');
      } else {
        await api.post('/users/', { ...data, role: 'patient' });
        addToast('Account created successfully! Please sign in.', 'success');
        setIsLogin(true);
        reset();
      }
    } catch (e: any) {
      addToast(e.response?.data?.detail || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50/30 to-secondary-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/10 rounded-full blur-3xl" />
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-elevated border border-white/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-glow"
            >
              <Stethoscope size={32} className="text-white" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-secondary-500">
              {isLogin ? 'Sign in to access your clinic dashboard' : 'Register as a new patient'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
                    <input
                      {...register('name')}
                      required
                      className="input-field pl-11"
                      placeholder="Full Name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="email"
                {...register('email')}
                required
                className="input-field pl-11"
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                required
                className="input-field pl-11 pr-11"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); reset(); }}
              className="text-sm text-secondary-500 hover:text-primary-600 transition-colors font-medium"
            >
              {isLogin ? (
                <span className="flex items-center justify-center gap-1">
                  New patient? <span className="text-primary-600">Create an account</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  Already registered? <span className="text-primary-600">Sign in</span>
                </span>
              )}
            </button>
          </div>

          {/* Security badge */}
          <div className="mt-8 pt-6 border-t border-secondary-100 flex items-center justify-center gap-2 text-xs text-secondary-400">
            <ShieldCheck size={14} />
            <span>Secured with JWT Authentication</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
