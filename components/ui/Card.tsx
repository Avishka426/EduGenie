import { COLORS } from '@/constants';
import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: boolean;
}

export default function Card({ 
  children, 
  style, 
  padding = 16,
  shadow = true 
}: CardProps) {
  return (
    <View style={[
      styles.container,
      { padding },
      shadow && styles.shadow,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    marginBottom: 16,
  },
  shadow: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
