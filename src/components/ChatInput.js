import { Alert, Image, Platform, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity,View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';




const ChatInput = ({loggedInUserId,otherUserId,docId}) => {
	const[message,setMessage] = useState('')
	const[visible,setVisible] = useState(false);
	const [image, setImage] = useState(null);
	const [uploading, setUploading] = useState(false);
  	const [transferred, setTransferred] = useState(0);
	const [showImage, setShowImage] = useState(false);

	const sendMessage = (message,msgType)=>{
		try {
			const myMsg = {
				sentBy:loggedInUserId,
				sentTo:otherUserId,
				createdAt:new Date(),
				text:message,
				msgType:msgType
			  }
			  firestore().collection('chatrooms')
			  .doc(docId)
			  .collection('messages')
			  .add({...myMsg,createdAt:firestore.FieldValue.serverTimestamp()});
	
			  setMessage('');
		} catch (error) {
			console.log('error-',error);
		}
	}


	const takePhotoFromCamera = () => {
		setVisible(false);
		ImagePicker.openCamera({
		  compressImageMaxWidth: 300,
		  compressImageMaxHeight: 300,
		  cropping: true,
		  compressImageQuality: 0.7,
		}).then(async (img) => {
		  console.log(img);
		  const imageUri = Platform.OS === 'ios' ? img.sourceURL : img.path;
		  console.log(imageUri);
		  setImage(imageUri);

		  // upload image to firebase
		//   if(image === null){
		// 	return null;
		//   }
		  const uploadUri = imageUri;
		  let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1); // for getting image name (abc.jpg)
	  
		  // add timestamp to filename for storing each image as unique name in cloud storage
		  const extension = filename.split('.').pop();
		  const name = filename.split('.').slice(0, -1).join('.');
		  filename = name + Date.now() + '.' + extension;  // abc20230101.jpg
		  
		  setUploading(true);
		  setTransferred(0);
	  
		  const storageRef = storage().ref(`messages-${docId}/${filename}`)
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
			setImage(null);
			sendMessage(url,'img') // save data in firestore database
			return url;
	  
		  } catch (error) {
			console.log(error);
			return null;
		  }
		  
		});
	  };

	  const choosePhotoFromLibrary = async() => {
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
		setVisible(false);
		ImagePicker.openPicker({
		  width: 300,
		  height: 300,
		  cropping: true,
		  compressImageQuality: 0.7,
		}).then(async(image) => {
		  console.log(image);
		  const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
		  setImage(imageUri);

		  // upload image
		  const uploadUri = imageUri;
		  let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1); // for getting image name (abc.jpg)
	  
		  // add timestamp to filename for storing each image as unique name in cloud storage
		  const extension = filename.split('.').pop();
		  const name = filename.split('.').slice(0, -1).join('.');
		  filename = name + Date.now() + '.' + extension;  // abc20230101.jpg
		  
		  setUploading(true);
		  setTransferred(0);
	  
		  const storageRef = storage().ref(`messages-${docId}/${filename}`)
		  const task = storageRef.putFile(uploadUri);
	  
		  // set transferred state
		  task.on('state_changed', taskSnapshot => {
			// console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
			setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes) * 100);
			console.log('progres---',transferred);
		  });
	  
		  try {
			await task;
			const url = await storageRef.getDownloadURL();
			setUploading(false);
			setImage(null);
			sendMessage(url,'img') // save data in firestore database
			return url;
	  
		  } catch (error) {
			console.log(error);
			return null;
		  }
		});
		} catch (error) {
			Alert.alert('Error while requesting storage permission:', error);
		}
	  };



  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.inputAndMicrophone}>
			{image!==null ? <Image source={{uri:image}} style={{height:100,width:100}} /> : <>
			<TextInput
				multiline
				placeholder={image!==null ? '' : 'Type something...'}
				style={styles.input}
				value={message}
				onChangeText={(text)=>setMessage(text)}
				placeholderTextColor='black'
			/>
			<TouchableOpacity style={styles.rightIconButtonStyle} onPress={()=>setVisible(true)}>
				<AntDesign name="paperclip" size={23} color="#9f9f9f"/>	
			</TouchableOpacity>
			<TouchableOpacity style={styles.rightIconButtonStyle} onPress={takePhotoFromCamera}>
				<Feather name="camera" size={23} color="#9f9f9f"/>	
			</TouchableOpacity>
			</>}

        </View>
			<TouchableOpacity style={styles.sendButton} onPress={()=>sendMessage(message,'text')}>
				
				{image ? <ActivityIndicator size='large'/> : <Feather name={(message) ? "send" : "mic"} size={23} color="#9f9f9f"/>}	
			</TouchableOpacity>
      	</View>

	  <Modal 
        visible={visible} 
		transparent={true}
        onBackdropPress={()=>setVisible(false)} 
        onBackButtonPress={()=>setVisible(false)}

      >
      <View style={{flex:1,justifyContent:'flex-end',marginBottom:50,alignItems:'center'}}>
			<View style={{backgroundColor:'#003153',height:200,width:'95%',borderRadius:20}}>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<View>
						<View style={{height:60,width:60,borderRadius:30,backgroundColor:'purple',justifyContent:'center',alignItems:'center',marginTop:20}}>
							<Ionicons name="document-outline" size={30} color="#fff"/>
						</View>
						<Text style={{color:'#fff',marginLeft:10}}>Document</Text>
					</View>
					<View>
						<TouchableOpacity onPress={takePhotoFromCamera} style={{height:60,width:60,borderRadius:30,backgroundColor:'red',justifyContent:'center',alignItems:'center',marginTop:20,marginHorizontal:10}}>
							<Ionicons name="camera" size={30} color="#fff"/>
						</TouchableOpacity>
						<Text style={{color:'#fff',marginLeft:20}}>Camera</Text>
					</View>
					<View>
						<TouchableOpacity onPress={choosePhotoFromLibrary} style={{height:60,width:60,borderRadius:30,backgroundColor:'brown',justifyContent:'center',alignItems:'center',marginTop:20,marginLeft:10}}>
							<Ionicons name="image-outline" size={30} color="#fff"/>
						</TouchableOpacity>
						<Text style={{color:'#fff',marginLeft:20}}>Gallery</Text>
					</View>
				</View>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<View>
						<View style={{height:60,width:60,borderRadius:30,backgroundColor:'orange',justifyContent:'center',alignItems:'center',marginTop:10}}>
							<Ionicons name="headset" size={30} color="#fff"/>
						</View>
						<Text style={{color:'#fff',marginLeft:10}}>Audio</Text>
					</View>
					<View>
						<View style={{height:60,width:60,borderRadius:30,backgroundColor:'green',justifyContent:'center',alignItems:'center',marginTop:10,marginLeft:25}}>
							<Ionicons name="location" size={30} color="#fff"/>
						</View>
						<Text style={{color:'#fff',marginLeft:30}}>Location</Text>
					</View>
					<View>
						<View style={{height:60,width:60,borderRadius:30,backgroundColor:'blue',justifyContent:'center',alignItems:'center',marginTop:10,marginLeft:25}}>
						<AntDesign name="contacts" size={30} color="#fff"/>
						</View>
						<Text style={{color:'#fff',marginLeft:25}}>Contacts</Text>
					</View>
				</View>
			</View>
      </View>
      </Modal>
    </View>
  )
}

