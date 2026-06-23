'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setCheckingSession(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    
    setLoading(true);
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) toast.error(error.message);
      else {
        toast.success('Account created successfully! You can now log in.');
        setIsSignUp(false); // Toggle back to login mode automatically
        setPassword('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) toast.error(error.message);
      else {
        toast.success('Welcome back!');
        router.push('/');
      }
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left side - Decorative Desktop Splashboard */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        
        <div className="z-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-6 leading-tight">Create professional invoices in seconds.</h1>
          <ul className="space-y-4">
            {['Save to cloud instantly', 'Export to PDF format', 'Manage multiple clients'].map(item => (
              <li key={item} className="flex items-center text-slate-300 text-lg">
                <CheckCircle2 className="w-5 h-5 mr-3 text-sky-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="z-10">
          <p className="text-slate-400 text-sm">© Professional Invoice Generator</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-8">
             <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome'}
            </h2>
            <p className="text-slate-500">
              {isSignUp ? 'Sign up to start saving your professional invoices.' : 'Enter your details to access your account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nayan@example.com"
                className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
            </p>
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="w-full h-12 inline-flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Create new account'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
