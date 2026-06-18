import { useState } from 'react'; import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; import { useForm } from 'react-hook-form'; import { api } from '../api/axios'; import { Users, UserPlus, Calendar, FileText, Bell, Edit, Trash2 } from 'lucide-react';
export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="space-y-8">
      <div className="flex border-b border-slate-200 gap-8">
        {['overview', 'doctors (Profiles)', 'users (Logins)', 'reminders'].map(t => (
          <button key={t} className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === t ? 'border-b-4 border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => setTab(t)}>{t.split(' ')[0]}</button>
        ))}
      </div>
      {tab === 'overview' && <OverviewTab />} {tab === 'doctors (Profiles)' && <DoctorsTab />} {tab === 'users (Logins)' && <UsersTab />} {tab === 'reminders' && <RemindersTab />}
    </div>
  );
}

function OverviewTab() {
  // Live Polling every 5 seconds
  const { data } = useQuery({ queryKey: ['stats'], queryFn: async () => (await api.get('/dashboard/stats')).data, refetchInterval: 5000 });
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Stat icon={<Users/>} title="Total Users" val={data?.total_users} /> <Stat icon={<UserPlus/>} title="Total Doctors" val={data?.total_doctors} />
      <Stat icon={<Calendar/>} title="Appointments" val={data?.total_appointments} /> <Stat icon={<FileText/>} title="Medical Records" val={data?.total_medical_records} />
    </div>
  );
}
function Stat({icon, title, val}: any) { return <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5"><div className="p-4 bg-sky-50 text-primary rounded-xl">{icon}</div><div><p className="text-sm text-slate-500 font-medium uppercase">{title}</p><p className="text-3xl font-black text-secondary">{val || 0}</p></div></div>; }

function DoctorsTab() {
  const { register, handleSubmit, reset } = useForm(); const qc = useQueryClient(); const [editId, setEditId] = useState<number | null>(null);
  const { data } = useQuery({ queryKey: ['docs'], queryFn: async () => (await api.get('/doctors/')).data });

  const save = useMutation({ 
      mutationFn: async (d: any) => editId ? api.put(`/doctors/${editId}`, d) : api.post('/doctors/', d), 
      onSuccess: () => { qc.invalidateQueries({queryKey:['docs']}); reset(); setEditId(null); alert(editId ? 'Doctor Updated' : 'Doctor Added'); } 
  });
  const del = useMutation({ mutationFn: async (id: number) => api.delete(`/doctors/${id}`), onSuccess: () => qc.invalidateQueries({queryKey:['docs']}) });

  const handleEdit = (doc: any) => { setEditId(doc.id); reset(doc); };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(d => save.mutate({...d, experience: +d.experience, consultation_fee: +d.consultation_fee}))} className="bg-white p-8 border border-slate-200 rounded-2xl grid grid-cols-2 gap-6 shadow-sm">
        <h3 className="col-span-2 text-xl font-bold text-secondary border-b pb-4">{editId ? '✏️ Edit Doctor Profile' : '➕ Create Doctor Profile'}</h3>
        <input {...register('name')} placeholder="Doctor Name" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/> <input {...register('specialization')} placeholder="Specialization" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/>
        <input type="number" {...register('experience')} placeholder="Experience (Years)" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/> <input type="number" {...register('consultation_fee')} placeholder="Consultation Fee (₹)" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/>
        <input {...register('available_days')} placeholder="Available Days (e.g. Mon, Wed)" required className="border-2 p-3 rounded-lg col-span-2 focus:border-primary outline-none"/>
        <div className="col-span-2 flex gap-4">
            <button type="submit" className="flex-1 bg-secondary hover:bg-slate-800 text-white py-3 rounded-lg font-bold shadow-md transition-colors">{editId ? 'Update Profile' : 'Create Profile'}</button>
            {editId && <button type="button" onClick={()=>{setEditId(null); reset();}} className="bg-slate-200 hover:bg-slate-300 py-3 px-6 rounded-lg font-bold transition-colors">Cancel Edit</button>}
        </div>
      </form>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-secondary mb-6">Doctor Directory</h3>
        <table className="w-full text-left"><thead className="text-slate-500 border-b"><tr className="border-b"><th className="pb-3">Name</th><th className="pb-3">Specialization</th><th className="pb-3">Fee</th><th className="pb-3">Actions</th></tr></thead>
        <tbody>{data?.map((d:any) => <tr key={d.id} className="border-b border-slate-100 last:border-0"><td className="py-4 font-medium text-secondary">{d.name}</td><td>{d.specialization}</td><td>₹{d.consultation_fee}</td>
            <td className="flex gap-3 py-4">
                <button onClick={() => handleEdit(d)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg"><Edit size={18}/></button>
                <button onClick={() => {if(confirm('Delete Doctor?')) del.mutate(d.id)}} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
            </td>
        </tr>)}</tbody></table>
      </div>
    </div>
  );
}

