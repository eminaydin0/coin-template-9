import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Home,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyData, updateName, updateEmail, updatePassword } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';
import toast from 'react-hot-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfilePage = () => {
  const { isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Form states
  const [nameForm, setNameForm] = useState({
    firstName: '',
    lastName: ''
  });
  const [emailForm, setEmailForm] = useState({
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        console.log('Loading user data...');
        
        // /my-data endpoint'ini kullanarak güncel veri al
        console.log('Fetching user data from /my-data endpoint...');
        const response = await getMyData();
        console.log('User data response:', response);
        const data = response.data;
        console.log('User data from API:', data);
        
        // API'den gelen veriyi kullan
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        });
        
        setNameForm({
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        });
        
        setEmailForm({
          email: data.email || ''
        });
        
        console.log('User data loaded successfully from API');
      } catch (error: any) {
        console.error('Error loading user data from API:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        
        // API'den veri alınamazsa AuthContext'ten veri al
        console.log('Falling back to AuthContext data...');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            console.log('Using AuthContext data:', user);
            
            setUserData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || ''
            });
            
            setNameForm({
              firstName: user.firstName || '',
              lastName: user.lastName || ''
            });
            
            setEmailForm({
              email: user.email || ''
            });
            
            console.log('User data loaded from AuthContext successfully');
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
            toast.error('Kullanıcı bilgileri yüklenirken hata oluştu');
          }
        } else {
          toast.error('Kullanıcı bilgileri yüklenirken hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, navigate]);


  // Update name
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameForm.firstName.trim() || !nameForm.lastName.trim()) {
      toast.error('Ad ve soyad alanları zorunludur');
      return;
    }

    try {
      setUpdating('name');
      const firstName = nameForm.firstName.trim();
      const lastName = nameForm.lastName.trim();
      
      console.log('Updating name with data:', {
        method: 1,
        firstName,
        lastName
      });
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Token exists' : 'No token found');
      
      const response = await updateName(firstName, lastName);
      console.log('Name update response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // API'den başarılı yanıt geldi mi kontrol et
      if (response.status === 200 || response.status === 201) {
        setUserData(prev => ({
          ...prev,
          firstName,
          lastName
        }));
        
        // AuthContext'i güncelle
        updateUser({
          firstName,
          lastName
        });
        
        toast.success('Ad ve soyad başarıyla güncellendi');
      } else {
        console.error('Unexpected response status:', response.status);
        toast.error('Beklenmeyen yanıt durumu: ' + response.status);
      }
    } catch (error: any) {
      console.error('Error updating name:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Ad ve soyad güncellenirken hata oluştu';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 401) {
        errorMessage = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz veri gönderildi.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      }
      
      toast.error(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  // Update email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.email.trim()) {
      toast.error('E-posta alanı zorunludur');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.email)) {
      toast.error('Geçerli bir e-posta adresi giriniz');
      return;
    }

    try {
      setUpdating('email');
      const email = emailForm.email.trim();
      
      console.log('Updating email with data:', {
        method: 2,
        email
      });
      
      const response = await updateEmail(email);
      console.log('Email update response:', response);
      
      setUserData(prev => ({
        ...prev,
        email
      }));
      
      // AuthContext'i güncelle
      updateUser({
        email
      });
      
      toast.success('E-posta başarıyla güncellendi');
    } catch (error: any) {
      console.error('Error updating email:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'E-posta güncellenirken hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Tüm şifre alanları zorunludur');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setUpdating('password');
      const password = passwordForm.newPassword;
      
      console.log('Updating password with data:', {
        method: 3,
        password
      });
      
      const response = await updatePassword(password);
      console.log('Password update response:', response);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Şifre başarıyla güncellendi');
    } catch (error: any) {
      console.error('Error updating password:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Şifre güncellenirken hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
          <CommonBackground />
          
          <div className="w-full relative z-10">
            {/* Header Section - CategoriesPage Stili */}
            <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="rounded-2xl backdrop-blur-xl bg-black/20 border border-white/10 p-6 shadow-2xl">
                  {/* Breadcrumb */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                    <Link 
                      to="/" 
                      className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>Ana Sayfa</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-300 font-medium">Profil Ayarları</span>
                  </div>

                  {/* Title Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <UserCircle className="h-4 w-4 text-orange-300" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">
                        <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                          Profil Ayarları
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Not Authenticated State */}
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div 
                    className="text-center py-20 rounded-xl border"
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <UserCircle className="h-16 w-16 text-orange-300/60 mx-auto mb-6" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Profil sayfasına erişmek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-sm px-4 mb-8">Hesabınıza giriş yaparak profil ayarlarınızı yönetebilirsiniz.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        to="/giris-yap" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold text-black rounded-xl bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transition-all"
                      >
                        <span className="text-sm">GİRİŞ YAP</span>
                      </Link>
                      
                      <Link 
                        to="/kayit-ol" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl border transition-all duration-200"
                        style={{
                          border: '1px solid rgba(249, 115, 22, 0.4)',
                          color: 'rgba(249, 115, 22, 0.95)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span className="text-sm">KAYIT OL</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CommonBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="xl" 
            text="Profil Yükleniyor..." 
            variant="gaming" 
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        {/* Lüks Arka Plan Efektleri */}
        <CommonBackground />

        <div className="w-full relative z-10">
          {/* Header Section - CategoriesPage Stili */}
          <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="rounded-2xl backdrop-blur-xl bg-black/20 border border-white/10 p-6 shadow-2xl">
                {/* Breadcrumb */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Ana Sayfa</span>
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-gray-300 font-medium">Profil Ayarları</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <UserCircle className="h-4 w-4 text-orange-300" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Profil Ayarları
                      </span>
                    </h1>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        color: 'rgba(249, 115, 22, 0.95)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      KİŞİSEL BİLGİLER
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <section className="relative py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Name Update Section */}
                <ProfileFormCard
                  number={1}
                  icon={User}
                  title="Ad ve Soyad"
                  description={`Mevcut: ${userData.firstName} ${userData.lastName}`}
                  onSubmit={handleUpdateName}
                  updating={updating === 'name'}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={nameForm.firstName}
                        onChange={(e) => setNameForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        placeholder="Adınızı girin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Soyad
                      </label>
                      <input
                        type="text"
                        value={nameForm.lastName}
                        onChange={(e) => setNameForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        placeholder="Soyadınızı girin"
                        required
                      />
                    </div>
                  </div>
                </ProfileFormCard>

                {/* Email Update Section */}
                <ProfileFormCard
                  number={2}
                  icon={Mail}
                  title="E-posta"
                  description={`Mevcut: ${userData.email}`}
                  onSubmit={handleUpdateEmail}
                  updating={updating === 'email'}
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Yeni E-posta
                    </label>
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1.5px solid rgba(249, 115, 22, 0.25)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                      }}
                      placeholder="Yeni e-posta adresinizi girin"
                      required
                    />
                  </div>
                </ProfileFormCard>
              </div>

              {/* Password Update Section - Full Width */}
              <ProfileFormCard
                number={3}
                icon={Shield}
                title="Şifre"
                description="Güvenliğiniz için şifrenizi güncelleyin"
                onSubmit={handleUpdatePassword}
                updating={updating === 'password'}
                className="mt-4 sm:mt-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        placeholder="Mevcut şifrenizi girin"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-300 transition-all duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        placeholder="Yeni şifrenizi girin"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-300 transition-all duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Yeni Şifre Tekrar
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-medium"
                        style={{
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid rgba(249, 115, 22, 0.25)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        }}
                        placeholder="Yeni şifrenizi tekrar girin"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-300 transition-all duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </ProfileFormCard>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>
      </div>
    </>
  );
};

// Profile Form Card Component
interface ProfileFormCardProps {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent) => void;
  updating: boolean;
  children: React.ReactNode;
  className?: string;
}

const ProfileFormCard = ({ number, icon: Icon, title, description, onSubmit, updating, children, className = '' }: ProfileFormCardProps) => {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(16px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.15), 0 4px 16px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)';
      }}
    >
      {/* Orange accent line at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.6), rgba(249, 115, 22, 0.3), transparent)',
        }}
      />

      <div className="p-6 sm:p-7 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          {/* Number Badge - Larger and more prominent */}
          <div 
            className="relative w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.15))',
              border: '2px solid rgba(249, 115, 22, 0.4)',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <span className="relative z-10">{number}</span>
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-50 blur-sm"
              style={{
                background: 'rgba(249, 115, 22, 0.3)',
              }}
            />
          </div>
          
          {/* Icon and Title Container */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {/* Icon */}
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.1))',
                  border: '1.5px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: '0 4px 8px rgba(249, 115, 22, 0.15)',
                }}
              >
                <Icon className="h-6 w-6 text-orange-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-white font-bold text-xl leading-tight">
                {title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed pl-14">
              {description}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="h-px mb-5"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent)',
          }}
        />

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col space-y-5">
          {children}
          
          {/* Submit Button - Enhanced */}
          <motion.button
            type="submit"
            disabled={updating}
            className="relative w-full font-bold text-black py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-6 group/btn"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 1))',
              boxShadow: '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
            whileHover={{ scale: updating ? 1 : 1.02, y: updating ? 0 : -2 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={(e) => {
              if (!updating) {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
            }}
          >
            {/* Shine effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
              }}
            />
            
            {updating ? (
              <>
                <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Güncelleniyor...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5 relative z-10" />
                <span className="text-sm relative z-10">Güncelle</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Corner decoration */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4), transparent)',
          transform: 'translate(30%, -30%)',
        }}
      />
    </div>
  );
};

export default ProfilePage;






