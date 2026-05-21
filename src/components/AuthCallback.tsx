import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized.');
        }

        // Supabase verification redirect contains access_token in the URL hash fragment:
        // format: #access_token=...&refresh_token=...&expires_in=...&token_type=bearer&type=signup
        const hash = window.location.hash || '';
        const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash);
        
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const error_description = params.get('error_description');

        if (error_description) {
          throw new Error(error_description.replace(/\+/g, ' '));
        }

        if (!access_token) {
          // Fallback: check query parameters if hash wasn't processed or was stripped
          const searchParams = new URLSearchParams(window.location.search);
          const queryAccessToken = searchParams.get('access_token');
          const queryRefreshToken = searchParams.get('refresh_token');
          const queryError = searchParams.get('error_description');

          if (queryError) {
            throw new Error(queryError.replace(/\+/g, ' '));
          }

          if (queryAccessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: queryAccessToken,
              refresh_token: queryRefreshToken || '',
            });
            if (error) throw error;
            toast.success('Email verified successfully!');
            navigate('/dashboard');
            return;
          }

          throw new Error('Verification details are missing in URL fragment.');
        }

        // Complete the session exchange with the fetched token
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || '',
        });

        if (error) throw error;

        toast.success('Email verified successfully!');
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Session exchange error:', err);
        const errMsg = err?.message || 'Email verification link expired or is invalid.';
        setErrorStatus(errMsg);
        navigate('/login', { state: { error: errMsg } });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 text-neutral-900" id="auth-callback-container">
      <div className="max-w-md w-full text-center space-y-6" id="auth-callback-card">
        <h1 className="text-3xl font-bold font-serif mb-2 text-neutral-900 italic" id="auth-callback-title">Russian Scholar</h1>
        <div className="flex flex-col items-center justify-center gap-4" id="auth-callback-status-wrapper">
          {!errorStatus ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" id="auth-callback-spinner"></div>
              <p className="text-neutral-500 text-sm font-light" id="auth-callback-text">Verifying your email and routing you to dashboard...</p>
            </>
          ) : (
            <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 w-full text-sm font-light shadow-sm" id="auth-callback-error-box">
              <p className="font-semibold mb-1">Verification Failed</p>
              <p>{errorStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
