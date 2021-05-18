import React, {useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text} from 'react-native';
import {colors} from '../res/colors';
import images from '../res/images';

function SplashScreen({navigation}) {
  return (
    <View style={styles.constainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.Primary}
        translucent
      />
      <Image source={images.logo} style={styles.logo} />
      <Text style={styles.welcomeText}>W E L C O M E   T O</Text>
      <Text style={styles.appName}>PROJESK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Primary,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'white',
    fontSize: 11,
    marginTop: 5,
    marginBottom: 2,
  },
});

export default SplashScreen;
