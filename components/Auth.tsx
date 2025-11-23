import React, { useState } from 'react';
import { UserProfile } from '../types';
import * as storage from '../services/storage';
import { ArrowRight, Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const user = await storage.loginWithGoogle();
        onLogin(user);
    } catch (e) {
        setError("Google Login failed. Try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }
    
    if (authMode === 'signup' && !name) {
        setError("Please enter a display name.");
        return;
    }

    setIsLoading(true);

    try {
        let user;
        if (authMode === 'signup') {
            user = await storage.registerUser(email, password, name);
        } else {
            user = await storage.loginUser(email, password);
        }
        onLogin(user);
    } catch (e: any) {
        setError(e.message || "Authentication failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 animate-in fade-in duration-500">
      <div className="w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-white tracking-tighter mb-3">
               Vlog <span className="text-lime-400">It.</span>
            </h1>
            <p className="text-zinc-500 text-base font-medium">
               {authMode === 'signin' ? "Welcome back, creator." : "Join the daily vibe."}
            </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl mb-10 border border-zinc-800">
            <button 
                onClick={() => { setAuthMode('signin'); setError(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === 'signin' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => { setAuthMode('signup'); setError(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === 'signup' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                Sign Up
            </button>
        </div>

        {/* Google Button */}
        <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black font-bold text-base py-4 rounded-2xl mb-8 flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-70"
        >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </>
            )}
        </button>

        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-zinc-600">
                <span className="bg-black px-4">Or continue with ID</span>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
                <div className="relative group">
                    <User size={20} className="absolute top-4 left-4 text-zinc-600 group-focus-within:text-lime-400 transition-colors" />
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 pl-12 rounded-2xl text-base focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600"
                        placeholder="Display Name"
                    />
                </div>
            )}
            
            <div className="relative group">
                <Mail size={20} className="absolute top-4 left-4 text-zinc-600 group-focus-within:text-lime-400 transition-colors" />
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 pl-12 rounded-2xl text-base focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600"
                    placeholder="Email address"
                />
            </div>

            <div className="relative group">
                <Lock size={20} className="absolute top-4 left-4 text-zinc-600 group-focus-within:text-lime-400 transition-colors" />
                <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 pl-12 rounded-2xl text-base focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder:text-zinc-600"
                    placeholder="Password"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold text-base rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 mt-6"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                        {authMode === 'signin' ? 'Sign In' : 'Create Account'} 
                        <ArrowRight size={20} />
                    </>
                )}
            </button>
        </form>

        {authMode === 'signup' && (
            <div className="mt-8 flex items-start gap-3 text-zinc-500 px-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-zinc-600" />
                <p className="text-xs leading-relaxed">
                    By signing up, you agree to keep the vibe positive. We're a community of creators.
                </p>
            </div>
        )}

      </div>
      
      <div className="absolute bottom-8 text-[10px] text-zinc-800 font-bold uppercase tracking-widest">
         Secure • Private • Creative
      </div>
    </div>
  );
};