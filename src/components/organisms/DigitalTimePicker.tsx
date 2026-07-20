import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, Platform, StyleSheet } from 'react-native';

import { DigitalClock } from '@/components/molecules';
import { useTheme } from '@/theme';

export interface DigitalTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

/**
 * Kullanıcıya alarm saatini tam özgürlükle (herhangi bir saat, AM/PM) seçtiren
 * dijital saat alanı. Android'de native dialog (imperative API — kütüphanenin
 * kendi önerisi), iOS'ta dokununca açılan inline spinner kullanılır.
 */
export function DigitalTimePicker({ value, onChange }: DigitalTimePickerProps) {
  const { colors } = useTheme();
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  function open() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'time',
        is24Hour: false,
        onValueChange: (_event, date) => onChange(date),
      });
    } else {
      setIosPickerOpen((current) => !current);
    }
  }

  return (
    <>
      <Pressable onPress={open} accessibilityRole="button" style={styles.container}>
        <DigitalClock time={value} format="12h" />
      </Pressable>
      {Platform.OS === 'ios' && iosPickerOpen ? (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour={false}
          display="spinner"
          themeVariant="dark"
          onValueChange={(_event, date) => onChange(date)}
          textColor={colors.textPrimary}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
