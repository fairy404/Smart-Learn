import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ljqrgoaeulvryebmyuvd.supabase.co";
const supabaseKey = "sb_publishable_vptHc_Ct_DO1QoKs8Q_wXw_P25brMFP";

export const supabase = createClient(supabaseUrl, supabaseKey);