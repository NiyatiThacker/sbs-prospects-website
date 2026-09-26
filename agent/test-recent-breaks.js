import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qewwumxaxznuxlkwdvpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: raw } = await supabase.from('screentime_raw_logs')
    .select('timestamp, process_name, window_title, employee_id')
    .eq('window_title', 'On Break')
    .order('timestamp', { ascending: false })
    .limit(5);
  console.log("Recent On Break logs:", JSON.stringify(raw, null, 2));
}
testFetch();
