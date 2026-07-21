import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, Heading } from '@/components/atoms';
import { captureCard, saveCardToGallery, shareCard } from '@/services/CardRenderer';
import { MONTH_NAMES } from '@/services/scheduleHelpers';
import { recordCardShared } from '@/services/StreakEngine';
import type { AchievementCard } from '@/stores/streakStore';
import { radius, spacing, useTheme } from '@/theme';

const CARD_WIDTH = 200;
const CARD_GAP = 16; // spacing.md — snap hesabında sabit sayı gerektiği için ayrık tutuldu.

function formatCardDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export interface AchievementCardGalleryProps {
  cards: AchievementCard[];
}

/**
 * DESIGN §3.3: 3:4 başarı kartları, yatay kaydırmalı; Save (galeri) ve Share
 * (native paylaşım) o an görünen kartı view-shot ile PNG'ye yakalar (issue #16
 * kabul kriteri: paylaşılan görsel bu düzenle birebir aynı olmalı — kart View'i
 * ekranda göründüğü haliyle yakalanır, ayrı bir "render şablonu" yoktur).
 */
export function AchievementCardGallery({ cards }: AchievementCardGalleryProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);
  const cardRefs = useRef(new Map<string, View>());

  if (cards.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="ribbon-outline" size={32} color={colors.textSecondary} />
        <AppText color="textSecondary" style={styles.center}>
          Complete a 15-day streak or a verse recitation to earn your first card.
        </AppText>
      </View>
    );
  }

  const active = cards[Math.min(activeIndex, cards.length - 1)]!;

  async function handleAction(action: 'save' | 'share') {
    const node = cardRefs.current.get(active.id);
    if (!node) return;
    setBusy(action);
    try {
      const uri = await captureCard(node);
      const ok = action === 'save' ? await saveCardToGallery(uri) : await shareCard(uri);
      if (ok && action === 'share') recordCardShared();
      if (!ok) {
        Alert.alert(
          action === 'save' ? 'Permission needed' : 'Sharing unavailable',
          action === 'save'
            ? 'Allow photo access to save your achievement card.'
            : 'Sharing is not available on this device.',
        );
      }
    } catch {
      Alert.alert('Something went wrong', 'Could not process the card image.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
          setActiveIndex(Math.min(cards.length - 1, Math.max(0, i)));
        }}
      >
        {cards.map((card) => (
          <View
            key={card.id}
            ref={(node) => {
              if (node) cardRefs.current.set(card.id, node);
              else cardRefs.current.delete(card.id);
            }}
            collapsable={false}
            style={[
              styles.card,
              { width: CARD_WIDTH, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <AppText variant="caption" color="textSecondary" style={styles.brand}>
              RiseUp
            </AppText>
            <View style={styles.cardBody}>
              <Ionicons name={card.type === 'streak' ? 'flame' : 'mic'} size={26} color={colors.gold} />
              <AppText variant="numberLarge" style={{ color: colors.gold }}>
                {card.value}
              </AppText>
              <Heading variant="h2" style={styles.cardTitle}>
                {card.title}
              </Heading>
            </View>
            <AppText variant="caption" color="textSecondary">
              {formatCardDate(card.earnedAt)}
            </AppText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Save"
          variant="secondary"
          onPress={() => void handleAction('save')}
          disabled={busy !== null}
          style={styles.actionButton}
        />
        <Button
          title="Share"
          onPress={() => void handleAction('share')}
          disabled={busy !== null}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  scrollContent: {
    gap: CARD_GAP,
    paddingHorizontal: spacing.lg,
  },
  card: {
    aspectRatio: 3 / 4,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  brand: {
    letterSpacing: 1,
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
