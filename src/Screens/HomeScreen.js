import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import FormButton from '../components/FormButton'
import { AuthContext } from '../navigation/AuthProvider'

const HomeScreen = () => {
    const {user,logout} = useContext(AuthContext);
  return (
    <View>
      <Text>Welcome {user.uid}</Text>
      <FormButton buttonTitle='Logout' onPress={()=> logout()}/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})