// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://klrywwmpzrykxvwsecin.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtscnl3d21wenJ5a3h2d3NlY2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NTMxMDAsImV4cCI6MjA1MTAyOTEwMH0.St3dAH8MkSwFBlL6xxcDsBuDeuOQ7H5mPWlInc9u-7o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);