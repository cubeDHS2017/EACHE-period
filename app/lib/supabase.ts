import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asvyqpcheguhseuneoqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdnlxcGNoZWd1aHNldW5lb3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTI0MDUsImV4cCI6MjA2MTc4ODQwNX0._wz_X7KqVz3gayjAz-R2byVUu6awopEFEVqtardDSWE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { enabled: false },
});

