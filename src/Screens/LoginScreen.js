import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const[email,setEmail] = useState(null);
  const[password,setPassword] = useState(null);

  const {login} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Image
        source={require('../Assets/images/rn-social-logo.png')}
        style={styles.logo}/>
        <Text style={styles.text}>RN Social App</Text>
        <FormInput
          labelValue={email}
          onChangeText={(userEmail)=>setEmail(userEmail)}
          placeholderText='Email'
          iconType='user'
          keyboardType='email-address'
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={(userPassword)=>setPassword(userPassword)}
          placeholderText='Password'
          iconType='lock'
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle='Sign In'
          onPress={()=>login(email,password)}
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={()=> navigation.navigate('Signup')}
        >
          <Text style={styles.navButtonText}>Don't have an account ? Create here</Text>
        </TouchableOpacity>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});