/* eslint-disable @typescript-eslint/no-unused-vars */

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCIz6eck1J-l_dJzbMlSxu7quKVByTGC8s",
    authDomain: "chefcito-comidas.firebaseapp.com",
    projectId: "chefcito-comidas",
    storageBucket: "chefcito-comidas.appspot.com",
    messagingSenderId: "170744366068",
    appId: "1:170744366068:web:06ec928f713aaef4e6afa1",
    measurementId: "G-82VF25ZVYZ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        await setPersistence(auth,browserLocalPersistence)
        await signInWithPopup(auth, googleProvider);
    } catch (err) {
        console.error(err);
    }
};

const loginUserPassword = (email:string,password:string) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const createUserPassword = (email:string,password:string) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const logout = () => {
    signOut(auth);
};

const isLogIn = () => {
    return auth?.currentUser !== null
}

const getUser = () => {
    return auth?.currentUser
}

const getToken  = async () => {
    return await auth?.currentUser?.getIdToken()
}
export {
    auth,
    signInWithGoogle,
    logout,
    isLogIn,
    getUser,
    getToken,
    loginUserPassword,
    createUserPassword,
};