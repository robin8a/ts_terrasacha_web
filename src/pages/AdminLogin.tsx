import { FormEvent, useState } from 'react';

type AdminLoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  requireNewPassword?: boolean;
  onConfirmNewPassword?: (newPassword: string) => Promise<void>;
};

const AdminLogin = ({
  onLogin,
  requireNewPassword = false,
  onConfirmNewPassword,
}: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    console.log('[AdminLogin] Submit, email:', email);
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      console.log('[AdminLogin] Llamando onLogin (irá a Cognito signIn)...');
      await onLogin(email, password);
      console.log('[AdminLogin] onLogin OK');
    } catch (err) {
      console.log('[AdminLogin] onLogin error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo iniciar sesión. Revisa tus datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    if (!onConfirmNewPassword) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onConfirmNewPassword(newPassword);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al cambiar la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0 bg-secondary-bosques-nublados">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
          aria-hidden
        >
          <source src="/assets/videos/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 video-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        {requireNewPassword ? (
          <>
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-900">
              Nueva contraseña
            </h1>
            <p className="mb-6 text-center text-sm text-gray-600">
              Es la primera vez que inicias sesión. Elige una contraseña nueva para tu cuenta.
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPasswordConfirm" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <input
                  id="newPasswordConfirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={newPasswordConfirm}
                  onChange={(event) => setNewPasswordConfirm(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Cambiar contraseña y entrar'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-center text-2xl font-semibold text-gray-900">
              Panel administrador
            </h1>
            <p className="mb-6 text-center text-sm text-gray-600">
              Inicia sesión con tu usuario administrador para gestionar el contenido.
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

