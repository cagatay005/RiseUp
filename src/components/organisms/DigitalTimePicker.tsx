import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
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
 * dijital saat alanı. Android'de native dialog (imperative API — kütüphanenin
 * kendi önerisi) açık "Alarm Kur" etiketli bir onay butonuyla açılır; iOS'ta
 * dokununca açılan inline spinory'nin altında da aynı amaçla bir "Done" butonu
 * gösterilir — cihazlarda varsayılan diyalogda net bir onay butonu olmayabiliyor.
 *
 * `onChange` (event, date) kullanılıyor — `onValueChange` bazı sürümlerde yok;
 * `onChange` her sürümde mevcut ortak paydadır.
 */
export function DigitalTimePicker({ value, onChange }: DigitalTimePickerProps) {
  const { colors } = useTheme();
  const [iosPickerOpen, setIosPickerOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(value);

  function handlePicked(_event: DateTimePickerEvent, date?: Date) {
    if (date) setPendingValue(date);
  }

  function open() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'time',
        is24Hour: false,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(date);
        },
        positiveButton: { label: 'Set Alarm' },
        negativeButton: { label: 'Cancel' },
      });
    } else {
      setPendingValue(value);
      setIosPickerOpen(true);
    }
  }

  function confirmIos() {
    onChange(pendingValue);
    setIosPickerOpen(false);
  }

  return (
    <>
      <Pressable onPress={open} accessibilityRole="button" style={styles.container}>
        <DigitalClock time={value} format="12h" />
      </Pressable>
      {Platform.OS === 'ios' && iosPickerOpen ? (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={pendingValue}
            mode="time"
            is24Hour={false}
            display="spinner"
            themeVariant="dark"
            onChange={handlePicked}
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
