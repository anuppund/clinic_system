import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, FileText, Plus, Stethoscope, User, Clock, Pill, ClipboardList, Trash2, Save, Search, Circle as XCircle, CircleCheck as CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import {
  DataTable, EmptyState, LoadingSpinner, StatusBadge,
  PageHeader, ConfirmDialog
} from '../components/ui';
import { useToast } from '../hooks/useToast';

export default function DoctorDashboard() {
  const [tab, setTab] = useState('appts');
  const tabs = [
    { id: 'appts', label: 'Appointments', icon: <CalendarDays size={16} /> },
    { id: 'records', label: 'Medical Records', icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Dashboard"
        subtitle="Manage appointments and patient consultations"
      />

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
          {tab === 'appts' && <ApptsTab />}
          {tab === 'records' && <RecordsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ApptsTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['allAppts'],
    queryFn: async () => (await api.get('/appointments/')).data,
  });

  const filtered = data?.filter((a: any) => {
    const matchesSearch =
      (a.patient?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.doctor?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-40"
        >
          <option value="all">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : (
          <DataTable
            columns={[
              { key: 'patient', header: 'Patient', render: (a: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {a.patient?.name?.charAt(0) || '?'}
                  </div>
                  <span className="font-semibold text-secondary-900">{a.patient?.name || 'Unknown'}</span>
                </div>
              )},
              { key: 'doctor', header: 'Doctor', render: (a: any) => (
                <span className="text-sm text-secondary-600">{a.doctor?.name || 'Unknown'}</span>
              )},
              { key: 'date', header: 'Date & Time', render: (a: any) => (
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Clock size={14} className="text-secondary-400" />
                  <span>{a.appointment_date} @ {a.appointment_time}</span>
                </div>
              )},
              { key: 'status', header: 'Status', render: (a: any) => (
                <StatusBadge status={a.status} />
              )},
            ]}
            data={filtered || []}
            keyExtractor={(a: any) => a.id}
            emptyState={<EmptyState title="No appointments" description="No appointments match your filters." icon={<CalendarDays size={32} className="text-secondary-400" />} />}
          />
        )}
      </div>
    </div>
  );
}

function RecordsTab() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => (await api.get('/users/')).data,
  });

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ['records'],
    queryFn: async () => (await api.get('/medical-records/')).data,
  });

  const add = useMutation({
    mutationFn: async (d: any) => api.post('/medical-records/', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['records'] });
      reset();
      setShowForm(false);
      addToast('Medical record saved successfully', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Failed to save record', 'error'),
  });

  const del = useMutation({
    mutationFn: async (id: number) => api.delete(`/medical-records/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['records'] });
      addToast('Record deleted', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Delete failed', 'error'),
  });

  const patientsOnly = users?.filter((u: any) => u.role === 'patient') || [];

  const filteredRecords = records?.filter((r: any) =>
    (r.patient?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.diagnosis || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Record'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit((d) => add.mutate({ ...d, doctor_id: user.id }))}
            className="card p-6 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-primary-500" />
              Create Consultation Record
            </h3>
            <div className="space-y-4">
              <select {...register('patient_id')} required className="input-field">
                <option value="">Select Patient</option>
                {patientsOnly.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input {...register('diagnosis')} placeholder="Diagnosis" required className="input-field" />
              <textarea {...register('prescription')} placeholder="Prescription / Medication" required className="input-field h-28 resize-none" />
              <textarea {...register('notes')} placeholder="Clinical Notes (Internal)" className="input-field h-20 resize-none" />
            </div>
            <div className="mt-4">
              <button type="submit" disabled={add.isPending} className="btn-primary flex items-center gap-2">
                {add.isPending ? <LoadingSpinner size={18} /> : <Save size={18} />}
                Save Medical Record
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {recordsLoading ? (
        <LoadingSpinner />
      ) : filteredRecords?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecords.map((r: any, i: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 group hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {r.patient?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">{r.patient?.name || 'Unknown'}</p>
                    <p className="text-xs text-secondary-400">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmDelete(r.id)}
                  className="p-2 rounded-lg bg-danger-50 text-danger-500 opacity-0 group-hover:opacity-100 hover:bg-danger-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-secondary-50 rounded-xl">
                  <Stethoscope size={16} className="text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase">Diagnosis</p>
                    <p className="text-sm text-secondary-800 font-medium">{r.diagnosis}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-secondary-50 rounded-xl">
                  <Pill size={16} className="text-accent-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-secondary-500 uppercase">Prescription</p>
                    <p className="text-sm text-secondary-800">{r.prescription}</p>
                  </div>
                </div>
                {r.notes && (
                  <div className="flex items-start gap-2 p-3 bg-warning-50/50 rounded-xl border border-warning-100">
                    <ClipboardList size={16} className="text-warning-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-secondary-500 uppercase">Notes</p>
                      <p className="text-sm text-secondary-700 italic">{r.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No medical records"
          description="Create your first consultation record to get started."
          icon={<FileText size={32} className="text-secondary-400" />}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) del.mutate(confirmDelete); setConfirmDelete(null); }}
        title="Delete Record"
        message="Are you sure you want to delete this medical record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
