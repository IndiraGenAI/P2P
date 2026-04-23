import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { registerUser } from '@/state/auth/auth.action';
import { authSelector, clearAuthMessage } from '@/state/auth/auth.reducer';

interface RegisterPageProps {
  onRegister: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{6,20}$/;

export function RegisterPage({ onRegister }: Readonly<RegisterPageProps>) {
  const dispatch = useAppDispatch();
  const { register } = useAppSelector(authSelector);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    const trimmed = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (!trimmed.first_name) return setFormError('First name is required.');
    if (!trimmed.last_name) return setFormError('Last name is required.');
    if (!trimmed.email) return setFormError('Email is required.');
    if (!EMAIL_REGEX.test(trimmed.email))
      return setFormError('Please enter a valid email address.');
    if (trimmed.phone && !PHONE_REGEX.test(trimmed.phone))
      return setFormError('Please enter a valid phone number.');
    if (!password) return setFormError('Password is required.');
    if (password.length < 6)
      return setFormError('Password must be at least 6 characters.');
    if (password !== confirmPassword)
      return setFormError('Passwords do not match.');
    setFormError(null);

    const result = await dispatch(
      registerUser({
        first_name: trimmed.first_name,
        last_name: trimmed.last_name,
        email: trimmed.email,
        phone: trimmed.phone || undefined,
        password,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      message.success(result.payload.message || 'Registration successful');
      dispatch(clearAuthMessage());
      onRegister();
    } else {
      message.error(
        result.error?.message || 'Registration failed. Please try again.',
      );
      dispatch(clearAuthMessage());
    }
  };

  const isSubmitting = register.loading;

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-10">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-500 mb-8">
            Sign up to start managing your Procure-to-Pay flow.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reg-first"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First name<span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-first"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Aisha"
                  autoComplete="given-name"
                  className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="reg-last"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last name<span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-last"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Khan"
                  autoComplete="family-name"
                  className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="reg-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 90000 00000"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password<span className="text-red-500">*</span>
              </label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 soft-input text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign In
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
        <div className="relative z-10 text-center px-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="light" />
          </div>
          <p className="text-gray-400 max-w-xs mx-auto">
            Welcome to{' '}
            <span className="text-emerald-300 font-medium">P2P-ORG</span>. Create
            your account and start streamlining your procurement workflow today.
          </p>
        </div>
      </div>
    </div>
  );
}
