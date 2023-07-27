import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../navigation/AuthProvider';

const Message = ({time,message,sentBy}) => {
    const {user, logout} = useContext(AuthContext);
    // useEffect(()=>{
    //     console.log('sentBy',sentBy);
    //     console.log('loginUser',user.uid);
    // },[])
    const isOnLeft = (type) => {
		if (sentBy != user.uid && type === "messageContainer") {
			return {
				alignSelf: "flex-start",
				backgroundColor: "#f0f0f0",
				borderTopLeftRadius: 0,
			};
		} else if (sentBy != user.uid && type === "message") {
			return {
				color: "#000",
			};
		} else if (sentBy != user.uid && type === "time") {
			return {
				color: "darkgray",
			};
		} else {
			return {
				borderTopRightRadius: 0,
			};
		}
	};
  return (     
    <View style={styles.container}>
        <View style={[styles.messageContainer, isOnLeft('messageContainer')]}>
            <View style={styles.messageView}>
                <Text style={[styles.message, isOnLeft('message')]}>{message}</Text>
            </View>
            <View style={styles.timeView}>
                <Text style={[styles.time, isOnLeft('time')]}>{time}</Text>
            </View>
        </View>

    </View>
  )
}

export default Message

const styles = StyleSheet.create({
    container: {
		paddingVertical: 10,
		marginVertical: 5,
	},
	messageContainer: {
		backgroundColor: 'darkblue',
		maxWidth: "80%",
		alignSelf: "flex-end",
		flexDirection: "row",
		borderRadius: 15,
		paddingHorizontal: 10,
		marginHorizontal: 10,
		paddingTop: 5,
		paddingBottom: 10,
	},
	messageView: {
		backgroundColor: "transparent",
		maxWidth: "80%",
	},
	timeView: {
		backgroundColor: "transparent",
		justifyContent: "flex-end",
		paddingLeft: 10,
	},
	message: {
		color: "white",
		alignSelf: "flex-start",
		fontSize: 15,
	},
	time: {
		color: "lightgray",
		alignSelf: "flex-end",
		fontSize: 10,
	},
})