import React, { FC } from "react";
import { motion, useAnimation } from "framer-motion";
import { friendlyAuthError } from "../../utils/friendlyAuthError";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
  const [shake, setShake] = React.useState(false);
  const shakeControls = useAnimation();

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
      const msg = friendlyAuthError(err, mode === 'signin' ? 'sign_in' : 'sign_up');
      setError(msg);
      toast.error(mode === 'signin' ? 'Sign in failed' : 'Sign up failed', { description: msg });
      setShake(true);
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0] }, { type: 'tween', duration: 0.45 });
      setTimeout(() => setShake(false), 600);
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
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogOverlay />
      <DialogContent className="px-8 py-6">
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div animate={shakeControls} className="w-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200 focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h3>
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                className={`${error ? 'border-red-500/50 animate-inputPulse' : ''}`}
                aria-invalid={Boolean(error)}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                className={`${error ? 'border-red-500/50 animate-inputPulse' : ''}`}
                aria-invalid={Boolean(error)}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button type="submit" disabled={loading} className={`${loading ? 'animate-pulse cursor-wait' : ''} w-full`}>
                  {loading ? (mode === 'signin' ? "Signing In..." : "Signing Up...") : (mode === 'signin' ? "Sign In" : "Sign Up")}
                </Button>
              </motion.div>
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
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
