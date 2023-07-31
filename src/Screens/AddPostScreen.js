import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View,PermissionsAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import { AddImage, InputField, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddPost';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';

const AddPostScreen = () => {

  const {user} = useContext(AuthContext);

  const[image,setImage] = useState(null);
  const[uploading,setUploading] = useState(false);
  const[transferred,setTransferred] = useState(0);
  const[post,setPost] = useState(null);

  const openCamera = ()=>{
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      // console.log('image---',image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  }

  const openGallery = async()=>{
    try {
      // Check if the READ_EXTERNAL_STORAGE permission is granted
			if (Platform.OS === 'android') {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
					{
						title: 'Storage Permission',
						message: 'This app needs access to your storage to pick images.',
						buttonNeutral: 'Ask Me Later',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					}
					);
					
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('You can use the gallery',granted);
				  } else {
					console.log('Gallery permission denied',granted);
				  }
			  }
        ImagePicker.openPicker({
          width: 1200,
          height: 780,
          cropping: true,
        }).then(image => {
          // console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(imageUri);
        });
    } catch (error) {
      Alert.alert('Error while requesting storage permission:', error);
    }

  }

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('url',imageUrl);
    setImage(null); // after image uploaded set image to null again.
    firestore()
    .collection('posts')
    .add({
      userId:user.uid,
      post:post,
      postImg:imageUrl,
      postTime:firestore.Timestamp.fromDate(new Date()),
      likes:null,
      comments:null
    })
    .then(()=>{
      console.log('added');
      Alert.alert(
        'Post published!',
        'Your Post has been published Successfully!'
      );
      setPost(null);
    })
    .catch((error)=>{
      console.log('error--',error);
    })

  }

  const uploadImage = async()=>{
    if(image === null){
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1); // for getting image name (abc.jpg)

    // add timestamp to filename for storing each image as unique name in cloud storage
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;  // abc20230101.jpg
    
    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`)
    const task = storageRef.putFile(uploadUri);

    // set transferred state
    task.on('state_changed', taskSnapshot => {
      // console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes) * 100);
      // console.log('progres---',transferred);
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      Alert.alert(
        'Image uploaded!',
        'Your Image has been uploaded Successfully!'
      );
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return (
    <View style={styles.container}>
        <InputWrapper>
        {image !== null ? <AddImage source={{uri:image}} /> : null }
            <InputField
                placeholder="What's on your mind?"
                multiline
                numberOfLines={4}
                value={post}
                onChangeText={(content)=>setPost(content)}
                placeholderTextColor='black'
            />
            {uploading ? (
              <StatusWrapper>
                <Text>{transferred} % Completed!</Text>
                <ActivityIndicator size="large" color="#0000ff" />  
              </StatusWrapper>
            ) : (
              <SubmitBtn onPress={()=>submitPost()}>
              <SubmitBtnText>Post</SubmitBtnText>
            </SubmitBtn>
            )}

        </InputWrapper>
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Take Photo" onPress={() => openCamera()}>
            <Icon name="camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Choose Photo" onPress={() => openGallery()}>
            <Icon name="md-images-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
    </View>
  )
}

export default AddPostScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    actionButtonIcon:{
        fontSize:20,
        height:22,
        color:'white'
    }
})