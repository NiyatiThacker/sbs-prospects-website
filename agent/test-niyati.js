import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qewwumxaxznuxlkwdvpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: emps } = await supabase.from('employees').select('id, name');
  const niyati = emps.find(e => e.name.toLowerCase().includes('niyati'));
  
  if (!niyati) {
    console.log("Niyati not found");
    return;
  }
  
  const { data: att } = await supabase.from('attendance_records').select('*').eq('employee_id', niyati.id).order('date', { ascending: false }).limit(3);
  console.log("Attendance:", JSON.stringify(att, null, 2));
  
  const { data: sum } = await supabase.from('screentime_daily_summary').select('*').eq('employee_id', niyati.id).order('date', { ascending: false }).limit(3);
  console.log("Summaries:", JSON.stringify(sum, null, 2));
}
testFetch();
