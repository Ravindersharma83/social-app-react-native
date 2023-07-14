import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoardingScreen from '../Screens/OnBoardingScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';


const Stack = createNativeStackNavigator();

function AuthStack() {
  const[isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  let routeName;
  React.useEffect(()=>{
    AsyncStorage.getItem('alreadyLaunched').then(value =>{
      if(value == null){
        AsyncStorage.setItem('alreadyLaunched','true');
        setIsFirstLaunch(true);
      }else{
        setIsFirstLaunch(false);
      }
    })
  },[])

  if(isFirstLaunch === null){
    return null;
  }else if(isFirstLaunch === true){
    routeName = 'Onboarding'
  }else{
    routeName = 'Login'
  }

  return (
      <Stack.Navigator initialRouteName={routeName} screenOptions={{headerShown: false}}>
        <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
      </Stack.Navigator>
  );
}

export default AuthStack;
