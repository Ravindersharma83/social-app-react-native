import { StyleSheet, Text, View,TouchableOpacity,Appearance } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'
import {
    Container,
    Card,
    UserInfo,
    UserImg,
    UserName,
    UserInfoText,
    PostTime,
    PostText,
    PostImg,
    InteractionWrapper,
    Interaction,
    InteractionText,
    Divider,
  } from '../styles/FeedStyles';
import { AuthContext } from '../navigation/AuthProvider';
import moment from 'moment';
import ProgressiveImage from './ProgressiveImage';

const PostCard = ({item, onDelete, onPress}) => {
  const colorScheme = Appearance.getColorScheme();
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const getUser = async ()=>{
    await firestore()
    .collection('users')
    .doc(item.userId)
    .get()
    .then((documentSnapshot)=>{
      if(documentSnapshot.exists){
        // console.log('current user data--',documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }


    likeIcon = item.liked ? 'heart' : 'heart-outline';
    likeIconColor = item.liked ? '#2e64e5' : '#333';

    if (item.likes == 1) {
        likeText = '1 Like';
      } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
      } else {
        likeText = 'Like';
      }
    
      if (item.comments == 1) {
        commentText = '1 Comment';
      } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
      } else {
        commentText = 'Comment';
      }

      useEffect(()=>{
        getUser();
      },[])

  return (
    <Card>
    <UserInfo>
      {/* <UserImg
        source={item.userImg}
      /> */}
       <UserImg
                  source={{uri: userData ? userData.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
      />
      <UserInfoText>
        <TouchableOpacity onPress={onPress}>
          <UserName style={{color:'black'}}>
          {userData ? userData.fname || 'Test' : 'Test'} {userData ? userData.lname || 'User' : 'User'}
          </UserName>
        </TouchableOpacity>
        {/* <PostTime>{item.postTime.toString()}</PostTime> */}
        <PostTime style={{color:'black'}}>{moment(item.postTime.toDate()).fromNow()}</PostTime>
      </UserInfoText>
    </UserInfo>
    <PostText style={{color:'black'}}>{item.post}</PostText>
    {item.postImg != null ? 
    // (<PostImg source={{uri:item.postImg}} /> )
    <ProgressiveImage 
      defaultImageSource={require('../Assets/images/default-img.jpg')}
      source={{uri: item.postImg}}
      style={{width: '100%', height: 250}}
      resizeMode="cover"
    />
    : <Divider /> }
    
    <InteractionWrapper>
      <Interaction active={item.liked}>
        <Ionicons name={likeIcon} size={25} color={likeIconColor} />
        <InteractionText active={item.liked}>{likeText}</InteractionText>
      </Interaction>
      <Interaction>
        <Ionicons name="md-chatbubble-outline" size={25} />
        <InteractionText>{commentText}</InteractionText>
      </Interaction>
      {user.uid === item.userId ? 
      <Interaction onPress={()=>onDelete(item.id)}>
        <Ionicons name="md-trash-bin" size={25} />
      </Interaction> 
      : null}

    </InteractionWrapper>
  </Card>
  )
}

export default PostCard

