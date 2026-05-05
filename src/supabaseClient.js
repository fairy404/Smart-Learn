import { createClient } from "@supabase/supabase-js";

// استخدام Environment Variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// إنشاء الاتصال
export const supabase = createClient(supabaseUrl, supabaseKey);