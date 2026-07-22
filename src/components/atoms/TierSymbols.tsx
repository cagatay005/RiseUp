import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop } from 'react-native-svg';

import type { SymbolTierKey } from '@/services/BadgeProgressService';

export interface TierSymbolIconProps {
  size?: number;
}

const VIEW_BOX = 24;
const CENTER = VIEW_BOX / 2;

/** Nokta — mat bakır İslami hüsn-i hat noktası (seviye 0). */
function DotSymbol({ size = 20 }: TierSymbolIconProps) {
  const id = 'dotGradient';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}>
      <Defs>
        <RadialGradient id={id} cx="42%" cy="38%" r="65%">
          <Stop offset="0" stopColor="#D08A5B" />
          <Stop offset="0.55" stopColor="#B8703E" />
          <Stop offset="1" stopColor="#7C4425" />
        </RadialGradient>
      </Defs>
      <Circle cx={CENTER} cy={CENTER} r={6} fill={`url(#${id})`} stroke="#5E3319" strokeWidth={0.5} />
    </Svg>
  );
}

/** Hilal — zarif gümüş hilal (seviye 1: 5 nokta birleşince). */
function CrescentSymbol({ size = 20 }: TierSymbolIconProps) {
  const id = 'crescentGradient';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}>
      <Defs>
        <RadialGradient id={id} cx="35%" cy="35%" r="75%">
          <Stop offset="0" stopColor="#EDEFF2" />
          <Stop offset="0.6" stopColor="#B9BEC6" />
          <Stop offset="1" stopColor="#7C7C82" />
        </RadialGradient>
      </Defs>
      <Path
        d="M14 3.5a9 9 0 1 0 0 17 7.2 7.2 0 0 1 0-17Z"
        fill={`url(#${id})`}
        stroke="#7C7C82"
        strokeWidth={0.4}
      />
    </Svg>
  );
}

/** Lale — altın zemin + yakut vurgulu tezhip üslubu lale motifi (seviye 2: 5 hilal birleşince). */
function TulipSymbol({ size = 20 }: TierSymbolIconProps) {
  const goldId = 'tulipGoldGradient';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}>
      <Defs>
        <RadialGradient id={goldId} cx="50%" cy="35%" r="70%">
          <Stop offset="0" stopColor="#F7D488" />
          <Stop offset="0.6" stopColor="#E9C46A" />
          <Stop offset="1" stopColor="#B4863B" />
        </RadialGradient>
      </Defs>
      <Path
        d="M12 4c1.6 1.7 2.8 3.5 2.8 5.6 0 1.1-.4 2-1 2.7 1.9-.2 3.4-1.6 4.2-3.4.6 3-1 6.4-4.2 7.4V19h1.6v1.4H8.6V19h1.6v-2.7c-3.2-1-4.8-4.4-4.2-7.4.8 1.8 2.3 3.2 4.2 3.4-.6-.7-1-1.6-1-2.7C9.2 7.5 10.4 5.7 12 4Z"
        fill={`url(#${goldId})`}
        stroke="#8A5A22"
        strokeWidth={0.4}
      />
      <Circle cx={CENTER} cy={11} r={1.4} fill="#B5253A" />
    </Svg>
  );
}

/** Kandil — parlayan zümrüt camlı yağ kandili (seviye 3: 5 lale birleşince). */
function LanternSymbol({ size = 20 }: TierSymbolIconProps) {
  const glowId = 'lanternGlow';
  const glassId = 'lanternGlass';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}>
      <Defs>
        <RadialGradient id={glowId} cx="50%" cy="52%" r="60%">
          <Stop offset="0" stopColor="#3FBF8F" stopOpacity={0.55} />
          <Stop offset="1" stopColor="#3FBF8F" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={glassId} cx="42%" cy="35%" r="70%">
          <Stop offset="0" stopColor="#8CE8C0" />
          <Stop offset="0.55" stopColor="#2E9E70" />
          <Stop offset="1" stopColor="#166043" />
        </RadialGradient>
      </Defs>
      <Circle cx={CENTER} cy={CENTER} r={11} fill={`url(#${glowId})`} />
      <Line x1={CENTER} y1={2.5} x2={CENTER} y2={5} stroke="#B7955C" strokeWidth={1} />
      <Path
        d="M12 5c2.6 2.1 4.2 4.6 4.2 7.4a4.2 4.2 0 1 1-8.4 0C7.8 9.6 9.4 7.1 12 5Z"
        fill={`url(#${glassId})`}
        stroke="#0F4A32"
        strokeWidth={0.4}
      />
      <Path d="M8.4 15.5h7.2v1.6a3.6 3.6 0 0 1-7.2 0Z" fill="#B7955C" />
    </Svg>
  );
}

/** Nur — katı metal kenarlığı olmayan, ışınları koyu zemine yumuşakça karışan saf ışık (seviye 4: 5 kandil birleşince). */
function NurSymbol({ size = 20 }: TierSymbolIconProps) {
  const coreId = 'nurCore';
  const rays = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}>
      <Defs>
        <RadialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFF6DF" stopOpacity={1} />
          <Stop offset="0.4" stopColor="#F4A261" stopOpacity={0.9} />
          <Stop offset="1" stopColor="#F4A261" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <G opacity={0.75}>
        {rays.map((deg) => (
          <Line
            key={deg}
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER - 11}
            stroke="#F4E0B8"
            strokeWidth={0.8}
            strokeLinecap="round"
            opacity={0.5}
            transform={`rotate(${deg} ${CENTER} ${CENTER})`}
          />
        ))}
      </G>
      <Circle cx={CENTER} cy={CENTER} r={9} fill={`url(#${coreId})`} />
      <Circle cx={CENTER} cy={CENTER} r={2.4} fill="#FFFBEF" />
    </Svg>
  );
}

export interface TierSymbolProps extends TierSymbolIconProps {
  tierKey: SymbolTierKey;
}

/** Rozet ilerleme çarkının 5 seviyesini tek bir bileşenden çizer — bkz. BadgeProgressService. */
export function TierSymbol({ tierKey, size }: TierSymbolProps) {
  switch (tierKey) {
    case 'dot':
      return <DotSymbol size={size} />;
    case 'crescent':
      return <CrescentSymbol size={size} />;
    case 'tulip':
      return <TulipSymbol size={size} />;
    case 'lantern':
      return <LanternSymbol size={size} />;
    case 'nur':
      return <NurSymbol size={size} />;
  }
}
