// Em src/@types/express.d.ts
import { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    export interface Request {
      user: User; // Define que o Request terá um objeto user do tipo do Supabase
    }
  }
}