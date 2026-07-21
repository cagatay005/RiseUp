import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms';
import { DigitalClock } from '@/components/molecules';
import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';
import { WHEEL_ITEM_HEIGHT, WheelColumn } from './WheelColumn';

export interface DigitalTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

/** Ekranın alt tarafındaki ayrı "Set Alarm" butonundan da açılabilmesi için. */
export interface DigitalTimePickerHandle {
  open: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function hour12Of(date: Date): number {
  const h = date.getHours() % 12;
  return h === 0 ? 12 : h;
}

function combineTime(base: Date, hour12: number, minute: number, isPm: boolean): Date {
  const result = new Date(base);
  const hour24 = (hour12 % 12) + (isPm ? 12 : 0);
  result.setHours(hour24, minute, 0, 0);
  return result;
}

/**
 * Alarm saatini seçtiren tamamen özel kaydırmalı (wheel) seçici — native
 * DateTimePicker KULLANILMAZ: Android'de bu kütüphane her zaman bir sistem
 * Dialog'u açar ve çalışma zamanında renklendirilemez (yalnızca native build
 * config plugin ile, Expo Go'da işe yaramaz) — bu yüzden Android'de daima
 * beyaz/varsayılan Material görünümlü bir popup çıkardı. Bunun yerine karanlık
 * temayla birebir uyan, her iki platformda da aynı görünen bir alttan-açılır
 * sayfa (bottom sheet) içinde saf RN Animated tabanlı bir çark kullanılır.
 *
 * `open()`, dijital saate dokunmanın yanı sıra dışarıdan (ör. ekranın altındaki
 * ayrı bir "Set Alarm" butonu) da tetiklenebilsin diye ref ile dışa açılır.
 */
export const DigitalTimePicker = forwardRef<DigitalTimePickerHandle, DigitalTimePickerProps>(
  function DigitalTimePicker({ value, onChange }, ref) {
    const { colors } = useTheme();
    const t = useTranslation();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pendingValue, setPendingValue] = useState(value);

    function open() {
      setPendingValue(value);
      setPickerOpen(true);
    }

    useImperativeHandle(ref, () => ({ open }));

    const periods = useMemo(() => [t.common.am, t.common.pm], [t]);

    function updateHour(index: number) {
      setPendingValue((current) => combineTime(current, index + 1, current.getMinutes(), current.getHours() >= 12));
    }

    function updateMinute(index: number) {
      setPendingValue((current) => combineTime(current, hour12Of(current), index, current.getHours() >= 12));
    }

    function updatePeriod(index: number) {
      setPendingValue((current) => combineTime(current, hour12Of(current), current.getMinutes(), index === 1));
    }

    function confirm() {
      onChange(pendingValue);
      setPickerOpen(false);
    }

    return (
      <>
        <Pressable onPress={open} accessibilityRole="button" style={styles.container}>
          <DigitalClock time={value} format="12h" />
        </Pressable>

        <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setPickerOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t.common.close}
          />
          <View style={[styles.sheet, { backgroundColor: colors.surfaceElevated }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <View style={styles.wheelRow}>
              <View
                pointerEvents="none"
                style={[
                  styles.selectionBar,
                  { top: WHEEL_ITEM_HEIGHT * 2, borderColor: colors.accent, backgroundColor: `${colors.accent}1A` },
                ]}
              />
              {pickerOpen ? (
                <>
                  <WheelColumn
                    items={HOURS}
                    initialIndex={hour12Of(pendingValue) - 1}
                    onChange={updateHour}
                  />
                  <WheelColumn
                    items={MINUTES}
                    initialIndex={pendingValue.getMinutes()}
                    onChange={updateMinute}
                  />
                  <WheelColumn
                    items={periods}
                    initialIndex={pendingValue.getHours() >= 12 ? 1 : 0}
                    onChange={updatePeriod}
                    width={56}
                  />
                </>
              ) : null}
            </View>

            <Button title={t.digitalTimePicker.setAlarm} onPress={confirm} style={styles.confirmButton} />
            <Button
              title={t.digitalTimePicker.cancel}
              variant="ghost"
              onPress={() => setPickerOpen(false)}
              style={styles.cancelButton}
            />
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000099',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  wheelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: WHEEL_ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: radius.sm,
  },
  confirmButton: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  cancelButton: {
    marginTop: spacing.xs,
    alignSelf: 'stretch',
  },
});
