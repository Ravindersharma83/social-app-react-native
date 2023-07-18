import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../navigation/AuthProvider'
import FormButton from '../components/FormButton';

const ProfileScreen = () => {
    const {user,logout} = useContext(AuthContext);
  return (
    <View>
      <Text>Profile -  {user.uid}</Text>
      <FormButton buttonTitle='Logout' onPress={()=> logout()}/>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})