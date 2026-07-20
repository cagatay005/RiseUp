import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms';
import { DigitalClock } from '@/components/molecules';
import { spacing, useTheme } from '@/theme';

export interface DigitalTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

/**
 * Kullanıcıya alarm saatini tam özgürlükle (herhangi bir saat, AM/PM) seçtiren
 * dijital saat alanı. Yalnız DECLARATIVE <DateTimePicker> komponenti kullanılır
 * (her iki platformda da) — imperative DateTimePickerAndroid.open() API'si
 * Expo Go'da native modülün tam bağlı olmaması yüzünden sessizce hiçbir şey
 * açmıyordu (gerçek cihazda doğrulandı). Deklaratif bileşen Expo Go'da
 * resmi olarak destekleniyor.
 *
 * Android: `display="default"` ile işletim sisteminin kendi dialog'u açılır,
 * kullanıcı OK/Cancel'a basınca kapanır (onChange event.type ile ayırt edilir).
 * iOS: `display="spinner"` ile inline gösterilir, ekranda ayrıca bir
 * "Set Alarm" butonu vardır (spinner'ın kendi onay butonu yoktur).
 */
export function DigitalTimePicker({ value, onChange }: DigitalTimePickerProps) {
  const { colors } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(value);

  function open() {
    setPendingValue(value);
    setPickerOpen(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, date?: Date) {
    setPickerOpen(false);
    if (event.type === 'set' && date) onChange(date);
  }

  function handleIosChange(_event: DateTimePickerEvent, date?: Date) {
    if (date) setPendingValue(date);
  }

  function confirmIos() {
    onChange(pendingValue);
    setPickerOpen(false);
  }

  return (
    <>
      <Pressable onPress={open} accessibilityRole="button" style={styles.container}>
        <DigitalClock time={value} format="12h" />
      </Pressable>

      {pickerOpen && Platform.OS === 'android' ? (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleAndroidChange}
          positiveButton={{ label: 'Set Alarm' }}
          negativeButton={{ label: 'Cancel' }}
        />
      ) : null}

      {pickerOpen && Platform.OS === 'ios' ? (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={pendingValue}
            mode="time"
            is24Hour={false}
            display="spinner"
            themeVariant="dark"
            onChange={handleIosChange}
            textColor={colors.textPrimary}
          />
          <Button title="Set Alarm" onPress={confirmIos} style={styles.confirmButton} />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iosPicker: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
