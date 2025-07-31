import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

interface BackButtonProps {
  color?: string;
  size?: number;
  onPress?: () => void;
}

export function BackButton({ 
  color = colors.text, 
  size = 24, 
  onPress 
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable 
      style={styles.button} 
      onPress={handlePress}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <ArrowLeft size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});