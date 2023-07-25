import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React,{useState,useEffect, useContext} from 'react'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../navigation/AuthProvider';

const MessagesScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [users,setUsers] = useState(null);
  const getUsers = async () =>{
    const querySnap = await firestore().collection(`users`).where('uid','!=',user.uid).get()
    const allusers = querySnap.docs.map(docSnap => docSnap.data())
    console.log('allusers----',allusers);
    setUsers(allusers);
  }

  useEffect(()=>{
    getUsers()
    console.log('current user',user.uid);
  },[])

  const RenderCard = ({item})=>{
    return(
      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{name:item.fname,chatUser:item})}>
      <View style={styles.myCard}>
        {item.userImg ? (<Image source={{uri:item.userImg}} style={styles.img}/>) : (<Image source={require("../Assets/images/user.png")} style={styles.img}/>)}
        <View>
          <Text style={styles.text}>
            {item.fname ? item.fname : 'Test User'}
          </Text>
          <Text style={styles.text}>
            {item.email}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    )
  }
  return (
    <View>
      <FlatList
        data={users}
        renderItem={({item})=><RenderCard item={item}/>}
        keyExtractor={(item)=>item.uid}
      />
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