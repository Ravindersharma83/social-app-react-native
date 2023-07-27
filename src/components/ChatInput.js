import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';


const ChatInput = ({loggedInUserId,otherUserId,docId}) => {
	const[message,setMessage] = useState('')

	const sendMessage = (message)=>{
		try {
			const myMsg = {
				sentBy:loggedInUserId,
				sentTo:otherUserId,
				createdAt:new Date(),
				text:message
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

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.inputAndMicrophone}>
            {/* <TouchableOpacity style={styles.emoticonButton}>
            <MaterialIcons name="emoji-emotions" size={23} color="#9f9f9f"/>
            </TouchableOpacity> */}
			<TextInput
				multiline
				placeholder='Type something...'
				style={styles.input}
				value={message}
				onChangeText={(text)=>setMessage(text)}
			/>
			<TouchableOpacity style={styles.rightIconButtonStyle}>
				<AntDesign name="paperclip" size={23} color="#9f9f9f"/>	
			</TouchableOpacity>
			<TouchableOpacity style={styles.rightIconButtonStyle}>
				<Feather name="camera" size={23} color="#9f9f9f"/>	
			</TouchableOpacity>
        </View>
			<TouchableOpacity style={styles.sendButton} onPress={()=>sendMessage(message)}>
				<Feather name={message ? "send" : "mic"} size={23} color="#9f9f9f"/>	
			</TouchableOpacity>
      </View>
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
		paddingTop: 20,
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