function UsersTab() {
  const { register, handleSubmit, reset } = useForm(); const qc = useQueryClient(); const [editId, setEditId] = useState<number | null>(null);
  const { data } = useQuery({ queryKey: ['users'], queryFn: async () => (await api.get('/users/')).data });

  const save = useMutation({ 
      mutationFn: async (d: any) => editId ? api.put(`/users/${editId}`, {name: d.name, email: d.email, role: d.role}) : api.post('/users/', d), 
      onSuccess: () => { qc.invalidateQueries({queryKey:['users']}); reset(); setEditId(null); alert(editId ? 'User Updated' : 'User Added'); } 
  });
  const del = useMutation({ mutationFn: async (id: number) => api.delete(`/users/${id}`), onSuccess: () => qc.invalidateQueries({queryKey:['users']}) });

  const handleEdit = (u: any) => { setEditId(u.id); reset({name: u.name, email: u.email, role: u.role}); };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(d => save.mutate(d))} className="bg-white p-8 border border-slate-200 rounded-2xl grid grid-cols-2 gap-6 shadow-sm">
        <h3 className="col-span-2 text-xl font-bold text-secondary border-b pb-4">{editId ? '✏️ Edit User' : '➕ Create User Account'}</h3>
        <input {...register('name')} placeholder="Full Name" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/> 
        <input type="email" {...register('email')} placeholder="Email Address" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/>
        {!editId && <input type="password" {...register('password')} placeholder="Password" required className="border-2 p-3 rounded-lg focus:border-primary outline-none"/> }
        <select {...register('role')} required className="border-2 p-3 rounded-lg focus:border-primary outline-none"><option value="doctor">Doctor</option><option value="admin">Admin</option><option value="patient">Patient</option></select>
        <div className={`col-span-2 flex gap-4 ${editId ? '' : 'mt-0'}`}>
            <button type="submit" className="flex-1 bg-primary hover:bg-sky-600 text-white py-3 rounded-lg font-bold shadow-md transition-colors">{editId ? 'Update User' : 'Create Account'}</button>
            {editId && <button type="button" onClick={()=>{setEditId(null); reset();}} className="bg-slate-200 hover:bg-slate-300 py-3 px-6 rounded-lg font-bold transition-colors">Cancel Edit</button>}
        </div>
      </form>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <table className="w-full text-left"><thead className="text-slate-500 border-b"><tr className="border-b"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Actions</th></tr></thead>
        <tbody>{data?.map((u:any) => <tr key={u.id} className="border-b border-slate-100 last:border-0"><td className="py-4 font-medium text-secondary">{u.name}</td><td>{u.email}</td><td><span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{u.role}</span></td>
            <td className="flex gap-3 py-4">
                <button onClick={() => handleEdit(u)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg"><Edit size={18}/></button>
                <button onClick={() => {if(confirm('Delete User?')) del.mutate(u.id)}} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
            </td>
        </tr>)}</tbody></table>
      </div>
    </div>
  );
}

function RemindersTab() {
  // Live Polling every 5 seconds so cancellations disappear instantly!
  const { data } = useQuery({ queryKey: ['reminders'], queryFn: async () => (await api.get('/reminders/')).data, refetchInterval: 5000 });
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-secondary"><Bell size={24} className="text-amber-500"/> Tomorrow's Auto-Reminders ({data?.total_reminders || 0})</h3>
      <ul className="space-y-3">{data?.reminders?.map((r:string, i:number) => <li key={i} className="p-4 bg-sky-50 text-sky-900 rounded-xl border border-sky-100 font-medium">{r}</li>)}</ul>
    </div>
  );
}