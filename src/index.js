import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://kgpwsdqqjwcsrflxmslk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncHdzZHFxandjc3JmbHhtc2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0NzU4ODMsImV4cCI6MjAxODA1MTg4M30.IOY03cvBYnNeTYWBfbAMGuJ4gcHtUoHk5a2RCr8dODA" 
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);


reportWebVitals();