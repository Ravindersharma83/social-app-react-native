import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { AddImage, InputField, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddPost';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const AddPostScreen = () => {

  const[image,setImage] = useState(null);
  const[uploading,setUploading] = useState(false);
  const[transferred,setTransferred] = useState(0);

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

  const openGallery = ()=>{
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      // console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  }

  const submitPost = async()=>{
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1); // for getting image name (abc.jpg)

    // add timestamp to filename for storing each image as unique name in cloud storage
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;  // abc20230101.jpg
    
    setUploading(true);
    setTransferred(0);

    const task = storage().ref(filename).putFile(uploadUri);

    // set transferred state
    task.on('state_changed', taskSnapshot => {
      // console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes) * 100);
      // console.log('progres---',transferred);
    });

    try {
      await task;
      setUploading(false);
      Alert.alert(
        'Image uploaded!',
        'Your Image has been uploaded Successfully!'
      );
    } catch (error) {
      console.log(error);
    }

    setImage(null); // after image uploaded set image to null again.
  }
  return (
    <View style={styles.container}>
        <InputWrapper>
        {image !== null ? <AddImage source={{uri:image}} /> : null }
            <InputField
                placeholder="What's on your mind?"
                multiline
                numberOfLines={4}
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