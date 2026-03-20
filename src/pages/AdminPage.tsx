import { useCallback, useEffect, useState } from 'react';
import { signIn, getCurrentUser, signOut, confirmSignIn } from 'aws-amplify/auth';
import AdminLogin from './AdminLogin';
import AdminShellLayout from '../components/admin/AdminShellLayout';

export type AdminUser = {
  username: string;
  attributes?: {
    email?: string;
  };
};

const AdminPage = () => {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const [requireNewPassword, setRequireNewPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkUser = async () => {
      try {
        const current = await getCurrentUser();
        const currentUser: AdminUser = {
          username: current.username,
          attributes: { email: current.signInDetails?.loginId ?? current.username },
        };
        if (!cancelled) setUser(currentUser);
      } catch (err) {
        if (!cancelled) setUser(null);
      }
    };
    void checkUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });

    if (!isSignedIn) {
      const step = typeof nextStep === 'string' ? nextStep : nextStep?.signInStep;
      if (step === 'CONFIRM_SIGN_UP') {
        throw new Error('Debes confirmar tu cuenta. Revisa el correo de verificación.');
      }
      if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setRequireNewPassword(true);
        return;
      }
      throw new Error('Inicio de sesión incompleto. Contacta al administrador.');
    }

    const current = await getCurrentUser();
    const currentUser: AdminUser = {
      username: current.username,
      attributes: { email: current.signInDetails?.loginId ?? current.username },
    };
    setUser(currentUser);
  }, []);

  const handleConfirmNewPassword = useCallback(async (newPassword: string) => {
    await confirmSignIn({ challengeResponse: newPassword });
    setRequireNewPassword(false);
    const current = await getCurrentUser();
    const currentUser: AdminUser = {
      username: current.username,
      attributes: { email: current.signInDetails?.loginId ?? current.username },
    };
    setUser(currentUser);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setRequireNewPassword(false);
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  if (user === null) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        requireNewPassword={requireNewPassword}
        onConfirmNewPassword={handleConfirmNewPassword}
      />
    );
  }

  return <AdminShellLayout user={user} onSignOut={handleSignOut} />;
};

export default AdminPage;
