import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { colors } from "@/constants/colors";
import { 
  Bell, 
  ChevronRight, 
  HelpCircle, 
  Lock, 
  LogOut, 
  Moon, 
  Shield, 
  User, 
  Weight,
  ArrowLeft
} from "lucide-react-native";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";
import { BackButton } from "@/components/BackButton";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { resetOnboarding } = useOnboardingStore();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            resetOnboarding();
            router.replace("/(auth)/welcome");
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: "Settings",
        headerLeft: () => <BackButton />
      }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <Pressable style={styles.settingItem} onPress={() => router.push("/profile")}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <User size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Personal Information</Text>
                <Text style={styles.settingDescription}>Update your profile details</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
            
            <Pressable style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Weight size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Health Data</Text>
                <Text style={styles.settingDescription}>Manage your health metrics</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts and reminders</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={notifications ? colors.primary : colors.textLight}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Moon size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch to dark theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={darkMode ? colors.primary : colors.textLight}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
            
            <Pressable style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Shield size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>Manage who can see your data</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
            
            <Pressable style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Lock size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Security</Text>
                <Text style={styles.settingDescription}>Change password and security options</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <Pressable style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help Center</Text>
                <Text style={styles.settingDescription}>Get help and contact support</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </Pressable>
          </View>
          
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.error,
  },
});