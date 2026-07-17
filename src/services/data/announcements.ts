import type { Announcement, AnnouncementCategory } from '../../types/announcement';
import type { Venue } from '../../types/venue';
import { pickRandom } from './random';
import { getVenueLayout, sectionNumber } from './stadiumLayout';
import { DEFAULT_VENUE } from './venues';

interface AnnouncementTemplate {
  category: AnnouncementCategory;
  message: string;
  translations: Readonly<Record<string, string>>;
}

/**
 * The simulated venue PA/board feed. Each template carries canned
 * translations for every supported language so one-click translation works
 * deterministically offline; the live path translates with Gemini instead.
 * The {{railStation}} token is the bare station proper noun from the venue
 * registry — bare so each translation can attach its own word for "station".
 */
const ANNOUNCEMENT_TEMPLATES: readonly AnnouncementTemplate[] = [
  {
    category: 'match',
    message:
      'Kickoff is at 3:00 PM. Gates are open — please allow extra time for security screening.',
    translations: {
      es: 'El partido comienza a las 15:00. Las puertas están abiertas: llegue con tiempo extra para el control de seguridad.',
      fr: "Le coup d'envoi est à 15 h. Les portes sont ouvertes — prévoyez du temps supplémentaire pour le contrôle de sécurité.",
      pt: 'O jogo começa às 15h. Os portões estão abertos — reserve tempo extra para a inspeção de segurança.',
      de: 'Anpfiff ist um 15:00 Uhr. Die Tore sind geöffnet – bitte planen Sie zusätzliche Zeit für die Sicherheitskontrolle ein.',
      hi: 'किक-ऑफ़ दोपहर 3:00 बजे है। गेट खुल गए हैं — सुरक्षा जांच के लिए अतिरिक्त समय लेकर आएं।',
      ar: 'تبدأ المباراة في الساعة 3:00 مساءً. البوابات مفتوحة — يُرجى تخصيص وقت إضافي للتفتيش الأمني.',
      ja: 'キックオフは午後3時です。ゲートは開いています。セキュリティ検査のため時間に余裕を持ってお越しください。',
    },
  },
  {
    category: 'transit',
    message:
      'Extra trains will run from {{railStation}} Station for 90 minutes after the final whistle. Follow signs to the rail platform from Gates D and E.',
    translations: {
      es: 'Habrá trenes adicionales desde la estación {{railStation}} durante 90 minutos tras el pitido final. Siga las señales al andén desde las puertas D y E.',
      fr: 'Des trains supplémentaires partiront de la gare {{railStation}} pendant 90 minutes après le coup de sifflet final. Suivez les panneaux vers le quai depuis les portes D et E.',
      pt: 'Trens extras partirão da estação {{railStation}} por 90 minutos após o apito final. Siga a sinalização para a plataforma a partir dos portões D e E.',
      de: 'Nach dem Schlusspfiff fahren 90 Minuten lang zusätzliche Züge ab {{railStation}} Station. Folgen Sie ab den Toren D und E den Schildern zum Bahnsteig.',
      hi: 'अंतिम सीटी के बाद 90 मिनट तक {{railStation}} स्टेशन से अतिरिक्त ट्रेनें चलेंगी। गेट D और E से रेल प्लेटफ़ॉर्म के संकेतों का पालन करें।',
      ar: 'ستنطلق قطارات إضافية من محطة {{railStation}} لمدة 90 دقيقة بعد صافرة النهاية. اتبعوا اللافتات إلى رصيف القطار من البوابتين D وE.',
      ja: '試合終了後90分間、{{railStation}}駅から臨時列車が運行されます。ゲートDとEから案内表示に従いホームへお進みください。',
    },
  },
  {
    category: 'services',
    message:
      'Free water refill stations are available on every concourse. First aid is located next to Sections {{firstAidA}} and {{firstAidB}}.',
    translations: {
      es: 'Hay estaciones gratuitas de recarga de agua en todos los pasillos. Los primeros auxilios están junto a las secciones {{firstAidA}} y {{firstAidB}}.',
      fr: 'Des fontaines à eau gratuites sont disponibles sur chaque promenoir. Les premiers secours se trouvent près des sections {{firstAidA}} et {{firstAidB}}.',
      pt: 'Há estações gratuitas de água em todos os corredores. Os primeiros socorros ficam ao lado das seções {{firstAidA}} e {{firstAidB}}.',
      de: 'Kostenlose Wasserstationen finden Sie auf jedem Umlauf. Erste Hilfe befindet sich neben den Blöcken {{firstAidA}} und {{firstAidB}}.',
      hi: 'हर कॉन्कोर्स पर मुफ्त पानी रीफिल स्टेशन उपलब्ध हैं। प्राथमिक चिकित्सा सेक्शन {{firstAidA}} और {{firstAidB}} के पास है।',
      ar: 'تتوفر محطات مجانية لإعادة تعبئة المياه في كل ممر. الإسعافات الأولية بجوار القسمين {{firstAidA}} و{{firstAidB}}.',
      ja: '各コンコースに無料の給水ステーションがあります。応急手当所はセクション{{firstAidA}}と{{firstAidB}}の隣にあります。',
    },
  },
  {
    category: 'safety',
    message:
      'Severe weather is being monitored. In the event of a delay, follow staff instructions and remain in covered concourse areas.',
    translations: {
      es: 'Se está monitoreando el clima severo. En caso de retraso, siga las instrucciones del personal y permanezca en las zonas cubiertas.',
      fr: 'Une météo sévère est sous surveillance. En cas de retard, suivez les consignes du personnel et restez dans les zones couvertes.',
      pt: 'O clima severo está sendo monitorado. Em caso de atraso, siga as instruções da equipe e permaneça nas áreas cobertas.',
      de: 'Unwetter wird beobachtet. Bei einer Verzögerung folgen Sie den Anweisungen des Personals und bleiben Sie in überdachten Bereichen.',
      hi: 'गंभीर मौसम पर नज़र रखी जा रही है। देरी की स्थिति में स्टाफ़ के निर्देशों का पालन करें और ढके हुए क्षेत्रों में रहें।',
      ar: 'تتم مراقبة الطقس القاسي. في حال التأخير، اتبعوا تعليمات الموظفين وابقوا في الممرات المغطاة.',
      ja: '悪天候を監視中です。遅延の際はスタッフの指示に従い、屋根のあるコンコースにお留まりください。',
    },
  },
];

