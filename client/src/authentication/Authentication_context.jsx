import { createContext } from "react";

export const Authentication_context = createContext({
  isAuthorized: false,
  is_admin: false, 
  user_name:''
});
