import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Store, Mail, Lock, ArrowRight, UserCircle2, Check, Database } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [showSavedAccount, setShowSavedAccount] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check local storage for saved credentials on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    if (storedEmail) {
      setSavedEmail(storedEmail);
      setEmail(storedEmail);
      if (storedPassword) {
        setPassword(storedPassword);
      }
      setShowSavedAccount(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      // Handle "Remember Me" local storage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      navigate('/');
    } else {
      setError('Invalid credentials. Use password "admin".');
    }
  };

  const handleUseAnotherAccount = () => {
    setShowSavedAccount(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Image & Branding (Hidden on smaller screens, visible on lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-orange-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-900/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop"
          alt="Delicious burger"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 xl:px-24 text-white">
          <div className="flex items-center gap-3 mb-10 animate-fade-in-up">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">FoodieExpress</h1>
          </div>
          <h2 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
            Manage your <br />
            restaurant <span className="text-orange-300">with ease.</span>
          </h2>
          <p className="text-lg xl:text-xl text-orange-100 max-w-md leading-relaxed">
            The all-in-one dashboard for tracking orders, managing staff, and growing your culinary business.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-orange-200">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-orange-600 bg-orange-300 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p>Join 2,000+ restaurant owners</p>
          </div>
        </div>
      </div>

      {/* Right side - Form Area */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white lg:bg-transparent relative">
        {/* Mobile background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-50 to-white lg:hidden -z-10" />
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-xl lg:shadow-none border border-gray-100 lg:border-none relative z-10">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-orange-100 rounded-2xl mb-4 shadow-sm">
              <Store className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FoodieExpress</h1>
            <p className="text-sm text-gray-500 mt-2">Sign in to manage your restaurant</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500">
              Please enter your details to sign in to your dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Saved Account View (Local Storage Demo) */}
            {showSavedAccount && savedEmail ? (
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Database className="w-16 h-16 text-orange-600" />
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-20 h-20 bg-white border-4 border-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                    {savedEmail.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-1">{savedEmail}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-100/80 px-3 py-1.5 rounded-full mt-2 border border-orange-200">
                    <Database className="w-3.5 h-3.5" />
                    <span>Data loaded from Local Storage</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleUseAnotherAccount}
                    className="text-sm font-medium text-gray-500 hover:text-orange-600 mt-5 transition-colors underline underline-offset-4"
                  >
                    Sign in with another account
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Email Input */
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Password Input (Hidden if using saved account) */}
            {!showSavedAccount && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all bg-gray-50 focus:bg-white"
                    placeholder="Enter 'admin'"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {!showSavedAccount && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me on this device (saves to local storage)
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="p-1 bg-red-100 rounded-full">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-red-700 text-sm font-medium mt-0.5">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full py-6 text-base rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 group"
            >
              <span>{showSavedAccount ? 'Continue as ' + savedEmail : 'Sign in to Dashboard'}</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
                Contact support
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Temporary X icon component since it wasn't imported from lucide-react in the original
function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
