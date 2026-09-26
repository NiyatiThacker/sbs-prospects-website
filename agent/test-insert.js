import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qewwumxaxznuxlkwdvpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('screentime_raw_logs').insert({
    employee_id: 'emp-123', // dummy
    process_name: 'Break',
    window_title: 'On Break',
    duration_seconds: 30,
    timestamp: new Date().toISOString(),
    status: 'on_break'
  });
  console.log("Insert result:", { data, error });
}
testInsert();
