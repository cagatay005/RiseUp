import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/atoms';
import { badges, type BadgeDef } from '../../../design/tokens';
import { useTranslation } from '@/i18n';
import { SymbolProgressRow } from './SymbolProgressRow';
import { useStreakStore } from '@/stores';
import { radius, spacing, useTheme, type ThemeColors } from '@/theme';

const ICONS: Record<BadgeDef['icon'], keyof typeof Ionicons.glyphMap> = {
  flame: 'flame',
  compass: 'compass',
  sunny: 'sunny',
  mic: 'mic',
  people: 'people',
};

export interface BadgeCardGridProps {
  earnedBadgeIds: string[];
}

/**
 * DESIGN — "Base-5 ilerleme çarkı": her kartın altında rozetin ham ilerleme
 * sayısı SymbolProgressRow ile beşli tabanda sembollere dönüşerek gösterilir
 * (5 nokta → 1 hilal → 1 lale → 1 kandil → 1 nur). Kilitli rozetler kesik
 * çizgili çerçeve + kilit rozeti + %30 opaklıkta gri madalyon; kazanılanlar
 * altın/turuncu parıltıyla (boxShadow) öne çıkar.
 */
export function BadgeCardGrid({ earnedBadgeIds }: BadgeCardGridProps) {
  const { colors } = useTheme();
  const t = useTranslation();

  // Her rozetin ham ilerleme sayısı kendi StreakEngine sayacından okunur;
  // communityHero'nun sayısal bir ilerlemesi yok (tek seferlik kart paylaşımı).
  const bestStreak = useStreakStore((s) => s.bestStreak);
  const qiblaCompletions = useStreakStore((s) => s.qiblaCompletions);
  const fajrCompletions = useStreakStore((s) => s.fajrCompletions);
  const goldenRecitations = useStreakStore((s) => s.goldenRecitations);

  const progressByBadgeId: Partial<Record<string, number>> = {
    flame7: bestStreak,
    qiblaMaster: qiblaCompletions,
    earlyBird: fajrCompletions,
    reciter: goldenRecitations,
  };

  return (
    <View style={styles.grid}>
      {badges.map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);
        const count = progressByBadgeId[badge.id] ?? 0;

        return (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earned}
            count={count}
            colors={colors}
            title={t.badges[badge.id as keyof typeof t.badges] ?? badge.title}
            earnedLabel={t.trophies.earned}
            lockedLabel={t.trophies.locked}
          />
        );
      })}
    </View>
  );
}

function BadgeCard({
  badge,
  earned,
  count,
  colors,
  title,
  earnedLabel,
  lockedLabel,
}: {
  badge: BadgeDef;
  earned: boolean;
  count: number;
  colors: ThemeColors;
  title: string;
  earnedLabel: string;
  lockedLabel: string;
}) {
  const gradientId = `badgeCardGradient-${badge.id}`;
  const medallionId = `badgeMedallion-${badge.id}`;

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: earned ? colors.gold : colors.border,
          borderStyle: earned ? 'solid' : 'dashed',
          ...(earned ? ({ boxShadow: `0 0 18px 0 ${colors.gold}55` } as object) : null),
        },
      ]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#2A3B52" stopOpacity={1} />
            <Stop offset="1" stopColor="#1A2332" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" rx={radius.md} fill={`url(#${gradientId})`} />
      </Svg>

      <View style={styles.medallionWrap}>
        <Svg width={64} height={64} viewBox="0 0 64 64">
          <Defs>
            <RadialGradient id={medallionId} cx="38%" cy="32%" r="70%">
              <Stop offset="0" stopColor={earned ? '#F7D488' : '#4A5568'} />
              <Stop offset="0.55" stopColor={earned ? colors.gold : '#333D4C'} />
              <Stop offset="1" stopColor={earned ? '#8A5A22' : '#20262F'} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={64} height={64} rx={32} fill={`url(#${medallionId})`} opacity={earned ? 1 : 0.3} />
        </Svg>
        <Ionicons
          name={ICONS[badge.icon]}
          size={26}
          color={earned ? colors.onAccent : colors.textSecondary}
          style={[styles.medallionIcon, !earned && styles.lockedIcon]}
        />
        {!earned ? (
          <View
            style={[styles.lockBadge, { backgroundColor: colors.background, borderColor: colors.border }]}
            accessibilityLabel={lockedLabel}
          >
            <Ionicons name="lock-closed" size={12} color={colors.textSecondary} />
          </View>
        ) : null}
      </View>

      <AppText
        variant="bodySmall"
        color={earned ? 'textPrimary' : 'textSecondary'}
        style={[styles.title, earned ? { fontWeight: '700' } : null]}
      >
        {title}
      </AppText>

      {earned ? (
        <View style={styles.earnedRow}>
          <Ionicons name="checkmark-circle" size={13} color={colors.success} />
          <AppText variant="caption" color="textSecondary">
            {earnedLabel}
          </AppText>
        </View>
      ) : (
        <SymbolProgressRow count={count} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '47%',
    minHeight: 168,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  medallionWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  medallionIcon: {
    position: 'absolute',
  },
  lockedIcon: {
    opacity: 0.55,
  },
  lockBadge: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  earnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    marginTop: spacing.xs / 2,
  },
});
