import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Scan, 
  TrendingUp, 
  FlaskConical, 
  History, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  Wifi, 
  WifiOff, 
  Globe, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageKey } from '../i18n/translations';
import { getQueuedDiagnostics, syncOfflineDiagnosticsQueue } from '../services/offlineSync';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, switchRole, logout } = useAuth();
  const location = useLocation();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedCount, setQueuedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updateQueue = () => {
      setQueuedCount(getQueuedDiagnostics().length);
    };
    updateQueue();
    const interval = setInterval(updateQueue, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (queuedCount === 0 || syncing) return;
    setSyncing(true);
    try {
      await syncOfflineDiagnosticsQueue();
      setQueuedCount(getQueuedDiagnostics().length);
    } finally {
      setSyncing(false);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: t.nav.dashboard, icon: Sprout },
    { to: '/diagnose', label: t.nav.diagnose, icon: Scan, badge: 'AI' },
    { to: '/farms', label: t.nav.farms, icon: MapPin },
    { to: '/market', label: t.nav.market, icon: TrendingUp },
    { to: '/soil-health', label: t.nav.soilHealth, icon: FlaskConical },
    { to: '/records', label: t.nav.records, icon: History },
  ];

  const languages: { code: LanguageKey; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  const currentRole = user?.role || 'FARMER';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 bg-clip-text text-transparent">
                  AgriVision<span className="text-emerald-400">.AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">AI-Powered Crop Advisory</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Special Role Portals */}
            {(currentRole === 'AGRONOMIST' || currentRole === 'ADMIN') && (
              <Link
                to="/agronomist/portal"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/agronomist/portal'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{t.nav.agronomistPortal}</span>
              </Link>
            )}

            {currentRole === 'ADMIN' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-purple-400/90 hover:text-purple-300 hover:bg-purple-500/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>{t.nav.adminPortal}</span>
              </Link>
            )}
          </nav>

          {/* Right Controls: Connectivity, Language, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Offline Status & Queue Indicator */}
            <div className="flex items-center">
              {isOnline ? (
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs cursor-pointer"
                  title="Cloud sync online"
                  onClick={handleSync}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <Wifi className="w-3.5 h-3.5 hidden sm:inline" />
                  {queuedCount > 0 ? (
                    <span className="font-semibold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded text-[11px]">
                      {queuedCount} {syncing ? 'Syncing...' : 'Pending'}
                    </span>
                  ) : (
                    <span className="hidden md:inline text-[11px] font-medium">Online</span>
                  )}
                </div>
              ) : (
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs"
                  title="Offline mode active. Diagnoses will queue locally."
                >
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-semibold">Offline</span>
                  {queuedCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-bold px-1.5 rounded-full text-[10px]">
                      {queuedCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 hover:border-emerald-500/50 transition-colors"
                aria-label="Language selection"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase font-semibold tracking-wider">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Language / भाषा
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === l.code 
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs hover:border-emerald-500/50 transition-colors"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                  currentRole === 'ADMIN' 
                    ? 'bg-purple-600 text-white' 
                    : currentRole === 'AGRONOMIST' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {currentRole[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-semibold text-slate-200 leading-tight">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[9px] text-slate-400 capitalize">{currentRole.toLowerCase()}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-400">{user?.email}</p>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona (RBAC)
                  </div>

                  <button
                    onClick={() => { switchRole('FARMER'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 ${
                      currentRole === 'FARMER' ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <p className="font-medium">Farmer (Ramesh Patel)</p>
                      <p className="text-[10px] text-slate-400">Diagnosis, plots & mandi rates</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchRole('AGRONOMIST'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 ${
                      currentRole === 'AGRONOMIST' ? 'bg-amber-500/15 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <div>
                      <p className="font-medium">Agronomist (Dr. Sharma)</p>
                      <p className="text-[10px] text-slate-400">Field review & verify prescriptions</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchRole('ADMIN'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 ${
                      currentRole === 'ADMIN' ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <div>
                      <p className="font-medium">Administrator</p>
                      <p className="text-[10px] text-slate-400">System health & telemetry</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-800 mt-2 pt-1">
                    <button
                      onClick={() => { logout(); setRoleDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-800"
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {(currentRole === 'AGRONOMIST' || currentRole === 'ADMIN') && (
              <Link
                to="/agronomist/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-300 hover:bg-amber-500/10"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{t.nav.agronomistPortal}</span>
              </Link>
            )}
            {currentRole === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-500/10"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>{t.nav.adminPortal}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
