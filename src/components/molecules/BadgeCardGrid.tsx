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

/** Kart kenarlığı — sıcak, madeni bir "pewter/şampanya" ton; kilitli/kazanılmış hepsinde aynı, tutarlılık için. */
const METALLIC_BORDER = '#B8AE9A66';

/**
 * Her rozetin madalyonu farklı bir maden/mücevher kimliğiyle parlar (parlak
 * altın, fırçalanmış bronz, gündoğumu ateşi, zümrüt, cilalı gümüş) — hepsi
 * tek tip altına indirgenmez. Kilitliyken bu kimlikler geçersizdir, tüm
 * rozetler aynı soluk gri-mavi madalyonu paylaşır (bkz. renderMedallionStops).
 */
const MEDALLION_TONES: Record<string, [string, string, string]> = {
  flame7: ['#F7D488', '#E9C46A', '#8A5A22'], // cilalı altın
  qiblaMaster: ['#D8975B', '#B87333', '#6B3E1D'], // fırçalanmış bronz
  earlyBird: ['#FFDCA8', '#F4A261', '#B5622C'], // gündoğumu ateşi
  reciter: ['#8CE8C0', '#2E9E70', '#145C3E'], // parlayan zümrüt
  communityHero: ['#EDEFF2', '#B9BEC6', '#7C7C82'], // cilalı gümüş
};
const LOCKED_TONE: [string, string, string] = ['#4A5568', '#333D4C', '#20262F'];

/** communityHero sayısal bir sayaç tutmaz — kazanılınca "1 nokta" gibi ele alınır. */
function progressCountFor(
  badgeId: string,
  earned: boolean,
  counters: { bestStreak: number; qiblaCompletions: number; fajrCompletions: number; goldenRecitations: number },
): number {
  switch (badgeId) {
    case 'flame7':
      return counters.bestStreak;
    case 'qiblaMaster':
      return counters.qiblaCompletions;
    case 'earlyBird':
      return counters.fajrCompletions;
    case 'reciter':
      return counters.goldenRecitations;
    case 'communityHero':
      return earned ? 1 : 0;
    default:
      return 0;
  }
}

export interface BadgeCardGridProps {
  earnedBadgeIds: string[];
}

/**
 * "Trophy Room" rozet ızgarası: cam görünümlü (yarı saydam sıcak katman +
 * ince madeni kenarlık) yükseltilmiş kartlar, madeni/mücevher tonlu 3B
 * madalyonlar, her kartın altında Base-5 ilerleme çarkı (bkz.
 * SymbolProgressRow — hiç ilerleme yoksa soluk boş yuvalar gösterir).
 */
export function BadgeCardGrid({ earnedBadgeIds }: BadgeCardGridProps) {
  const { colors } = useTheme();
  const t = useTranslation();

  const bestStreak = useStreakStore((s) => s.bestStreak);
  const qiblaCompletions = useStreakStore((s) => s.qiblaCompletions);
  const fajrCompletions = useStreakStore((s) => s.fajrCompletions);
  const goldenRecitations = useStreakStore((s) => s.goldenRecitations);

  return (
    <View style={styles.grid}>
      {badges.map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);
        const count = progressCountFor(badge.id, earned, {
          bestStreak,
          qiblaCompletions,
          fajrCompletions,
          goldenRecitations,
        });

        return (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earned}
            count={count}
            colors={colors}
            title={t.badges[badge.id as keyof typeof t.badges] ?? badge.title}
            lockedLabel={t.trophies.locked}
            earnedLabel={t.trophies.earned}
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
  lockedLabel,
  earnedLabel,
}: {
  badge: BadgeDef;
  earned: boolean;
  count: number;
  colors: ThemeColors;
  title: string;
  lockedLabel: string;
  earnedLabel: string;
}) {
  const cardGradientId = `badgeCardGradient-${badge.id}`;
  const sheenId = `badgeCardSheen-${badge.id}`;
  const medallionId = `badgeMedallion-${badge.id}`;
  const [light, mid, dark] = earned ? MEDALLION_TONES[badge.id]! : LOCKED_TONE;

  const elevationShadow = `0 6px 16px 0 rgba(0,0,0,0.35)`;
  const glowShadow = earned ? `, 0 0 20px 0 ${colors.gold}55` : '';

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: METALLIC_BORDER,
          boxShadow: `${elevationShadow}${glowShadow}`,
        } as object,
      ]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={cardGradientId} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#2A3B52" stopOpacity={1} />
            <Stop offset="1" stopColor="#1A2332" stopOpacity={1} />
          </LinearGradient>
          {/* Cam görünümü: sol üstten süzülen çok soluk, sıcak bir parlaklık katmanı. */}
          <LinearGradient id={sheenId} x1="0" y1="0" x2="0.7" y2="0.9">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.06} />
            <Stop offset="0.4" stopColor="#FFFFFF" stopOpacity={0.015} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" rx={radius.md} fill={`url(#${cardGradientId})`} />
        <Rect x={0} y={0} width="100%" height="100%" rx={radius.md} fill={`url(#${sheenId})`} />
      </Svg>

      <View style={styles.medallionWrap}>
        <Svg width={76} height={76} viewBox="0 0 76 76">
          <Defs>
            <RadialGradient id={medallionId} cx="36%" cy="30%" r="72%">
              <Stop offset="0" stopColor={light} />
              <Stop offset="0.55" stopColor={mid} />
              <Stop offset="1" stopColor={dark} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={76} height={76} rx={38} fill={`url(#${medallionId})`} opacity={earned ? 1 : 0.25} />
        </Svg>
        <Ionicons
          name={ICONS[badge.icon]}
          size={30}
          color={earned ? colors.onAccent : colors.textSecondary}
          style={[styles.medallionIcon, !earned && styles.lockedIcon]}
        />
        <View
          style={[
            styles.cornerBadge,
            {
              backgroundColor: colors.background,
              borderColor: earned ? colors.gold : colors.border,
            },
          ]}
          accessibilityLabel={earned ? earnedLabel : lockedLabel}
        >
          <Ionicons
            name={earned ? 'checkmark' : 'lock-closed'}
            size={11}
            color={earned ? colors.gold : colors.textSecondary}
          />
        </View>
      </View>

      <AppText
        variant="badgeTitle"
        color={earned ? 'textPrimary' : 'textSecondary'}
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </AppText>

      <View style={styles.progressWrap}>
        <SymbolProgressRow count={count} />
      </View>
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
    minHeight: 190,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  medallionWrap: {
    width: 76,
    height: 76,
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
  cornerBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
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
  progressWrap: {
    marginTop: spacing.xs,
    minHeight: 20,
    justifyContent: 'center',
  },
});
