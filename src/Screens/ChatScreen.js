import { Alert, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useState,useEffect, useContext } from 'react'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChatScreen = ({route,navigation}) => {
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
        console.log('current user data--',documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

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
    getUser();
    console.log('login user',user);
   // getAllMessages(); // function to fetch logged in user chat with it's corresponding chat user

   // for accessing chat messages realtime
   const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;
   const messageRef = firestore().collection('chatrooms')
   .doc(docid)
   .collection('messages')
   .orderBy('createdAt','desc');

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

    // Cleanup function
    return () => {
      // Unsubscribe the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, [])

  // onSend function execute when user sent messages
  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const myMsg = {
      ...msg,
      sentBy:loggedInUserId,
      sentTo:otherUserId,
      createdAt:new Date(),
      user: {
        _id: loggedInUserId,
        avatar: userData.userImg,
      },
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    const docid = loggedInUserId > otherUserId ? otherUserId+"-"+loggedInUserId : loggedInUserId+"-"+otherUserId;

    // adding logged-in-user and it's corresponding chat user in chatrooms doc where we create a unique docId for both the users.
    firestore().collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .add({...myMsg,createdAt:firestore.FieldValue.serverTimestamp()});
  }

  // const handleIconPress = () => {
  //   Alert.alert('Function called'); 
  // };

  // const renderCustomActions = (props) => (
  //   <TouchableOpacity onPress={handleIconPress} style={styles.iconContainer}>
  //     <FontAwesome name="photo" size={25} />
  //   </TouchableOpacity>
  // );

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
       <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: loggedInUserId,
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color:'#fff',
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: 'white',
                    borderColor:'gray',
                    borderWidth:1
                  },
                  right: {
                    backgroundColor: 'blue',
                    borderColor:'gray',
                    borderWidth:1
                  },
                }}
              />
            );
          }}

          renderInputToolbar={(props)=>{
            return <InputToolbar {...props} 
              containerStyle={{borderTopWidth:1.5,borderTopColor:'blue'}}
              textInputStyle={{color:'black'}}
              // renderActions={renderCustomActions}
            />
          }}
    />
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  // iconContainer: {
  //   height: '100%',
  //   justifyContent: 'center',
  //   marginRight: -8, 
  // },
})