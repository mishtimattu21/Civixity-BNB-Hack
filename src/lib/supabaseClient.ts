import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xehqydqnqzxbspsxwdff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaHF5ZHFucXp4YnNwc3h3ZGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzE5NjYsImV4cCI6MjA2ODM0Nzk2Nn0._QXZDYRcuPS4-e08WuMxvhFMbsnrwNDgSC8fdhhgczY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);