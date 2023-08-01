import { StyleSheet, Text, View , PermissionsAndroid, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'

//---- API KEY MAP ANDROID -----  AIzaSyD8sSrmOvP6y2NREPe_S1Gp8oOtHPzMKrw  -----

const MapComponent = ({latitude,longitude}) => {

  useEffect(()=>{
    requestLocationPermission();
  },[])
  const requestLocationPermission = async () => {
    try {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
        },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
    } else {
        console.log('You cannot use Geolocation');
        return false;
    }
    } catch (err) {
    return false;
    }
};

  return (
      <MapView
        style={{height:220,width:220}}
        region={{
          latitude:parseFloat(latitude),
          longitude:parseFloat(longitude),
          latitudeDelta: 0,
          longitudeDelta: 0.1,
        }}
      >
          <Marker
            coordinate={{ latitude:parseFloat(latitude), longitude:parseFloat(longitude) }}
          />
        </MapView>
  )
}

export default MapComponent

const styles = StyleSheet.create({})