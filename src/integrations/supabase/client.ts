// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jgqsklvisewfmqgpztaf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncXNrbHZpc2V3Zm1xZ3B6dGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzA1MTIsImV4cCI6MjA1ODEwNjUxMn0.wNX86YVgA1wUoGNG999L3ohfaBoAL02Zezhxpuzb5XI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);