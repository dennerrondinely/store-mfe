import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { colors } from '../constants/colors';

interface SplashScreenProps {
  name: string;
}

const SplashScreen = ({ name }: SplashScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <MaterialIcons
        style={styles.icon}
        size={56}
        color={colors.primary}
        name="cloud"
      />
      <Text style={styles.text}>{name} screen is loading. Please wait...</Text>
      <ProgressBar
        style={styles.progress}
        indeterminate
        color={colors.primary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
  },
  progress: {
    marginVertical: 16,
    marginHorizontal: 32,
  },
});

export default SplashScreen;
