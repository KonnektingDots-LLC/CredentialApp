import { create } from 'zustand'

type AuthStore = {
   currentUser: any;
   isLoggedIn: boolean;
   changeCurrentUser:(input:any)=>void;
   changeIsLoggedIn:(input:boolean)=>void;
  }

const useAuthStore = create<AuthStore>((set) => ({
 currentUser:{},
 isLoggedIn:false,
 changeIsLoggedIn:(input:boolean)=>set(()=>({isLoggedIn:input})),
 changeCurrentUser:(input:any)=>set(()=>({currentUser:input}))
}))

export default useAuthStore;