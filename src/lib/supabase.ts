import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://unxuqudjptvcorprupos.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueHVxdWRqcHR2Y29ycHJ1cG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTY1NDAsImV4cCI6MjA5OTIzMjU0MH0.TzsgJLMozl0I0F9bjo3xcqEUK849C2194X_tlpkA6h8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
