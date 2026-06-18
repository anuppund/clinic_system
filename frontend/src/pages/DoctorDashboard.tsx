import { useState } from 'react'; import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; import { useForm } from 'react-hook-form'; import { api } from '../api/axios'; import { useAuthStore } from '../store/authStore';
export default function DoctorDashboard() {
  const [tab, setTab] = useState('appts');
  return (
    <div className="space-y-8">
      <div className="flex border-b border-slate-200 gap-8">
        <button className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === 'appts' ? 'border-b-4 border-primary text-primary' : 'text-slate-400'}`} onClick={() => setTab('appts')}>All Appointments</button>
        <button className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === 'records' ? 'border-b-4 border-primary text-primary' : 'text-slate-400'}`} onClick={() => setTab('records')}>Medical Records / Consultations</button>
      </div>
      {tab === 'appts' && <ApptsTab />} {tab === 'records' && <RecordsTab />}
    </div>
  );
}
function ApptsTab() {
  const { data } = useQuery({ queryKey: ['allAppts'], queryFn: async () => (await api.get('/appointments/')).data });
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <table className="w-full text-left"><thead className="text-slate-500 border-b"><tr className="border-b"><th className="pb-3">Patient</th><th className="pb-3">Doctor Assigned</th><th className="pb-3">Date & Time</th><th className="pb-3">Status</th></tr></thead>
      <tbody>{data?.map((a:any) => <tr key={a.id} className="border-b border-slate-100 last:border-0"><td className="py-4 font-bold text-secondary">{a.patient?.name}</td><td>{a.doctor?.name}</td><td>{a.appointment_date} @ {a.appointment_time}</td><td><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${a.status==='Booked' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span></td></tr>)}</tbody></table>
    </div>
  );
}
function RecordsTab() {
  const { user } = useAuthStore(); const qc = useQueryClient(); const { register, handleSubmit, reset } = useForm();
  const { data: users } = useQuery({ queryKey: ['patients'], queryFn: async () => (await api.get('/users/')).data });
  const { data: records } = useQuery({ queryKey: ['records'], queryFn: async () => (await api.get('/medical-records/')).data });
  const add = useMutation({ mutationFn: async (d: any) => api.post('/medical-records/', d), onSuccess: () => { qc.invalidateQueries({queryKey:['records']}); reset(); alert('Medical Record Securely Saved'); } });
  const del = useMutation({ mutationFn: async (id: number) => api.delete(`/medical-records/${id}`), onSuccess: () => qc.invalidateQueries({queryKey:['records']}) });

  const patientsOnly = users?.filter((u:any) => u.role === 'patient') || [];
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit(d => add.mutate({...d, doctor_id: user.id}))} className="bg-white p-8 border border-slate-200 rounded-2xl space-y-5 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-secondary border-b pb-4">Create Consultation Record</h3>
        <select {...register('patient_id')} required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none"><option value="">Select Patient</option>{patientsOnly.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <input {...register('diagnosis')} placeholder="Diagnosis" required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none"/>
        <textarea {...register('prescription')} placeholder="Prescription / Medication" required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none h-28"/>
        <textarea {...register('notes')} placeholder="Clinical Notes (Internal)" className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none h-20"/>
        <button className="w-full bg-secondary hover:bg-slate-800 text-white py-3 rounded-lg font-bold shadow-md transition-colors">Save Medical Record</button>
      </form>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
        <h3 className="text-xl font-bold text-secondary border-b pb-4">Archived Records</h3>
        {records?.map((r:any) => (
          <div key={r.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 relative group">
            <button onClick={()=>del.mutate(r.id)} className="absolute top-4 right-4 text-xs text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
            <p className="font-bold text-lg text-primary">{r.patient?.name}</p>
            <p className="text-xs text-slate-400 mb-3">{new Date(r.created_at).toLocaleString()}</p>
            <p className="text-sm text-slate-700"><strong className="text-secondary">Diagnosis:</strong> {r.diagnosis}</p>
            <p className="text-sm text-slate-700 mt-1"><strong className="text-secondary">Rx:</strong> {r.prescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
