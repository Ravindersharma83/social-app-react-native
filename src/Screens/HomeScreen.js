import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container} from '../styles/FeedStyles';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const HomeScreen = ({navigation}) => {
  const[posts,setPosts] = useState(null);
  const[loading,setLoading] = useState(true);
  const[deleted,setDeleted] = useState(false);

  const fetchPosts = async ()=>{
    const list = [];
    try {
      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);
          querySnapshot.forEach((doc) => {
            const {userId,post,postImg,postTime,likes,comments,} = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Test Name',
              userImg:
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });
        })
        // console.log('posts',list);
        setPosts(list);
        if(loading){
          setLoading(false);
        }
    } catch (error) {
      console.log('err--',error);
    }
  }
  useEffect(()=>{
    fetchPosts();
  },[])

  useEffect(()=>{
    fetchPosts();
    setDeleted(false);
  },[deleted])

  const handleDelete = (postId) =>{
    Alert.alert(
      'Delete Post',
      'Are you sure ?',
      [
        {
          text:'Cancel',
          onPress: ()=> console.log('Cancel Pressed'),
          style:'cancel'
        },
        {
          text:'Confirm',
          onPress: ()=> deletePost(postId),
          style:'cancel'
        }
      ],
      {cancelable:false}
    )
  }

  const deletePost = (postId)=>{
    console.log(postId);
    firestore().collection('posts')
    .doc(postId)
    .get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists){
        const {postImg} = documentSnapshot.data();

        // deleting image from cloud storage if image exists
        if(postImg === null){
          deleteFirestoreData(postId);
        }
        if(postImg != null){
          const storageRef = storage().refFromURL(postImg);
          const imageRef = storage().ref(storageRef.fullPath);

          imageRef.delete().then(()=>{
            console.log(`${postImg} has been deleted successfully!.`);
            deleteFirestoreData(postId);
          })
          .catch((error)=>{
            console.log('Error while deleting image',error);
          })
        }
      }
    })
  }

  const deleteFirestoreData = (postId) => {
    firestore()
    .collection('posts')
    .doc(postId)
    .delete()
    .then(() => {
      Alert.alert(
        'Post deleted!',
        'Your post has been deleted successfully!',
      );
      setDeleted(true);
    })
    .catch((error)=> console.log('Error deleting post',error))
  }
  return (
    <View style={{flex:1}}>
    {loading ? (
      <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 60, height: 60, borderRadius: 50}} />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginBottom: 30}}>
              <View style={{width: 300, height: 20, borderRadius: 4}} />
              <View
                style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
              />
              <View
                style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
              />
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
    ) : (

    <Container>
      <FlatList
        data={posts}
        renderItem={({item})=> 
        <PostCard 
          item={item} 
          onDelete={handleDelete}
          onPress={()=>
          navigation.navigate('HomeProfile',{userId: item.userId})
          }
        
        />}
        keyExtractor={item=>item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
    )}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})





















// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useContext, useState } from 'react'
// import FormButton from '../components/FormButton'
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../navigation/AuthProvider'

// const HomeScreen = () => {
//     const {user} = useContext(AuthContext);
//     const[active,setActive] = useState(true);
//   return (
//     <View style={styles.container}>
//      <View style={styles.card}>
//         <View style={styles.userInfo}>
//             <Image source={require('../Assets/images/user-3.jpg')} style={styles.userImg}/>
//             <View style={styles.userInfoText}>
//               <Text style={styles.userName}>Jenny Doe</Text>
//               <Text style={styles.postTime}>4 hours ago</Text>
//             </View>
//         </View>
//         <Text style={styles.postText}>Hello this is a titile</Text>
//         <View style={styles.divider}></View>
//         {/* <Image source={require('../Assets/images/post-img-2.jpg')} style={styles.postImg}/> */}

//         <View style={styles.interactionWrapper}>
//           <TouchableOpacity style={[styles.interaction, active ? {backgroundColor:'#2e64e515'} : {backgroundColor:'transparent'}]}>
//             <Ionicons name="heart" size={25} color="#2e64e5" />
//             <Text style={[styles.interactionText , active ? {color:'#2e64e5'} : {color:'#333'}]}>11 Like</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.interaction}>
//             <Ionicons name="md-chatbubble-outline" size={25} />
//             <Text style={styles.interactionText}>Comment</Text>
//           </TouchableOpacity>
//         </View>

//      </View>
     
//     </View>
//   )
// }

// export default HomeScreen

// const styles = StyleSheet.create({
//   container:{
//       flex:1,
//       justifyContent:'center',
//       alignItems:'center',
//       backgroundColor:'#fff',
//       padding:20
//   },
//   card:{
//     backgroundColor:'#f8f8f8',
//     width:'100%',
//     marginBottom:20,
//     borderRadius:10
//   },
//   userInfo:{
//     flexDirection:'row',
//     justifyContent:'flex-start',
//     padding:15
//   },
//   userImg:{
//     width:50,
//     height:50,
//     borderRadius:25
//   },
//   userInfoText:{
//     flexDirection:'column',
//     justifyContent:'center'
//   },
//   userName:{
//     fontSize:14,
//     fontWeight:'bold',
//     fontFamily:'Lato-Regular'
//   },
//   postTime:{
//     fontSize:12,
//     fontFamily:'Lato-Regular',
//     color:'#666'
//   },
//   postText:{
//     fontSize:14,
//     fontFamily:'Lato-Regular',
//     paddingLeft:15,
//     paddingRight:15,
//   },
//   postImg:{
//     width:'100%',
//     height:250,
//     marginTop:15
//   },
//   interactionWrapper:{
//     flexDirection:'row',
//     justifyContent:'space-around',
//     padding:15
//   },
//   interaction:{
//     flexDirection:'row',
//     justifyContent:'center',
//     borderRadius:5,
//     paddingVertical:2,
//     paddingHorizontal:5
//   },
//   interactionText:{
//     fontSize:12,
//     fontFamily:'Lato-Regular',
//     fontWeight:'bold',
//     marginTop:5,
//     marginLeft:5
//   },
//   divider:{
//     borderBottomColor:'#dddddd',
//     borderBottomWidth:1,
//     width:'92%',
//     alignSelf:'center',
//     marginTop:15

//   }
// })