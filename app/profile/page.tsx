'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Building, MapPin, CreditCard, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Profile = {
  id: string;
  business_name: string | null;
  bsb: string | null;
  account_number: string | null;
};

type Client = {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ id: '', business_name: '', bsb: '', account_number: '' });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', address: '', email: '' });
  const [isAddingClient, setIsAddingClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    // Fetch Profile
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profileData) {
      setProfile({
        id: user.id,
        business_name: profileData.business_name || '',
        bsb: profileData.bsb || '',
        account_number: profileData.account_number || '',
      });
    }

    // Fetch Clients
    const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (clientsData) {
      setClients(clientsData);
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from('profiles').update({
      business_name: profile.business_name,
      bsb: profile.bsb,
      account_number: profile.account_number
    }).eq('id', profile.id);

    setSavingProfile(false);
    if (error) {
      toast.error('Failed to save profile details');
    } else {
      toast.success('Profile saved successfully');
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return toast.error('Client name is required');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('clients').insert({
      user_id: user.id,
      name: newClient.name,
      address: newClient.address,
      email: newClient.email
    }).select().single();

    if (error) {
      toast.error('Failed to add client');
    } else if (data) {
      toast.success('Client added successfully');
      setClients([data, ...clients]);
      setNewClient({ name: '', address: '', email: '' });
      setIsAddingClient(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete client');
    } else {
      toast.success('Client deleted');
      setClients(clients.filter(c => c.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors inline-flex items-center text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <User className="w-8 h-8 text-sky-500" />
              Settings & Clients
            </h1>
            <p className="text-slate-500">Manage your business identity and saved clients.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Profile */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
              <Building className="w-5 h-5 text-sky-500" /> Business Profile
            </h2>
            <p className="text-sm text-slate-500">This information securely auto-fills exactly as "Your Details" on new invoices.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Business Name</label>
                <input 
                  type="text"
                  value={profile.business_name || ''}
                  onChange={(e) => setProfile({...profile, business_name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">BSB</label>
                  <input 
                    type="text"
                    value={profile.bsb || ''}
                    onChange={(e) => setProfile({...profile, bsb: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="e.g. 082451"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Account Number</label>
                  <input 
                    type="text"
                    value={profile.account_number || ''}
                    onChange={(e) => setProfile({...profile, account_number: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="e.g. 407220013"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full inline-flex items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white h-10 px-4 hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2 cursor-pointer"
              >
                {savingProfile ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
              </button>
            </div>
          </div>

          {/* Client Management */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
                <MapPin className="w-5 h-5 text-indigo-500" /> Saved Clients
              </h2>
              <button 
                onClick={() => setIsAddingClient(!isAddingClient)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-50 text-indigo-600 hover:bg-indigo-100 h-9 px-4 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Client
              </button>
            </div>
            
            {isAddingClient && (
              <form onSubmit={handleAddClient} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Client Name</label>
                  <input 
                    type="text" required
                    value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Client Company Ltd."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Address / Details</label>
                  <textarea 
                    value={newClient.address} onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="123 Example St&#10;City, Country"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsAddingClient(false)} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer transition-colors">Save Client</button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {clients.length === 0 && !isAddingClient ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>No clients saved yet.</p>
                </div>
              ) : (
                clients.map(client => (
                  <div key={client.id} className="p-4 rounded-lg border border-slate-200 flex justify-between items-start hover:border-slate-300 transition-colors bg-white">
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      {client.address && <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">{client.address}</p>}
                    </div>
                    <button 
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
