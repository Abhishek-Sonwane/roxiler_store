import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_API
// );

const SUPABASE_URL = "https://nmpmfvjyvhhqcgmvzyft.supabase.co";
const SUPABASE_API =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcG1mdmp5dmhocWNnbXZ6eWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjIxMDksImV4cCI6MjA2MDg5ODEwOX0.7ybSfxQ1nvTWU0tLYmfL9x5C3v85LY2mg0wy2bK_6n4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API);
