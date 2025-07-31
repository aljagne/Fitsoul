import { BundleInspector } from '../.rorkai/inspector';
import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
import { Stack, Slot } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { colors } from "@/constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View } from "react-native";
import ErrorBoundary from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // You can add custom fonts here if needed
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Export error boundary for better error handling
export { ErrorBoundary };