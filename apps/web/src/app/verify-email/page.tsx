'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token ausente.');
        return;
      }
      setStatus('loading');
      try {
        const resp = await apiService.verifyEmailToken(token);
        if (!mounted) return;
        if (resp.success) {
          setStatus('success');
          setMessage(resp.message || 'Email verificado correctamente');
        } else {
          setStatus('error');
          setMessage(resp.message || 'Error verificando el email');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error de conexión');
      }
    };

    verify();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">Verificando tu correo...</h2>
            <p className="text-sm text-gray-500">Por favor espera un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Email verificado!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button onClick={() => router.push('/login')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Ir a Login</button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No se pudo verificar</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push('/login')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Ir a Login</button>
              <button onClick={() => router.push('/account')} className="px-6 py-3 border border-gray-300 rounded-lg">Ir a Perfil</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
