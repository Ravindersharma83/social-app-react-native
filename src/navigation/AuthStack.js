import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoardingScreen from '../Screens/OnBoardingScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


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
      <Stack.Navigator initialRouteName={routeName}>
        <Stack.Screen name="Onboarding" component={OnBoardingScreen} options={{header:()=>null}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{header:()=>null}} />
        <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
      </Stack.Navigator>
  );
}

export default AuthStack;
