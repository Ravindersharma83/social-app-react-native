import React, { createContext, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
                        await auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                          //Once the user creation has happened successfully, we can add the currentUser into firestore
                          //with the appropriate details.
                          // Get the current user UID
                          const currentUserUid = auth().currentUser.uid;
                          firestore().collection('users').doc(currentUserUid)
                          .set({
                              fname: '',
                              lname: '',
                              email: email,
                              createdAt: firestore.Timestamp.fromDate(new Date()),
                              userImg: null,
                              uid:currentUserUid
                          })
                          //ensure we catch any errors at this stage to advise us if something does go wrong
                          .catch(error => {
                              console.log('Something went wrong with added user to firestore: ', error);
                          })
                        })
                        //we need to catch the whole sign up process if it fails too.
                        .catch(error => {
                            console.log('Something went wrong with sign up: ', error);
                        });
                      } catch (e) {
                        console.log(e);
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
