import { Stack } from "expo-router";
import { colors } from "@/constants/colors";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
        headerBackTitle: "Back",
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Log In",
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
          presentation: 'card',
        }}
      />
    </Stack>
  );
}