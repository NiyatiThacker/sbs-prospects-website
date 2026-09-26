import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qewwumxaxznuxlkwdvpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: att } = await supabase.from('attendance_records').select('*').eq('employee_id', '23067bbf-cb27-4c5d-9b86-8ec9efc0c62f').eq('date', '2026-09-25');
  console.log("Attendance for today:", JSON.stringify(att, null, 2));
}
testFetch();
