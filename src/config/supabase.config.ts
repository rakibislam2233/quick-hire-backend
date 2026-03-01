import { createClient } from '@supabase/supabase-js';
import config from './index';

// Supabase client configuration
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Warning: Supabase credentials not configured. Some features may not work.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return false;
    }

    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);

    // Table doesn't exist is expected, connection error is not
    if (
      error &&
      !error.message.includes('does not exist') &&
      !error.message.includes('Could not find the table')
    ) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

export default supabase;
