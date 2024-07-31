import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { auth } from "../api/googleAuth";

type GetUserActions = {
  initializing:boolean,
  user:User|null
}
export const GetUser = ():GetUserActions => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User|null>(null);
    const onAuthStateChanged  = async (user:User|null) => {
      setInitializing(false);
      if(user) {
        setUser(user);
        const token = await user.getIdToken()
        console.log('token',token)
      }
    }
  
    useEffect(()=>{
      auth.authStateReady().then(()=>{
        console.log(auth.currentUser)
        onAuthStateChanged(auth.currentUser)
    });
    },[])

    return {
      initializing,
      user,
    }
}