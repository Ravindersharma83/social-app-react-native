import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, AppState } from 'react-native'
import React,{useState,useEffect, useContext} from 'react'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../navigation/AuthProvider';

const MessagesScreen = ({navigation}) => {
  // const [appState, setAppState] = useState(AppState.currentState);
  const {user, logout} = useContext(AuthContext);
  const [users,setUsers] = useState(null);
  const[loading,setLoading] = useState(false);

  const getUsers = async () =>{
    setLoading(true);
    const querySnap = await firestore().collection(`users`).where('uid','!=',user.uid).get()
    const allusers = querySnap.docs.map(docSnap => docSnap.data())
    console.log('allusers----',allusers);
    setUsers(allusers);
    setLoading(false);
  }

  // useEffect(() => {
    // AppState API to check whether your app is in the foreground (open) or in the background (closed or inactive). The AppState API provides a way to access the current state of the app.

  //   const handleAppStateChange = (nextAppState) => {
  //     setAppState(nextAppState);
  //   };

  //   AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  useEffect(()=>{
    getUsers()
    console.log('current user',user.uid);
  },[])

  const LastMessage = ({docid}) => {
    const[lastMsg,setLastMsg] = useState([]);

    const getAllMessages = async () =>{
      // this can also be implemented by snapshot query method , but write now i faces lacking issue in my device with that code that's why i use this method.
      const querySnap = await firestore().collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt','desc').limit(1)
      .get()
  
      const allMsg = querySnap.docs.map(docSnap=>{
        return {
          ...docSnap.data(),
          createdAt:docSnap.data().createdAt.toDate()
        }
      })
      console.log(allMsg[0].text);
      setLastMsg(allMsg);
    }
    useEffect(()=>{
      // getAllMessages();
    const messageRef = firestore().collection('chatrooms')
   .doc(docid)
   .collection('messages')
   .orderBy('createdAt','desc').limit(1);

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
     setLastMsg(allMsg);
   })

     // Cleanup function
    return () => {
      // Unsubscribe the snapshot listener when the component unmounts
      unsubscribe();
    };
      
    },[])

    return(
      lastMsg.map((item,index)=>{
        return(
          <Text style={styles.text} key={index}>{item.text}</Text>
        )
      })
    )
  }

  const RenderCard = ({item})=>{
    return(

      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{name:item.fname,chatUser:item,status: item.isLoggedIn ? 'Online' : 'Offline' })}>
      <View style={styles.myCard}>
        {item.userImg ? (<Image source={{uri:item.userImg}} style={styles.img}/>) : (<Image source={require("../Assets/images/user.png")} style={styles.img}/>)}
        <View>
          <Text style={styles.text}>
            {item.fname ? item.fname : 'Test User'}
          </Text>
          {/* <Text style={styles.text}>
            {item.email}
          </Text> */}
          <LastMessage docid={user.uid > item.uid ? item.uid+"-"+user.uid : user.uid+"-"+item.uid}/>
        </View>
      </View>
      </TouchableOpacity>
    )
  }
  return (
    <View>
    <RefreshControl
        refreshing={loading}
        onRefresh={()=>{
          getUsers();
        }}
    >
      <FlatList
        data={users}
        renderItem={({item})=><RenderCard item={item}/>}
        keyExtractor={(item)=>item.uid}
      />
      </RefreshControl>
    </View>
  )
}

export default MessagesScreen

const styles = StyleSheet.create({
  img:{height:60,width:60,borderRadius:30,backgroundColor:'pink'},
  myCard:{
    flexDirection:'row',
    margin:3,
    padding:4,
    backgroundColor:'white',
    elevation:2,
    borderBottomWidth:1,
    borderBottomColor:'gray'
  },
  text:{
    fontSize:18,
    marginLeft:15
  }
})