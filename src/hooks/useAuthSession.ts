"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

export function useAuthSession() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setIsAuthenticated(!!data.session);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    init();
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { loading, isAuthenticated };
}
