import React, { createContext, useState } from "react";
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async(email,password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email,password)
                    } catch (error) {
                        alert(error);
                    }
                },
                register: async(email,password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email,password);
                    } catch (error) {
                        alert(e);
                    }
                },
                logout: async() => {
                    try {
                        await auth().signOut();
                    } catch (error) {
                        alert(error);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}