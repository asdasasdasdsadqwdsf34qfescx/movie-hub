import React, { FC } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

const AuthModal: FC<AuthModalProps> = ({ open, onClose, onSignIn, onSignUp }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signin') {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || (mode === 'signin' ? "Authentication failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold text-white mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h3>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (mode === 'signin' ? "Signing In..." : "Signing Up...") : (mode === 'signin' ? "Sign In" : "Sign Up")}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'signin' ? (
            <span className="text-gray-400">Don't have an account?{' '}
              <button className="text-blue-400 hover:underline" onClick={toggleMode} type="button">Sign Up</button>
            </span>
          ) : (
            <span className="text-gray-400">Already have an account?{' '}
              <button className="text-blue-400 hover:underline" onClick={toggleMode} type="button">Sign In</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
