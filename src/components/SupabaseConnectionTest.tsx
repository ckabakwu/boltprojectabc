import { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../lib/supabase';
import toast from 'react-hot-toast';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const testConnection = async () => {
      const result = await checkSupabaseConnection();
      if (result.status === 'connected') {
        setConnectionStatus('connected');
        toast.success('Connected to Supabase successfully');
      } else {
        setConnectionStatus('error');
        toast.error(`Supabase connection error: ${result.error}`);
      }
    };

    testConnection();
  }, []);

  return null; // This component doesn't render anything
};

export default SupabaseConnectionTest;