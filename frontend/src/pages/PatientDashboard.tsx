import { useState } from 'react'; import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; import { api } from '../api/axios'; import { useAuthStore } from '../store/authStore';
export default function PatientDashboard() {
  const [tab, setTab] = useState('book');
  return (
    <div className="space-y-8">
      <div className="flex border-b border-slate-200 gap-8">
        <button className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === 'book' ? 'border-b-4 border-primary text-primary' : 'text-slate-400'}`} onClick={() => setTab('book')}>Book Appointment</button>
        <button className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === 'myAppts' ? 'border-b-4 border-primary text-primary' : 'text-slate-400'}`} onClick={() => setTab('myAppts')}>My Appointments</button>
        <button className={`py-3 px-2 font-bold uppercase tracking-wide text-sm ${tab === 'myRecords' ? 'border-b-4 border-primary text-primary' : 'text-slate-400'}`} onClick={() => setTab('myRecords')}>My Medical History</button>
      </div>
      {tab === 'book' && <BookTab />} {tab === 'myAppts' && <MyApptsTab />} {tab === 'myRecords' && <MyRecordsTab />}
    </div>
  );
}

function BookTab() {
  const { user } = useAuthStore(); const [doc, setDoc] = useState(''); const [date, setDate] = useState(''); const [time, setTime] = useState('');
  const { data: docs } = useQuery({ queryKey: ['docs'], queryFn: async () => (await api.get('/doctors/')).data });
  const qc = useQueryClient();
  const book = async (e:any) => {
    e.preventDefault();
    try { 
        await api.post('/appointments/', { patient_id: user.id, doctor_id: +doc, appointment_date: date, appointment_time: time+":00" }); 
        alert('Appointment Confirmed!'); 
        qc.invalidateQueries({queryKey:['myAppts']});
    }
    catch(err:any) { alert(err.response?.data?.detail || 'Booking Error'); }
  };
  return (
    <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={book} className="bg-white p-8 border border-slate-200 rounded-2xl space-y-5 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-secondary border-b pb-4">Schedule a Visit</h3>
        <select required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none" onChange={e=>setDoc(e.target.value)}><option value="">Select Doctor</option>{docs?.map((d:any)=><option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}</select>
        <input type="date" required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none" onChange={e=>setDate(e.target.value)} />
        <input type="time" required className="w-full border-2 p-3 rounded-lg focus:border-primary outline-none" onChange={e=>setTime(e.target.value)} />
        <button className="w-full bg-primary hover:bg-sky-600 text-white py-3 rounded-lg font-bold shadow-md transition-colors">Confirm Booking</button>
        </form>
        <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-secondary border-b pb-4 mb-4">Doctor Directory</h3>
            <div className="space-y-4">
                {docs?.map((d:any)=>(
                    <div key={d.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                        <p className="font-bold text-lg text-primary">{d.name}</p>
                        <p className="text-sm text-slate-600 font-medium uppercase tracking-wider">{d.specialization} • {d.experience} Yrs Exp</p>
                        <p className="text-sm text-slate-600 mt-2">Days: {d.available_days} | Fee: ${d.consultation_fee}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

function MyApptsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['myAppts'], queryFn: async () => (await api.get('/appointments/my')).data });

  const cancel = useMutation({ 
    mutationFn: async (id: number) => api.put(`/appointments/${id}/cancel`), 
    onSuccess: () => {
        // FIX: Invalidate ALL queries globally so Admin Reminders and Stats reset immediately
        qc.invalidateQueries(); 
        alert('Appointment Cancelled Successfully');
    } 
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-secondary border-b pb-4 mb-6">Upcoming & Past Appointments</h3>
        <div className="space-y-4">
            {data?.map((a:any) => (
                <div key={a.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-secondary">{a.doctor?.name}</p>
                        <p className="text-slate-500 font-medium">{a.appointment_date} at {a.appointment_time}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${a.status==='Booked' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                    </div>
                    {a.status === 'Booked' && (
                        <button onClick={()=>cancel.mutate(a.id)} className="border-2 border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors">Cancel Visit</button>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}

function MyRecordsTab() {
  const { data } = useQuery({ queryKey: ['myRecs'], queryFn: async () => (await api.get('/medical-records/my')).data });
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-secondary border-b pb-4 mb-6">Personal Health Records</h3>
        <div className="space-y-4">
            {data?.map((r:any) => (
                <div key={r.id} className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-bold text-xl text-primary">{r.doctor?.name}</p>
                        <p className="text-sm font-medium text-slate-400 bg-white px-3 py-1 rounded-full border">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-100">
                        <p className="text-slate-700"><strong className="text-secondary font-bold">Diagnosis:</strong> {r.diagnosis}</p>
                        <p className="text-slate-700"><strong className="text-secondary font-bold">Prescription:</strong> {r.prescription}</p>
                        {r.notes && <p className="text-slate-700 text-sm italic"><strong className="text-secondary font-bold not-italic">Notes:</strong> {r.notes}</p>}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
