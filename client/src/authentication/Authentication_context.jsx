import { createContext } from "react";
// actually we don't need to set default values here but to get an auto completion from vs code we add the default values
export const Authentication_context = createContext({
  isAuthorized: false,
  is_admin: false, 
  user_name:'',
  is_logged_in:()=>{},
  handle_log_in:()=>{},
});
