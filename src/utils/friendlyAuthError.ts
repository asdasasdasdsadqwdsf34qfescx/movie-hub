export type AuthContext = "sign_in" | "sign_up" | "reset_password" | "generic";

interface SupabaseErrorLike {
  message?: string;
  status?: number;
  name?: string;
}

function normalize(msg?: string) {
  return (msg || "").toLowerCase();
}

export function friendlyAuthError(err: unknown, ctx: AuthContext = "generic"): string {
  const e = (err as SupabaseErrorLike) || {};
  const msg = normalize(e.message);
  const status = e.status;

  // Network issues
  if (msg.includes("failed to fetch") || e.name === "TypeError") {
    return "Network error. Please check your connection and try again.";
  }

  // Rate limiting / throttling
  if (status === 429 || msg.includes("too many requests") || msg.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Invalid credentials
  if (status === 400 || msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again or reset your password.";
  }

  // Email not confirmed
  if (msg.includes("email not confirmed") || msg.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }

  // Weak password
  if (status === 422 || msg.includes("password should be at least") || msg.includes("weak password") || msg.includes("password too short")) {
    return "Password is too weak. Use at least 8 characters, including letters and numbers.";
  }

  // Invalid email format
  if (msg.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  // Duplicate user on sign up
  if (ctx === "sign_up" && (msg.includes("user already registered") || msg.includes("already registered") || msg.includes("already exists"))) {
    return "This email is already registered. Try signing in or use a different email.";
  }

  // Unauthorized / expired session
  if (status === 401 || msg.includes("unauthorized")) {
    return "Your session has expired. Please sign in again.";
  }

  // Default
  switch (ctx) {
    case "sign_in":
      return "We couldn't sign you in. Please try again in a moment.";
    case "sign_up":
      return "We couldn't create your account. Please try again.";
    case "reset_password":
      return "We couldn't process your request. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
