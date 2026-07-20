// expo-notifications, Expo Go içinde import edilir edilmez (push token
// otomatik kaydı Expo Go'da desteklenmediği için) Android'de console.error
// ile LogBox'ı tam ekran kırmızı ekrana çeviriyor. Bu projede yalnız YEREL
// bildirim kullanılıyor, push hiç kullanılmıyor, o yüzden zararsız — ama
// diğer tüm import'lardan (özellikle AlarmScheduler -> expo-notifications
// zincirinden) önce susturulmalı. Dev client/native build'de hiç tetiklenmez
// (isRunningInExpoGo() false döner), yalnız biri Expo Go ile açarsa devreye girer.
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
]);

import { Amiri_400Regular } from '@expo-google-fonts/amiri';
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Lora_500Medium_Italic, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initAlarmScheduler } from '@/services/AlarmScheduler';
import { ThemeProvider, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { colors, themeName } = useTheme();
  return (
    <>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lora_600SemiBold,
    Lora_500Medium_Italic,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_700Bold,
    Amiri_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => initAlarmScheduler(), []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
