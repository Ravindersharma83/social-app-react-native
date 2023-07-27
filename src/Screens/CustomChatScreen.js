import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'

const CustomChatScreen = ({route,navigation}) => {
  return (
    <View style={{flex:1}}>
      <MessageList route={route} navigation={navigation}/>
      {/* <ChatInput/> */}
    </View>
  )
}

export default CustomChatScreen

const styles = StyleSheet.create({})