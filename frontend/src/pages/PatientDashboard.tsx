import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, FileText, Clock, Stethoscope, CircleCheck as CheckCircle2, Circle as XCircle, MapPin, DollarSign, Star, Calendar, Trash2, ChevronRight, CircleAlert as AlertCircle, BookOpen, HeartPulse, ShieldCheck } from 'lucide-react';
import {
  EmptyState, LoadingSpinner, StatusBadge, ConfirmDialog,
  PageHeader
} from '../components/ui';
import { useToast } from '../hooks/useToast';

export default function PatientDashboard() {
  const [tab, setTab] = useState('book');
  const tabs = [
    { id: 'book', label: 'Book Visit', icon: <CalendarDays size={16} /> },
    { id: 'myAppts', label: 'My Appointments', icon: <Calendar size={16} /> },
    { id: 'myRecords', label: 'My History', icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Portal"
        subtitle="Book appointments and view your medical history"
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
          {tab === 'book' && <BookTab />}
          {tab === 'myAppts' && <MyApptsTab />}
          {tab === 'myRecords' && <MyRecordsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BookTab() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const { data: docs, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: async () => (await api.get('/doctors/')).data,
  });

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !date || !time) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setIsBooking(true);
    try {
      await api.post('/appointments/', {
        patient_id: user.id,
        doctor_id: +selectedDoc,
        appointment_date: date,
        appointment_time: time + ':00',
      });
      addToast('Appointment confirmed successfully!', 'success');
      setSelectedDoc('');
      setDate('');
      setTime('');
      qc.invalidateQueries({ queryKey: ['myAppts'] });
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Booking failed', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const selectedDoctor = docs?.find((d: any) => d.id === +selectedDoc);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Form */}
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={book}
        className="card p-6 h-fit"
      >
        <h3 className="text-lg font-bold text-secondary-900 mb-1 flex items-center gap-2">
          <CalendarDays size={20} className="text-primary-500" />
          Schedule a Visit
        </h3>
        <p className="text-sm text-secondary-500 mb-6">Select your preferred doctor and time slot</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">Select Doctor</label>
            <select
              required
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="input-field"
            >
              <option value="">Choose a doctor...</option>
              {docs?.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {selectedDoctor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-primary-50 rounded-xl border border-primary-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {selectedDoctor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-secondary-900">{selectedDoctor.name}</p>
                  <p className="text-xs text-secondary-500">{selectedDoctor.specialization}</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-secondary-600">
                <span className="flex items-center gap-1"><DollarSign size={12} /> ${selectedDoctor.consultation_fee}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {selectedDoctor.experience} yrs</span>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isBooking}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm Booking
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* Doctor Directory */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
          <Stethoscope size={20} className="text-primary-500" />
          Doctor Directory
        </h3>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {docs?.map((d: any, i: number) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDoc(d.id.toString())}
                className={`card p-4 cursor-pointer transition-all duration-200 ${
                  selectedDoc === d.id.toString()
                    ? 'ring-2 ring-primary-500 shadow-glow'
                    : 'hover:shadow-elevated'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-800 font-bold text-lg">
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">{d.name}</p>
                      <p className="text-xs text-secondary-500 font-medium uppercase tracking-wider">{d.specialization}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary-500">
                        <span className="flex items-center gap-1"><Star size={12} className="text-warning-400" /> {d.experience} yrs</span>
                        <span className="flex items-center gap-1"><DollarSign size={12} /> ${d.consultation_fee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge bg-secondary-100 text-secondary-600 text-[10px]">
                      {d.available_days}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MyApptsTab() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['myAppts'],
    queryFn: async () => (await api.get('/appointments/my')).data,
  });

  const cancel = useMutation({
    mutationFn: async (id: number) => api.put(`/appointments/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries();
      addToast('Appointment cancelled successfully', 'success');
    },
    onError: (err: any) => addToast(err.response?.data?.detail || 'Cancel failed', 'error'),
  });

  const upcoming = data?.filter((a: any) => a.status === 'Booked') || [];
  const past = data?.filter((a: any) => a.status !== 'Booked') || [];

  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <CalendarDays size={20} className="text-primary-500" />
          Upcoming Appointments
          <span className="badge bg-primary-50 text-primary-700 ml-auto">{upcoming.length}</span>
        </h3>
        {isLoading ? (
          <LoadingSpinner />
        ) : upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map((a: any, i: number) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-primary-50/50 border border-primary-100 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {a.doctor?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">{a.doctor?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-secondary-500 mt-0.5">
                      <Calendar size={14} />
                      <span>{a.appointment_date}</span>
                      <Clock size={14} />
                      <span>{a.appointment_time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  <button
                    onClick={() => setConfirmCancel(a.id)}
                    className="p-2 rounded-lg bg-danger-50 text-danger-500 hover:bg-danger-100 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming appointments"
            description="Book a new appointment to get started."
            icon={<CalendarDays size={32} className="text-secondary-400" />}
          />
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-secondary-400" />
            Past Appointments
          </h3>
          <div className="space-y-3">
            {past.map((a: any, i: number) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 bg-secondary-50/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-600 font-bold text-sm">
                    {a.doctor?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-800">{a.doctor?.name}</p>
                    <p className="text-xs text-secondary-400">{a.appointment_date} at {a.appointment_time}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => { if (confirmCancel) cancel.mutate(confirmCancel); setConfirmCancel(null); }}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Cancel Appointment"
        variant="warning"
      />
    </div>
  );
}

function MyRecordsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['myRecs'],
    queryFn: async () => (await api.get('/medical-records/my')).data,
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <HeartPulse size={20} className="text-accent-500" />
          Personal Health Records
          <span className="badge bg-accent-50 text-accent-700 ml-auto">{data?.length || 0} records</span>
        </h3>

        {isLoading ? (
          <LoadingSpinner />
        ) : data?.length ? (
          <div className="space-y-4">
            {data.map((r: any, i: number) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 hover:shadow-elevated transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold">
                      {r.doctor?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">{r.doctor?.name}</p>
                      <p className="text-xs text-secondary-400">{r.doctor?.specialization}</p>
                    </div>
                  </div>
                  <span className="badge bg-secondary-100 text-secondary-600 text-xs">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-secondary-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} className="text-primary-500" />
                      <span className="text-xs font-semibold text-secondary-500 uppercase">Diagnosis</span>
                    </div>
                    <p className="text-sm text-secondary-800 font-medium">{r.diagnosis}</p>
                  </div>

                  <div className="p-3 bg-secondary-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={14} className="text-accent-500" />
                      <span className="text-xs font-semibold text-secondary-500 uppercase">Prescription</span>
                    </div>
                    <p className="text-sm text-secondary-700">{r.prescription}</p>
                  </div>

                  {r.notes && (
                    <div className="p-3 bg-warning-50/50 rounded-xl border border-warning-100">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-warning-500" />
                        <span className="text-xs font-semibold text-secondary-500 uppercase">Doctor's Notes</span>
                      </div>
                      <p className="text-sm text-secondary-700 italic">{r.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No medical records"
            description="Your medical history will appear here after your first consultation."
            icon={<HeartPulse size={32} className="text-secondary-400" />}
          />
        )}
      </div>
    </div>
  );
}
