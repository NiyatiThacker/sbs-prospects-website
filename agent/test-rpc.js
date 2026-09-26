import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qewwumxaxznuxlkwdvpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  const { data, error } = await supabase.rpc('log_screentime', {
    p_employee_id: '23067bbf-cb27-4c5d-9b86-8ec9efc0c62f', // niyati
    p_process_name: 'Break',
    p_window_title: 'On Break',
    p_duration_seconds: 30
  });
  console.log("RPC result:", { data, error });
}
testRpc();
