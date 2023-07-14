import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from './src/Screens/OnBoardingScreen';
import LoginScreen from './src/Screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

function App() {
  const[isFirstLaunch, setIsFirstLaunch]:any = React.useState(null);
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
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }else{
    return (<LoginScreen/>)
  }
}

export default App;
