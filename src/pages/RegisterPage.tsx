import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, UserCircle, UserCircle2, Calendar, Fingerprint, Users, UserPlus, Home, ChevronRight, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    tcNo: '',
    birthDate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Hata mesajını temizle
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return false;
    }

    if (formData.tcNo.length !== 11 || !/^\d{11}$/.test(formData.tcNo)) {
      setError('TC kimlik numarası 11 haneli olmalıdır');
      return false;
    }

    if (!formData.birthDate) {
      setError('Doğum tarihi gereklidir');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        // Başarılı kayıt sonrası login sayfasına yönlendir
        navigate('/giris-yap');
      } else {
        setError(result.error || 'Kayıt başarısız');
      }
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <CommonBackground />

        <div className="w-full relative z-10">
          {/* Header Section - Register Özel Tasarım */}
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
                <span className="text-gray-300 font-medium">Kayıt Ol</span>
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
                    <UserPlus className="h-6 w-6 text-orange-300" />
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
                    Hesap Oluştur
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-gray-400 text-xs sm:text-sm"
                >
                  Oyun dünyasına katıl! Hemen ücretsiz hesap oluştur.
                </motion.p>
              </motion.div>
            </div>
          </div>

          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">

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

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'firstName', label: 'Ad', icon: UserCircle, placeholder: 'Adınız' },
                      { id: 'lastName', label: 'Soyad', icon: UserCircle2, placeholder: 'Soyadınız' },
                    ].map(({ id, label, icon: Icon, placeholder }) => (
                      <div key={id}>
                        <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor={id}>
                          {label}
                        </label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                          <input
                            type="text"
                            id={id}
                            name={id}
                            value={(formData as any)[id]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pl-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                            style={{
                              background: 'rgba(0, 0, 0, 0.65)',
                              border: '1.5px solid rgba(249, 115, 22, 0.25)',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                              e.currentTarget.style.boxShadow =
                                '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                            }}
                            placeholder={placeholder}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="email">
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
                        className="w-full px-4 py-3 pl-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.65)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                          e.currentTarget.style.boxShadow =
                            '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                        }}
                        placeholder="oyuncu@oyun.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="tcNo">
                        TC Kimlik No
                      </label>
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                        <input
                          type="text"
                          id="tcNo"
                          name="tcNo"
                          value={formData.tcNo}
                          onChange={handleChange}
                          required
                          maxLength={11}
                          pattern="[0-9]{11}"
                          className="w-full px-4 py-3 pl-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                          style={{
                            background: 'rgba(0, 0, 0, 0.65)',
                            border: '1.5px solid rgba(249, 115, 22, 0.25)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                            e.currentTarget.style.boxShadow =
                              '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                          }}
                          placeholder="12345678901"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-orange-400/70" />
                        <span>11 haneli TC kimlik numarası</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="birthDate">
                        Doğum Tarihi
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 pl-11 rounded-xl text-white focus:outline-none transition-all duration-300 font-medium"
                          style={{
                            background: 'rgba(0, 0, 0, 0.65)',
                            border: '1.5px solid rgba(249, 115, 22, 0.25)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                            e.currentTarget.style.boxShadow =
                              '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'password', label: 'Şifre', value: formData.password, setter: setShowPassword, show: showPassword },
                      {
                        id: 'confirmPassword',
                        label: 'Şifre Tekrar',
                        value: formData.confirmPassword,
                        setter: setShowConfirmPassword,
                        show: showConfirmPassword,
                      },
                    ].map(({ id, label, value, setter, show }) => (
                      <div key={id}>
                        <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor={id}>
                          {label}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300/70" />
                          <input
                            type={show ? 'text' : 'password'}
                            id={id}
                            name={id}
                            value={value}
                            onChange={handleChange}
                            required
                            minLength={id === 'password' ? 8 : undefined}
                            className="w-full px-4 py-3 pl-11 pr-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                            style={{
                              background: 'rgba(0, 0, 0, 0.65)',
                              border: '1.5px solid rgba(249, 115, 22, 0.25)',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.55)';
                              e.currentTarget.style.boxShadow =
                                '0 0 0 3px rgba(249, 115, 22, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)';
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.72)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                            }}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setter((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-300 transition-all duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                            aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
                          >
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {id === 'password' && (
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-orange-400/70" />
                            <span>En az 8 karakter olmalıdır</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="relative w-full font-bold text-black py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2 group/btn"
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
                        <span className="text-sm">Hesap Oluşturuluyor...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 relative z-10" />
                        <span className="text-sm relative z-10">HESAP OLUŞTUR</span>
                      </>
                    )}
                  </motion.button>

                  <div className="text-center pt-6 border-t" style={{ borderColor: 'rgba(249, 115, 22, 0.15)' }}>
                    <p className="text-gray-400 text-sm mb-3">Zaten hesabın var mı?</p>
                    <Link
                      to="/giris-yap"
                      className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl border transition-all duration-200"
                      style={{
                        border: '1px solid rgba(249, 115, 22, 0.4)',
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
                      <span className="text-sm">GİRİŞ YAP</span>
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

export default RegisterPage;





