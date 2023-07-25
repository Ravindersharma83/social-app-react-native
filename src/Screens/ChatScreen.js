import { StyleSheet, Text, View } from 'react-native'
import React, { useState,useEffect, useContext } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore'

const ChatScreen = ({route,navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  const loggedInUserId = user.uid;
  const otherUserId = route.params.chatUser.uid

  // const getAllMessages = async () =>{
  //   const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;
  //   const querySnap = await firestore().collection('chatrooms')
  //   .doc(docid)
  //   .collection('messages')
  //   .orderBy('createdAt','desc')
  //   .get()

  //   const allMsg = querySnap.docs.map(docSnap=>{
  //     return {
  //       ...docSnap.data(),
  //       createdAt:docSnap.data().createdAt.toDate()
  //     }
  //   })

  //   setMessages(allMsg);
  // }

  useEffect(() => {
   // getAllMessages(); // function to fetch logged in user chat with it's corresponding chat user

   // for accessing chat messages realtime
   const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;
   const messageRef = firestore().collection('chatrooms')
   .doc(docid)
   .collection('messages')
   .orderBy('createdAt','desc');

   messageRef.onSnapshot((querySnap)=>{
     const allMsg = querySnap.docs.map(docSnap=>{
      const data = docSnap.data();
      if(data.createdAt){
        return {
          ...docSnap.data(),
          createdAt:docSnap.data().createdAt.toDate()
        }
      }else{
        return {
          ...docSnap.data(),
          createdAt:new Date()
        }
      }
     })
     setMessages(allMsg);
   })
  }, [])

  // onSend function execute when user sent messages
  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const myMsg = {
      ...msg,
      sentBy:loggedInUserId,
      sentTo:otherUserId,
      createdAt:new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;

    // adding logged-in-user and it's corresponding chat user in chatrooms doc where we create a unique docId for both the users.
    firestore().collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .add({...myMsg,createdAt:firestore.FieldValue.serverTimestamp()});
  }

  return (
    <View style={{flex:1}}>
       <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: loggedInUserId,
      }}
    />
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})