import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState , useRef, useContext, useEffect} from 'react'
import Message from './Message'
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import ChatInput from './ChatInput';


const MessageList = ({route,navigation}) => {
  // const[messages,setMessages] = useState([
  //   {
  //     user:0,
  //     time:'12:00',
  //     content:'Hey'
  //   },
  //   {
  //     user:1,
  //     time:'12:05',
  //     content:'what is up ?'
  //   },
  //   {
  //     user:1,
  //     time:'12:07',
  //     content:'How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?'
  //   },
  //   {
  //     user:0,
  //     time:'12:08',
  //     content:'Things are going great'
  //   },
  //   {
  //     user:0,
  //     time:'12:10',
  //     content:'What from your side ?'
  //   },
  //   {
  //     user:0,
  //     time:'12:00',
  //     content:'How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?How it is going ?'
  //   },
  //   {
  //     user:1,
  //     time:'12:05',
  //     content:'what is up ?'
  //   },
  //   {
  //     user:1,
  //     time:'12:07',
  //     content:'How it is going ?'
  //   },
  //   {
  //     user:0,
  //     time:'12:08',
  //     content:'Things are going great'
  //   },
  //   {
  //     user:0,
  //     time:'12:10',
  //     content:'What from your side ?'
  //   },
  // ])
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);

  const getUser = async ()=>{
    await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot)=>{
      if(documentSnapshot.exists){
        // console.log('current user data--',documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  const loggedInUserId = user.uid;
  const otherUserId = route.params.chatUser.uid

  useEffect(() => {
    getUser();
    // console.log('login user',loggedInUserId);
    // console.log('other user',otherUserId);
    // return;

   // for accessing chat messages realtime
   const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;
   const messageRef = firestore().collection('chatrooms')
   .doc(docid)
   .collection('messages')
   .orderBy('createdAt','asc');

   const unsubscribe = messageRef.onSnapshot((querySnap)=>{
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
    return () => {
      unsubscribe();
    };
  }, [])

  // scroll to top
  const User = useRef(0);
  const scrollView = useRef();
  return (
    <>
    <ScrollView 
      style={{backgroundColor:'#fff'}} 
      // for auto scrolling to top in scrollview
      ref={ref => scrollView.current = ref}
      onContentSizeChange={()=>{
        scrollView.current.scrollToEnd({animated:true})
      }}
    >
     {messages.map((message,index)=>(
      <Message key={index} sentBy={message?.sentBy} time={message?.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toString()} message={message?.text} msgType={message.msgType}/>
     ))}
    </ScrollView>
     <ChatInput loggedInUserId={loggedInUserId} otherUserId={otherUserId} docId={loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId}/>
     </>
  )
}

export default MessageList

const styles = StyleSheet.create({})