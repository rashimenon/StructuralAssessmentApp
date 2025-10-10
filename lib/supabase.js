// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://qctpmwuszenaajckqhlm.supabase.co'; // <- replace
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdHBtd3VzemVuYWFqY2txaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTk1MjUsImV4cCI6MjA3NTU3NTUyNX0.rTzFqoWxBpdPv6zbT6YLK36u5SIexJvb1kOYdxgqbSs'; // <- replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
