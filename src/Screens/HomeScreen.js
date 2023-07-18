import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import FormButton from '../components/FormButton'
import { AuthContext } from '../navigation/AuthProvider'

const HomeScreen = () => {
    const {user} = useContext(AuthContext);
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:20}}>
      <Text style={{fontSize:20}}>Welcome {user.uid}</Text>
      <Text style={{fontSize:20}}>Welcome {user.uid}</Text>
      <Text style={{fontSize:20}}>Welcome {user.uid}</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})