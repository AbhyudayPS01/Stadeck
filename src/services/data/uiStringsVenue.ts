import type { UiStringTable } from './uiStringsTypes';

/**
 * Venue picker and location-assist chrome, shared across all three role
 * views. Venue names and cities are proper nouns and are never translated —
 * they compose into these templates verbatim via formatUiString, the same
 * rule as wayfinding identifiers (see utils/uiText.ts).
 */
export type VenueStringKey =
  | 'venue.label'
  | 'venue.groupUnitedStates'
  | 'venue.groupCanada'
  | 'venue.groupMexico'
  | 'venue.roof.open'
  | 'venue.roof.retractable'
  | 'venue.roof.fixed'
  | 'venue.optionLabel'
  | 'venue.findNearest'
  | 'venue.locating'
  | 'venue.nearestNearby'
  | 'venue.nearestFar';

export const VENUE_STRINGS: UiStringTable<VenueStringKey> = {
  en: {
    'venue.label': 'Match venue',
    'venue.groupUnitedStates': 'United States',
    'venue.groupCanada': 'Canada',
    'venue.groupMexico': 'Mexico',
    'venue.roof.open': 'Open air',
    'venue.roof.retractable': 'Retractable roof',
    'venue.roof.fixed': 'Fixed roof',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'Find nearest venue',
    'venue.locating': 'Finding your venue…',
    'venue.nearestNearby': 'Nearest: {name} in {city}, {distance} away. Switched your view.',
    'venue.nearestFar':
      'Nearest venue: {name}, {distance} away — planning ahead? Choose your match venue below.',
  },
  es: {
    'venue.label': 'Sede del partido',
    'venue.groupUnitedStates': 'Estados Unidos',
    'venue.groupCanada': 'Canadá',
    'venue.groupMexico': 'México',
    'venue.roof.open': 'Al aire libre',
    'venue.roof.retractable': 'Techo retráctil',
    'venue.roof.fixed': 'Techo fijo',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'Buscar la sede más cercana',
    'venue.locating': 'Buscando tu sede…',
    'venue.nearestNearby': 'Más cercana: {name} en {city}, a {distance}. Se cambió tu vista.',
    'venue.nearestFar':
      'Sede más cercana: {name}, a {distance} — ¿planeando con anticipación? Elige tu sede abajo.',
  },
  fr: {
    'venue.label': 'Stade du match',
    'venue.groupUnitedStates': 'États-Unis',
    'venue.groupCanada': 'Canada',
    'venue.groupMexico': 'Mexique',
    'venue.roof.open': 'À ciel ouvert',
    'venue.roof.retractable': 'Toit rétractable',
    'venue.roof.fixed': 'Toit fixe',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'Trouver le stade le plus proche',
    'venue.locating': 'Recherche de votre stade…',
    'venue.nearestNearby':
      'Le plus proche : {name} à {city}, à {distance}. Votre vue a été changée.',
    'venue.nearestFar':
      'Stade le plus proche : {name}, à {distance} — vous planifiez à l’avance ? Choisissez votre stade ci-dessous.',
  },
  pt: {
    'venue.label': 'Sede da partida',
    'venue.groupUnitedStates': 'Estados Unidos',
    'venue.groupCanada': 'Canadá',
    'venue.groupMexico': 'México',
    'venue.roof.open': 'Ao ar livre',
    'venue.roof.retractable': 'Teto retrátil',
    'venue.roof.fixed': 'Teto fixo',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'Encontrar a sede mais próxima',
    'venue.locating': 'Buscando sua sede…',
    'venue.nearestNearby': 'Mais próxima: {name} em {city}, a {distance}. Sua visão foi trocada.',
    'venue.nearestFar':
      'Sede mais próxima: {name}, a {distance} — planejando com antecedência? Escolha sua sede abaixo.',
  },
  de: {
    'venue.label': 'Spielstätte',
    'venue.groupUnitedStates': 'Vereinigte Staaten',
    'venue.groupCanada': 'Kanada',
    'venue.groupMexico': 'Mexiko',
    'venue.roof.open': 'Freiluft',
    'venue.roof.retractable': 'Schiebedach',
    'venue.roof.fixed': 'Festes Dach',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'Nächstgelegene Spielstätte finden',
    'venue.locating': 'Ihre Spielstätte wird gesucht…',
    'venue.nearestNearby':
      'Am nächsten: {name} in {city}, {distance} entfernt. Ihre Ansicht wurde gewechselt.',
    'venue.nearestFar':
      'Nächstgelegene Spielstätte: {name}, {distance} entfernt — planen Sie im Voraus? Wählen Sie unten Ihre Spielstätte.',
  },
  hi: {
    'venue.label': 'मैच स्थल',
    'venue.groupUnitedStates': 'संयुक्त राज्य अमेरिका',
    'venue.groupCanada': 'कनाडा',
    'venue.groupMexico': 'मेक्सिको',
    'venue.roof.open': 'खुली छत',
    'venue.roof.retractable': 'सिकुड़ने वाली छत',
    'venue.roof.fixed': 'स्थायी छत',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'निकटतम स्थल खोजें',
    'venue.locating': 'आपका स्थल खोजा जा रहा है…',
    'venue.nearestNearby': 'निकटतम: {name}, {city} में, {distance} दूर। आपका दृश्य बदल दिया गया।',
    'venue.nearestFar':
      'निकटतम स्थल: {name}, {distance} दूर — पहले से योजना बना रहे हैं? नीचे अपना स्थल चुनें।',
  },
  ar: {
    'venue.label': 'ملعب المباراة',
    'venue.groupUnitedStates': 'الولايات المتحدة',
    'venue.groupCanada': 'كندا',
    'venue.groupMexico': 'المكسيك',
    'venue.roof.open': 'ملعب مكشوف',
    'venue.roof.retractable': 'سقف قابل للطي',
    'venue.roof.fixed': 'سقف ثابت',
    'venue.optionLabel': '{name} — {city} ({capacity} · {roof})',
    'venue.findNearest': 'العثور على أقرب ملعب',
    'venue.locating': 'جارٍ تحديد ملعبك…',
    'venue.nearestNearby': 'الأقرب: {name} في {city}، على بُعد {distance}. تم تغيير عرضك.',
    'venue.nearestFar':
      'أقرب ملعب: {name}، على بُعد {distance} — هل تخطط مسبقًا؟ اختر ملعبك أدناه.',
  },
  ja: {
    'venue.label': '試合会場',
    'venue.groupUnitedStates': 'アメリカ合衆国',
    'venue.groupCanada': 'カナダ',
    'venue.groupMexico': 'メキシコ',
    'venue.roof.open': '屋根なし',
    'venue.roof.retractable': '可動式屋根',
    'venue.roof.fixed': '固定屋根',
    'venue.optionLabel': '{name} — {city}（{capacity}・{roof}）',
    'venue.findNearest': '最寄りの会場を探す',
    'venue.locating': '会場を検索中…',
    'venue.nearestNearby': '最寄り: {city}の{name}、{distance}先。表示を切り替えました。',
    'venue.nearestFar': '最寄りの会場: {name}、{distance}先 — 事前に計画中ですか？下から会場を選んでください。',
  },
};
