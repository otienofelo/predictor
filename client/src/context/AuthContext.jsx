import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
  
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();

const googleSignIn = () => {
  return signInWithPopup(auth, googleProvider);
};


  // Logout
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    googleSignIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};