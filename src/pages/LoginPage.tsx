import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Users, LogIn, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) navigate('/');
      else setError(result.error || 'Giriş başarısız');
    } catch {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const emailInvalid = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordInvalid = touched.password && formData.password.length < 6;

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <CommonBackground />

        <div className="w-full relative z-10">
          {/* Header Section - Login Özel Tasarım */}
          <div className="w-full mb-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center justify-center gap-1.5 text-xs mb-4">
                <Link 
                  to="/" 
                  className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-300 font-medium">Giriş Yap</span>
              </div>

              {/* Title Section - Kompakt */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Icon Container - Kompakt */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="inline-flex items-center justify-center mb-3"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.12))',
                      border: '1.5px solid rgba(249, 115, 22, 0.35)',
                      boxShadow: '0 4px 16px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <LogIn className="h-6 w-6 text-orange-300" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                >
                  <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                    Hesabına Giriş Yap
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-gray-400 text-xs sm:text-sm"
                >
                  Oyun dünyasına hoş geldin!
                </motion.p>
              </motion.div>
            </div>
          </div>

          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-lg mx-auto space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl border overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.78)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.7), rgba(249, 115, 22, 0.2), transparent)',
                }}
              />

              <div className="p-6 sm:p-7">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {error && (
                    <div
                      className="px-4 py-3 rounded-xl border backdrop-blur-sm"
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'rgba(252, 165, 165, 0.95)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-invalid={emailInvalid || undefined}
                        aria-describedby={emailInvalid ? 'email-err' : undefined}
                        className="w-full px-4 py-3 pl-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: emailInvalid ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.65)',
                          border: emailInvalid
                            ? '1.5px solid rgba(239, 68, 68, 0.5)'
                            : '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          if (!emailInvalid) {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                            e.currentTarget.style.boxShadow =
                              '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (!emailInvalid) {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                          }
                        }}
                        placeholder="oyuncu@oyun.com"
                      />
                    </div>
                    {emailInvalid && (
                      <p id="email-err" className="mt-2 text-sm text-red-400">
                        Lütfen geçerli bir e-posta girin.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        aria-invalid={passwordInvalid || undefined}
                        aria-describedby={passwordInvalid ? 'pass-err' : undefined}
                        className="w-full px-4 py-3 pl-11 pr-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: passwordInvalid ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.65)',
                          border: passwordInvalid
                            ? '1.5px solid rgba(239, 68, 68, 0.5)'
                            : '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          if (!passwordInvalid) {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                            e.currentTarget.style.boxShadow =
                              '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (!passwordInvalid) {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                          }
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-300 transition-all duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                        aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordInvalid && (
                      <p id="pass-err" className="mt-2 text-sm text-red-400">
                        Şifre en az 6 karakter olmalı.
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="relative w-full font-bold text-black py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-4 group/btn"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 1))',
                      boxShadow: '0 10px 28px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
                    }}
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          '0 14px 36px rgba(249,115,22,0.55), inset 0 1px 0 rgba(255,255,255,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 10px 28px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.35)';
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Giriş Yapılıyor...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 relative z-10" />
                        <span className="text-sm relative z-10">GİRİŞ YAP</span>
                      </>
                    )}
                  </motion.button>

                  <div className="text-center pt-6 border-t" style={{ borderColor: 'rgba(249, 115, 22, 0.15)' }}>
                    <p className="text-gray-400 text-sm mb-3">Henüz hesabın yok mu?</p>
                    <Link
                      to="/kayit-ol"
                      className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl border transition-all duration-200"
                      style={{
                        border: '1px solid rgba(249, 115, 22, 0.45)',
                        color: 'rgba(249, 115, 22, 0.95)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(249, 115, 22, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-sm">HESAP OLUŞTUR</span>
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;





