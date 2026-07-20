import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ForcedThemeProvider } from '@/theme';

// Onboarding her zaman karanlık temadadır (DESIGN.md §2) — kullanıcının
// settingsStore.theme tercihinden bağımsız olarak zorlanır. StatusBar da bu
// ekranlarda her zaman açık renkli (kök layout'un global tema bağımlı barının
// üzerine geçer; bu route'tan çıkınca eski değere döner).
export default function OnboardingLayout() {
  return (
    <ForcedThemeProvider name="dark">
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </ForcedThemeProvider>
  );
}
