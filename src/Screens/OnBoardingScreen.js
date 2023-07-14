import { StyleSheet, Text, View, Button,Image } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';

const OnBoardingScreen = ({ navigation }) => {
  return (
    <Onboarding
        onSkip={()=>navigation.replace("Login")}
        onDone={()=>navigation.navigate("Login")}
  pages={[
    {
      backgroundColor: '#a6e4d0',
      image: <Image source={require('../Assets/images/onboarding-img1.png')} />,
      title: 'Connect to the World',
      subtitle: 'A new way to connect with the World',
    },
    {
      backgroundColor: '#fdeb93',
      image: <Image source={require('../Assets/images/onboarding-img2.png')} />,
      title: 'Share your Favorites',
      subtitle: 'Share your thoughts with similar kind of people',
    },
    {
      backgroundColor: '#e9bcbe',
      image: <Image source={require('../Assets/images/onboarding-img3.png')} />,
      title: 'Become the Star',
      subtitle: 'Let the spot light capture you',
    },
  ]}
/>
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({})