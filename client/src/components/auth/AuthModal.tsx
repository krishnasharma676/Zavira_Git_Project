import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, Phone, User, ArrowRight,
  Star, Sparkles, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuth } from '../../store/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  auth, googleProvider,
  RecaptchaVerifier, signInWithPopup,
  signInWithPhoneNumber,
} from '../../config/firebase';
import type { ConfirmationResult } from 'firebase/auth';

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'register' | 'phone' | 'email_otp';
type PhoneStep = 'input' | 'otp';

// ─── Google SVG Icon ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, setAuthModalTab } = useUIStore();
  const { setAuth } = useAuth();
  // String = loading with that message; '' = idle
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const loading = !!loadingMsg;
  const [mode, setMode] = useState<AuthMode>(authModalTab === 'register' ? 'register' : 'login');
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<any>(null); // persisted across renders

  // Email/Password form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailOtpFlow, setEmailOtpFlow] = useState<'login' | 'register'>('login');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync mode with tab prop
    setMode(authModalTab === 'register' ? 'register' : 'login');
  }, [authModalTab]);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  // Cleanup reCAPTCHA when modal closes to release the DOM element
  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        try { recaptchaVerifier.current.clear(); } catch (_) {}
        recaptchaVerifier.current = null;
      }
    };
  }, []);

  if (!isAuthModalOpen) return null;

  // ── Helper: sync with backend & set auth ──────────────────────────────────
  const syncWithBackend = async (idToken: string) => {
    try {
      const { data } = await api.post('/auth/firebase/sync', {}, {
        headers: { Authorization: `Bearer ${idToken}` },
        withCredentials: true,
      });
      setAuth(data.data.user, data.data.accessToken);
      return data.data.isNewUser as boolean;
    } catch (err: any) {
      // Network error = backend not running
      if (!err.response) {
        throw new Error('backend_offline');
      }
      throw err;
    }
  };

  // ── Email / Password Login ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMsg('Signing in…');
    try {
      const { data } = await api.post('/auth/login', loginData);
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Welcome back!');
      closeAuthModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoadingMsg('');
    }
  };

  // ── Email / Password Register ─────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoadingMsg('Sending verification code…');
    try {
      await api.post('/auth/register', registerData);
      setEmailOtpFlow('register');
      setMode('email_otp');
      setOtp(['', '', '', '', '', '']);
      setOtpTimer(60);
      toast.success('Verification code sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoadingMsg('');
    }
  };

  // ── Google Sign-In ────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setLoadingMsg('Opening Google…');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setLoadingMsg('Signing in with Google…');
      const idToken = await result.user.getIdToken();
      const isNew = await syncWithBackend(idToken);
      toast.success(isNew ? 'Account created via Google!' : 'Welcome back!');
      closeAuthModal();
    } catch (err: any) {
      const code: string = err?.code || err?.message || '';
      console.error('[Google Sign-In Error]', code, err);

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      if (code === 'backend_offline') {
        toast.error('Backend server is not running. Start the server and try again.');
        return;
      }
      if (code === 'auth/popup-blocked') {
        toast.error('Popup blocked — allow popups for this site and try again.');
        return;
      }
      if (code === 'auth/unauthorized-domain') {
        toast.error('Add "localhost" to Firebase Authorized Domains and try again.');
        return;
      }
      toast.error(`Sign-in failed: ${code}`);
    } finally {
      setLoadingMsg('');
    }
  };

  // ── Phone — Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    setLoadingMsg('Sending OTP…');
    try {
      // Destroy any previously rendered reCAPTCHA before creating a new one
      if (recaptchaVerifier.current) {
        try { recaptchaVerifier.current.clear(); } catch (_) {}
        recaptchaVerifier.current = null;
      }

      const verifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          // Auto-clear on expiry so next attempt creates fresh verifier
          try { verifier.clear(); } catch (_) {}
          recaptchaVerifier.current = null;
        },
      });
      recaptchaVerifier.current = verifier;

      const formatted = cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
      const result = await signInWithPhoneNumber(auth, formatted, verifier);
      setConfirmResult(result);
      setPhoneStep('otp');
      setOtpTimer(60);
      toast.success(`OTP sent to ${formatted}`);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      // Clear broken verifier so retry works cleanly
      if (recaptchaVerifier.current) {
        try { recaptchaVerifier.current.clear(); } catch (_) {}
        recaptchaVerifier.current = null;
      }
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoadingMsg('');
    }
  };

  // ── Email — Verify OTP ──────────────────────────────────────────────────
  const handleVerifyEmailOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    
    setLoadingMsg('Verifying…');
    try {
      let response;
      if (emailOtpFlow === 'login') {
        response = await api.post('/auth/verify-email-login', {
          email: loginData.email,
          code
        });
      } else {
        const { confirmPassword: _, ...rest } = registerData;
        response = await api.post('/auth/verify-email-register', {
          data: rest,
          code
        });
      }
      
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      toast.success(emailOtpFlow === 'login' ? 'Welcome back!' : 'Account created!');
      closeAuthModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoadingMsg('');
    }
  };

  // ── Phone — Verify OTP ────────────────────────────────────────────────────
  const handleVerifyPhoneOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter all 6 digits'); return; }
    if (!confirmResult) { toast.error('Session expired. Resend OTP.'); return; }
    setLoadingMsg('Verifying OTP…');
    try {
      const result = await confirmResult.confirm(code);
      setLoadingMsg('Setting up your account…');
      const idToken = await result.user.getIdToken();
      const isNew = await syncWithBackend(idToken);
      toast.success(isNew ? 'Account created!' : 'Welcome back!');
      closeAuthModal();
    } catch (err: any) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoadingMsg('');
    }
  };

  // ── OTP box key handling ──────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    if (m === 'login' || m === 'register') {
      setAuthModalTab(m);
    }
    setPhoneStep('input');
    setOtp(['', '', '', '', '', '']);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Hidden reCAPTCHA mount point */}
        <div ref={recaptchaRef} id="recaptcha-container" className="hidden" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-50 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>

          {/* ── Loading Overlay ── blocks modal content during API calls ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="auth-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-50 rounded-[2rem] flex flex-col items-center justify-center"
                style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.78)' }}
              >
                {/* Spinner with pulse rings */}
                <div className="relative flex items-center justify-center mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-20 h-20 rounded-full bg-[#7A578D]/25"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.05, 0.45] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                    className="absolute w-14 h-14 rounded-full bg-[#7A578D]/20"
                  />
                  {/* Arc spinner */}
                  <svg className="w-12 h-12 animate-spin" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#EAD0DB" strokeWidth="3.5" />
                    <path d="M24 4 A20 20 0 0 1 44 24" stroke="#7A578D" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                  {/* Centre dot */}
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#7A578D]" />
                </div>

                {/* Animated context message */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsg}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] font-black uppercase tracking-[0.35em] text-[#7A578D]"
                  >
                    {loadingMsg}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Left Panel ──────────────────────────────────────────────── */}
          <div className="hidden md:flex w-[34%] bg-[#EAD0DB] dark:bg-[#2D1B2D] p-7 flex-col justify-between relative overflow-hidden shrink-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#7A578D]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-xl font-sans font-black text-[#7A578D] dark:text-[#EAD0DB] mb-1">Zavira</h2>
              <div className="h-0.5 w-10 bg-[#7A578D] rounded-full mb-5" />
              <div className="mb-5">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#7A578D]/60 mb-1">Your Account</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">JOIN THE<br />VAULT</h3>
              </div>
              <div className="space-y-2">
                <FeatureItem icon={<Star size={13} />} title="Best Service" desc="Always with you" />
                <FeatureItem icon={<ShieldCheck size={13} />} title="Safe & Secure" desc="Protected always" />
                <FeatureItem icon={<Sparkles size={13} />} title="New Styles" desc="Latest designs" />
              </div>
            </div>

            <p className="relative z-10 text-[8px] font-black uppercase tracking-[0.3em] text-[#7A578D]/40 italic">
              Signing in...
            </p>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────────── */}
          <div className="flex-1 p-6 md:p-8 bg-white dark:bg-[#121212] overflow-y-auto max-h-[90vh]">
            <div className="max-w-sm mx-auto flex flex-col min-h-full">

              {/* Tab switcher */}
              <div className="flex space-x-6 border-b border-gray-100 dark:border-white/10 pb-3 mb-5">
                {(['login', 'register'] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] relative transition-all pb-0.5 ${
                      mode === m ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    {m === 'login' ? 'Login' : 'Signup'}
                    {mode === m && (
                      <motion.div layoutId="activeTab" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#7A578D]" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── LOGIN ──────────────────────────────────────────────── */}
              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleLogin} className="space-y-3">
                    <InputGroup icon={<Mail size={13} />} label="Email Address"
                      placeholder="name@example.com" type="email"
                      value={loginData.email}
                      onChange={v => setLoginData({ ...loginData, email: v })} />
                    <InputGroup icon={<Lock size={13} />} label="Password"
                      placeholder="••••••••••" type="password"
                      value={loginData.password}
                      onChange={v => setLoginData({ ...loginData, password: v })} />
                    <button type="submit" disabled={loading}
                      className="luxury-button w-full rounded-xl py-2.5 flex items-center justify-center space-x-2 group mt-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                        {loading ? 'Signing in...' : 'Login Now'}
                      </span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <Divider />

                  {/* Social buttons */}
                  <div className="space-y-2">
                    <SocialButton onClick={handleGoogleSignIn} loading={loading} icon={<GoogleIcon />} label="Continue with Google" />
                    <SocialButton onClick={() => switchMode('phone')} icon={<Phone size={14} className="text-[#7A578D]" />} label="Continue with Phone OTP" />
                  </div>
                </motion.div>
              )}

              {/* ── REGISTER ───────────────────────────────────────────── */}
              {mode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleRegister} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <InputGroup icon={<User size={13} />} label="Name"
                        placeholder="Your name"
                        value={registerData.name}
                        onChange={v => setRegisterData({ ...registerData, name: v })} />
                      <InputGroup icon={<Mail size={13} />} label="Email"
                        placeholder="email@example.com" type="email"
                        value={registerData.email}
                        onChange={v => setRegisterData({ ...registerData, email: v })} />
                    </div>
                    <InputGroup icon={<Phone size={13} />} label="Phone"
                      placeholder="10 digit number"
                      value={registerData.phone}
                      onChange={v => setRegisterData({ ...registerData, phone: v })} />
                    <div className="grid grid-cols-2 gap-2.5">
                      <InputGroup icon={<Lock size={13} />} label="Password"
                        placeholder="Min 6 chars" type="password"
                        value={registerData.password}
                        onChange={v => setRegisterData({ ...registerData, password: v })} />
                      <InputGroup icon={<ShieldCheck size={13} />} label="Confirm"
                        placeholder="Repeat" type="password"
                        value={registerData.confirmPassword}
                        onChange={v => setRegisterData({ ...registerData, confirmPassword: v })} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="luxury-button w-full rounded-xl py-2.5 flex items-center justify-center space-x-2 group mt-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                        {loading ? 'Creating...' : 'Create Account'}
                      </span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <Divider />

                  <div className="space-y-2">
                    <SocialButton onClick={handleGoogleSignIn} loading={loading} icon={<GoogleIcon />} label="Sign up with Google" />
                    <SocialButton onClick={() => switchMode('phone')} icon={<Phone size={14} className="text-[#7A578D]" />} label="Sign up with Phone OTP" />
                  </div>
                </motion.div>
              )}

              {/* ── EMAIL OTP ───────────────────────────────────────────── */}
              {mode === 'email_otp' && (
                <motion.div
                  key="email_otp"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => switchMode(emailOtpFlow)}
                    className="flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors"
                  >
                    <ChevronRight size={10} className="rotate-180" />
                    <span>Back to {emailOtpFlow === 'login' ? 'Login' : 'Signup'}</span>
                  </button>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Verify Email</h3>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">
                      We've sent a 6-digit code to <span className="text-gray-900 dark:text-white font-black">{emailOtpFlow === 'login' ? loginData.email : registerData.email}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-2 justify-between">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-10 h-12 text-center bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-xl text-sm font-black text-gray-900 dark:text-white outline-none focus:border-[#7A578D] transition-colors"
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerifyEmailOtp}
                      disabled={loading || otp.join('').length < 6}
                      className="luxury-button w-full rounded-xl py-2.5 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <ShieldCheck size={12} />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                        {loading ? 'Verifying...' : 'Verify Email'}
                      </span>
                    </button>

                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                          Resend code in {otpTimer}s
                        </p>
                      ) : (
                        <button
                          onClick={emailOtpFlow === 'login' ? handleLogin : handleRegister}
                          className="text-[9px] font-black uppercase tracking-wider text-[#7A578D] hover:underline"
                        >
                          Resend Verification Code
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PHONE OTP ───────────────────────────────────────────── */}
              {mode === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => switchMode('login')}
                    className="flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors"
                  >
                    <ChevronRight size={10} className="rotate-180" />
                    <span>Back to Login</span>
                  </button>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Phone Verification</h3>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">
                      {phoneStep === 'input' ? 'Enter your mobile number' : 'Enter the 6-digit OTP sent to your phone'}
                    </p>
                  </div>

                  {phoneStep === 'input' ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-3 py-2.5">
                          <span className="text-xs font-black text-gray-500 dark:text-gray-400">🇮🇳 +91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl py-2.5 px-4 outline-none focus:border-[#7A578D]/40 text-xs font-bold text-gray-900 dark:text-white placeholder:text-gray-300"
                          maxLength={10}
                        />
                      </div>
                      <button
                        onClick={handleSendOtp}
                        disabled={loading || phone.length < 10}
                        className="luxury-button w-full rounded-xl py-2.5 flex items-center justify-center space-x-2 group disabled:opacity-50"
                      >
                        <Phone size={12} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 6 OTP boxes */}
                      <div className="flex space-x-2 justify-between">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={el => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-10 h-12 text-center bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-xl text-sm font-black text-gray-900 dark:text-white outline-none focus:border-[#7A578D] transition-colors"
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleVerifyPhoneOtp}
                        disabled={loading || otp.join('').length < 6}
                        className="luxury-button w-full rounded-xl py-2.5 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <ShieldCheck size={12} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </span>
                      </button>

                      <div className="text-center">
                        {otpTimer > 0 ? (
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                            Resend in {otpTimer}s
                          </p>
                        ) : (
                          <button
                            onClick={() => { setPhoneStep('input'); setOtp(['', '', '', '', '', '']); }}
                            className="text-[9px] font-black uppercase tracking-wider text-[#7A578D] hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/5 text-center">
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center space-x-1.5">
                  <ShieldCheck size={8} className="text-[#C9A0C8]" />
                  <span>Secure Login Active</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const Divider = () => (
  <div className="flex items-center space-x-3">
    <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 dark:text-gray-700">or</span>
    <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
  </div>
);

const SocialButton = ({
  onClick, loading = false, icon, label
}: { onClick: () => void; loading?: boolean; icon: React.ReactNode; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-[#7A578D]/30 hover:bg-[#7A578D]/5 transition-all group disabled:opacity-60"
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 group-hover:text-[#7A578D] transition-colors">
      {label}
    </span>
  </button>
);

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="flex items-center space-x-3 bg-white/40 dark:bg-black/20 p-2.5 rounded-xl border border-white/50 dark:border-white/5">
    <div className="w-7 h-7 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center text-[#7A578D] shadow-sm shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] dark:text-[#EAD0DB] truncate">{title}</h4>
      <p className="text-[8px] text-[#7A578D]/70 dark:text-[#EAD0DB]/50 font-medium truncate">{desc}</p>
    </div>
  </div>
);

const InputGroup = ({ icon, label, placeholder, type = 'text', value, onChange }: {
  icon: React.ReactNode; label: string; placeholder: string;
  type?: string; value: string; onChange: (val: string) => void;
}) => (
  <div className="space-y-1.5 group">
    <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#7A578D] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700 group-focus-within:text-[#7A578D] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-3.5 outline-none focus:border-[#7A578D]/30 focus:bg-white dark:focus:bg-[#1A1A1A] transition-all text-xs font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-white"
        required
      />
    </div>
  </div>
);

export default AuthModal;
