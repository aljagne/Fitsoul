import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/hooks/use-onboarding-store';
import { colors } from '@/constants/colors';

export default function Index() {
  const { hasCompletedOnboarding } = useOnboardingStore();
  
  // Use a simple conditional rendering approach instead of immediate redirects
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  }
});