import { TextStyle, ViewStyle } from 'react-native';
import { COLORS } from './index';

// Utility styles similar to Tailwind
export const UTILITIES = {
  // Flexbox
  flex1: { flex: 1 } as ViewStyle,
  flexRow: { flexDirection: 'row' } as ViewStyle,
  flexCol: { flexDirection: 'column' } as ViewStyle,
  itemsCenter: { alignItems: 'center' } as ViewStyle,
  justifyCenter: { justifyContent: 'center' } as ViewStyle,
  justifyBetween: { justifyContent: 'space-between' } as ViewStyle,

  // Spacing
  p4: { padding: 16 } as ViewStyle,
  p6: { padding: 24 } as ViewStyle,
  px4: { paddingHorizontal: 16 } as ViewStyle,
  py4: { paddingVertical: 16 } as ViewStyle,
  m4: { margin: 16 } as ViewStyle,
  mb4: { marginBottom: 16 } as ViewStyle,
  mt4: { marginTop: 16 } as ViewStyle,

  // Background colors
  bgPrimary: { backgroundColor: COLORS.PRIMARY } as ViewStyle,
  bgSecondary: { backgroundColor: COLORS.SECONDARY } as ViewStyle,
  bgWhite: { backgroundColor: COLORS.WHITE } as ViewStyle,
  bgGray100: { backgroundColor: COLORS.BACKGROUND } as ViewStyle,

  // Text colors
  textPrimary: { color: COLORS.PRIMARY } as TextStyle,
  textSecondary: { color: COLORS.SECONDARY } as TextStyle,
  textWhite: { color: COLORS.WHITE } as TextStyle,
  textGray: { color: COLORS.TEXT_MUTED } as TextStyle,

  // Text sizes
  textXs: { fontSize: 12 } as TextStyle,
  textSm: { fontSize: 14 } as TextStyle,
  textBase: { fontSize: 16 } as TextStyle,
  textLg: { fontSize: 18 } as TextStyle,
  textXl: { fontSize: 20 } as TextStyle,
  text2xl: { fontSize: 24 } as TextStyle,
  text3xl: { fontSize: 30 } as TextStyle,

  // Font weights
  fontNormal: { fontWeight: '400' } as TextStyle,
  fontMedium: { fontWeight: '500' } as TextStyle,
  fontSemibold: { fontWeight: '600' } as TextStyle,
  fontBold: { fontWeight: 'bold' } as TextStyle,

  // Border radius
  rounded: { borderRadius: 8 } as ViewStyle,
  roundedLg: { borderRadius: 12 } as ViewStyle,
  roundedXl: { borderRadius: 16 } as ViewStyle,
  roundedFull: { borderRadius: 9999 } as ViewStyle,

  // Shadows
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
} as const;
