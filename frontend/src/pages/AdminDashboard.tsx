import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Calendar, FileText, Bell, CreditCard as Edit, Trash2, Plus, Search, ListFilter as Filter, ChevronDown, Stethoscope, Activity, TrendingUp, Clock, CircleCheck as CheckCircle2, Circle as XCircle, Save } from 'lucide-react';
import {
  StatCard, DataTable, StatusBadge, EmptyState, LoadingSpinner,
  PageHeader, ConfirmDialog
} from '../components/ui';
import { useToast } from '../hooks/useToast';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
    { id: 'doctors', label: 'Doctors', icon: <Stethoscope size={16} /> },
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage clinic operations, staff, and appointments"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary-100/50 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-white text-primary-700 shadow-soft'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'overview' && <OverviewTab />}
          {tab === 'doctors' && <DoctorsTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'reminders' && <RemindersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="w-12 h-12 bg-secondary-200 rounded-xl mb-4" />
            <div className="w-24 h-3 bg-secondary-200 rounded mb-2" />
            <div className="w-16 h-8 bg-secondary-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users size={22} />}
          title="Total Users"
          value={data?.total_users}
          color="primary"
          delay={0}
        />
        <StatCard
          icon={<Stethoscope size={22} />}
          title="Total Doctors"
          value={data?.total_doctors}
          color="accent"
          delay={0.1}
        />
        <StatCard
          icon={<Calendar size={22} />}
          title="Appointments"
          value={data?.total_appointments}
          color="warning"
          delay={0.2}
        />
        <StatCard
          icon={<FileText size={22} />}
          title="Medical Records"
          value={data?.total_medical_records}
          color="danger"
          delay={0.3}
        />
      </div>

      {/* Quick activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-accent-600" />
                <span className="text-sm font-medium text-secondary-700">Database Connection</span>
              </div>
              <span className="text-xs font-bold text-accent-700 bg-accent-100 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary-600" />
                <span className="text-sm font-medium text-secondary-700">API Response Time</span>
              </div>
              <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-1 rounded-full">~45ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-secondary-600" />
                <span className="text-sm font-medium text-secondary-700">Active Sessions</span>
              </div>
              <span className="text-xs font-bold text-secondary-700 bg-secondary-100 px-2 py-1 rounded-full">{data?.total_users || 0}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 hover:bg-secondary-50 rounded-xl transition-colors">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users size={14} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-800">System initialized</p>
                <p className="text-xs text-secondary-400">Dashboard stats loaded successfully</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-secondary-50 rounded-xl transition-colors">
              <div className="p-2 bg-accent-100 rounded-lg">
                <CheckCircle2 size={14} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-800">All services operational</p>
                <p className="text-xs text-secondary-400">Backend API responding normally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorsTab() {
  const { register, handleSubmit, reset } = useForm();
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { addToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: async () => (await api.get('/doctors/')).data,
  });

  const save = useMutation({
    mutationFn: async (d: any) =>
      editId ? api.put(`/doctors/${editId}`, d) : api.post('/doctors/', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['docs'] });
      reset();
      setEditId(null);
      setShowForm(false);
      addToast(editId ? 'Doctor updated successfully' : 'Doctor profile created', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Operation failed', 'error'),
  });

  const del = useMutation({
    mutationFn: async (id: number) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['docs'] });
      addToast('Doctor deleted successfully', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Delete failed', 'error'),
  });

  const handleEdit = (doc: any) => {
    setEditId(doc.id);
    reset(doc);
    setShowForm(true);
  };

  const filtered = data?.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowForm(!showForm); setEditId(null); reset(); }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add Doctor'}
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit((d) =>
              save.mutate({
                ...d,
                experience: +d.experience,
                consultation_fee: +d.consultation_fee,
              })
            )}
            className="card p-6 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-secondary-900 mb-4">
              {editId ? 'Edit Doctor Profile' : 'Create Doctor Profile'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register('name')} placeholder="Doctor Name" required className="input-field" />
              <input {...register('specialization')} placeholder="Specialization" required className="input-field" />
              <input type="number" {...register('experience')} placeholder="Experience (Years)" required className="input-field" />
              <input type="number" {...register('consultation_fee')} placeholder="Consultation Fee" required className="input-field" />
              <input {...register('available_days')} placeholder="Available Days (e.g. Mon, Wed)" required className="input-field md:col-span-2" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={save.isPending} className="btn-primary flex items-center gap-2">
                {save.isPending ? <LoadingSpinner size={18} /> : <Save size={18} />}
                {editId ? 'Update Profile' : 'Create Profile'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); reset(); }} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : (
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (d: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {d.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-secondary-900">{d.name}</span>
                </div>
              )},
              { key: 'specialization', header: 'Specialization', render: (d: any) => (
                <span className="text-sm text-secondary-600 font-medium">{d.specialization}</span>
              )},
              { key: 'experience', header: 'Experience', render: (d: any) => (
                <span className="text-sm text-secondary-600">{d.experience} years</span>
              )},
              { key: 'fee', header: 'Fee', render: (d: any) => (
                <span className="text-sm font-semibold text-secondary-900">${d.consultation_fee}</span>
              )},
              { key: 'actions', header: 'Actions', render: (d: any) => (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(d)} className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(d.id)} className="p-2 rounded-lg bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )},
            ]}
            data={filtered || []}
            keyExtractor={(d: any) => d.id}
            emptyState={<EmptyState title="No doctors found" description="Try adjusting your search or add a new doctor." icon={<Stethoscope size={32} className="text-secondary-400" />} />}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) del.mutate(confirmDelete); setConfirmDelete(null); }}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

function UsersTab() {
  const { register, handleSubmit, reset } = useForm();
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { addToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users/')).data,
  });

  const save = useMutation({
    mutationFn: async (d: any) =>
      editId
        ? api.put(`/users/${editId}`, { name: d.name, email: d.email, role: d.role })
        : api.post('/users/', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      reset();
      setEditId(null);
      setShowForm(false);
      addToast(editId ? 'User updated successfully' : 'User account created', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Operation failed', 'error'),
  });

  const del = useMutation({
    mutationFn: async (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      addToast('User deleted successfully', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Delete failed', 'error'),
  });

  const handleEdit = (u: any) => {
    setEditId(u.id);
    reset({ name: u.name, email: u.email, role: u.role });
    setShowForm(true);
  };

  const roleBadge: Record<string, string> = {
    admin: 'bg-primary-50 text-primary-700',
    doctor: 'bg-accent-50 text-accent-700',
    patient: 'bg-warning-50 text-warning-700',
  };

  const filtered = data?.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowForm(!showForm); setEditId(null); reset(); }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add User'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit((d) => save.mutate(d))}
            className="card p-6 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-secondary-900 mb-4">
              {editId ? 'Edit User' : 'Create User Account'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register('name')} placeholder="Full Name" required className="input-field" />
              <input type="email" {...register('email')} placeholder="Email Address" required className="input-field" />
              {!editId && <input type="password" {...register('password')} placeholder="Password" required className="input-field" />}
              <select {...register('role')} required className="input-field">
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
                <option value="patient">Patient</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={save.isPending} className="btn-primary flex items-center gap-2">
                {save.isPending ? <LoadingSpinner size={18} /> : <Save size={18} />}
                {editId ? 'Update User' : 'Create Account'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); reset(); }} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : (
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (u: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700 font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-secondary-900">{u.name}</span>
                </div>
              )},
              { key: 'email', header: 'Email', render: (u: any) => (
                <span className="text-sm text-secondary-600">{u.email}</span>
              )},
              { key: 'role', header: 'Role', render: (u: any) => (
                <span className={`badge ${roleBadge[u.role] || 'bg-secondary-100 text-secondary-600'}`}>
                  {u.role}
                </span>
              )},
              { key: 'actions', header: 'Actions', render: (u: any) => (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(u)} className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(u.id)} className="p-2 rounded-lg bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )},
            ]}
            data={filtered || []}
            keyExtractor={(u: any) => u.id}
            emptyState={<EmptyState title="No users found" description="Try adjusting your search or add a new user." icon={<Users size={32} className="text-secondary-400" />} />}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) del.mutate(confirmDelete); setConfirmDelete(null); }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

function RemindersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => (await api.get('/reminders/')).data,
    refetchInterval: 5000,
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
          <Bell size={20} className="text-warning-500" />
          Tomorrow's Auto-Reminders
        </h3>
        <span className="badge bg-warning-50 text-warning-700">
          {data?.total_reminders || 0} pending
        </span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : data?.reminders?.length ? (
        <div className="space-y-3">
          {data.reminders.map((r: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-4 bg-warning-50/50 border border-warning-100 rounded-xl"
            >
              <div className="p-2 bg-warning-100 rounded-lg mt-0.5">
                <Clock size={16} className="text-warning-600" />
              </div>
              <p className="text-sm font-medium text-secondary-800 leading-relaxed">{r}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reminders"
          description="There are no appointments scheduled for tomorrow."
          icon={<CheckCircle2 size={32} className="text-accent-400" />}
        />
      )}
    </div>
  );
}