let announcementSequence = 0;

/** Substitution values for the template tokens, all sourced from the venue itself. */
function tokenValuesFor(venue: Venue): Record<string, string> {
  const firstAid = getVenueLayout(venue.id)
    .amenities.filter((amenity) => amenity.type === 'first-aid')
    .map((amenity) => sectionNumber(amenity.sectionId));
  return {
    railStation: venue.rail.station,
    firstAidA: firstAid[0] ?? '',
    firstAidB: firstAid[1] ?? '',
  };
}

function applyTokens(text: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (result, [token, value]) => result.replaceAll(`{{${token}}}`, value),
    text,
  );
}

function fromTemplate(
  template: AnnouncementTemplate,
  venue: Venue,
  id: string,
  issuedAt: string,
): Announcement {
  const tokens = tokenValuesFor(venue);
  return {
    id,
    category: template.category,
    message: applyTokens(template.message, tokens),
    translations: Object.fromEntries(
      Object.entries(template.translations).map(([language, text]) => [
        language,
        applyTokens(text, tokens),
      ]),
    ),
    issuedAt,
  };
}

/**
 * Generates one announcement, used by useMockStream to grow the live feed
 * over time.
 *
 * @param venue The venue issuing the announcement; defaults to the demo venue.
 * @returns A fresh announcement with venue details substituted in.
 */
export function generateAnnouncement(venue: Venue = DEFAULT_VENUE): Announcement {
  announcementSequence += 1;
  return fromTemplate(
    pickRandom(ANNOUNCEMENT_TEMPLATES),
    venue,
    `announcement-${announcementSequence}`,
    new Date().toISOString(),
  );
}

/**
 * The feed as it looks on page load: every template already issued, newest
 * first.
 *
 * @param venue The venue issuing the feed; defaults to the demo venue.
 * @returns One announcement per template.
 */
export function getInitialAnnouncements(venue: Venue = DEFAULT_VENUE): Announcement[] {
  const MINUTES_BETWEEN_SEEDS = 7;
  return ANNOUNCEMENT_TEMPLATES.map((template, index) =>
    fromTemplate(
      template,
      venue,
      `announcement-seed-${index + 1}`,
      new Date(Date.now() - index * MINUTES_BETWEEN_SEEDS * 60_000).toISOString(),
    ),
  );
}
