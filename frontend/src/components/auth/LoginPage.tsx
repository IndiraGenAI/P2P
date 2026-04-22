import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { loginUser } from '@/state/auth/auth.action';
import { authSelector, clearAuthMessage } from '@/state/auth/auth.reducer';

interface LoginPageProps {
  onLogin: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
  const dispatch = useAppDispatch();
  const { login } = useAppSelector(authSelector);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Surface backend error messages as toasts (mirrors the per-slice useEffect
  // pattern used by RolesPage / UsersPage).
  useEffect(() => {
    if (login.message) {
      if (login.hasErrors) {
        message.error(login.message);
      } else {
        message.success(login.message);
      }
      dispatch(clearAuthMessage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login.message]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Email is required.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }
    setFormError(null);

    const result = await dispatch(
      loginUser({ email: trimmedEmail, password }),
    );
    if (loginUser.fulfilled.match(result)) {
      onLogin();
    }
  };

  const isSubmitting = login.loading;

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-10">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Enter your email and password to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Keep me logged in
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-transparent p-0"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>

            <p className="text-sm text-gray-500 text-center">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: '#101828' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-px h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="light" />
          </div>
          <p className="text-gray-400 max-w-xs mx-auto">
            Streamline your <span className="text-emerald-300 font-medium">Procure-to-Pay</span>{' '}
            process — from purchase request to payment, all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
