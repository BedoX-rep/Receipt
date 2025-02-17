import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmwlhwlggqmupaddzbgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd2xod2xnZ3FtdXBhZGR6YmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkzMDQsImV4cCI6MjA1NDk1NTMwNH0.yPIKPoaasFlI3Pe4mcZLX1l3WOc6e_b1mffRKV9J3mQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;