export default ChatInput

const styles = StyleSheet.create({
    container: {
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	replyContainer: {
		paddingHorizontal: 10,
		marginHorizontal: 10,
		justifyContent: "center",
		alignItems: "flex-start",
	},
	title: {
		marginTop: 5,
		fontWeight: "bold",
	},
	closeReply: {
		position: "absolute",
		right: 10,
		top: 5,
	},
	reply: {
		marginTop: 5,
	},
	innerContainer: {
		paddingHorizontal: 10,
		marginHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 10,
	},
	inputAndMicrophone: {
		flexDirection: "row",
		backgroundColor: '#f0f0f0',
		flex: 3,
		marginRight: 10,
		paddingVertical: Platform.OS === "ios" ? 10 : 0,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		backgroundColor: "transparent",
		paddingLeft: 20,
		color: '#000',
		flex: 3,
		fontSize: 15,
		height: 50,
		alignSelf: "center",
	},
	rightIconButtonStyle: {
		justifyContent: "center",
		alignItems: "center",
		paddingRight: 15,
		paddingLeft: 10,
		borderLeftWidth: 1,
		borderLeftColor: "#fff",
	},
	swipeToCancelView: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 30,
	},
	swipeText: {
		color: 'blue',
		fontSize: 15,
	},
	emoticonButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 10,
	},
	recordingActive: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 10,
	},
	recordingTime: {
		color: 'red',
		fontSize: 20,
		marginLeft: 5,
	},
	microphoneAndLock: {
		alignItems: "center",
		justifyContent: "flex-end",
	},
	lockView: {
		backgroundColor: "#eee",
		width: 60,
		alignItems: "center",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		height: 130,
		paddingTop: 20,
	},
	sendButton: {
		backgroundColor: '#003153',
		borderRadius: 50,
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},


	
	panel: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		paddingTop: 10,
		width: '100%',
	  },
	  header: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#333333',
		shadowOffset: {width: -1, height: -3},
		shadowRadius: 2,
		shadowOpacity: 0.4,
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	  },
	  panelHeader: {
		alignItems: 'center',
	  },
	  panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00000040',
		marginBottom: 10,
	  },
	  panelTitle: {
		fontSize: 27,
		height: 35,
	  },
	  panelSubtitle: {
		fontSize: 14,
		color: 'gray',
		height: 30,
		marginBottom: 10,
	  },
	  panelButton: {
		padding: 13,
		borderRadius: 10,
		backgroundColor: '#2e64e5',
		alignItems: 'center',
		marginVertical: 7,
	  },
	  panelButtonTitle: {
		fontSize: 17,
		fontWeight: 'bold',
		color: 'white',
	  },
})