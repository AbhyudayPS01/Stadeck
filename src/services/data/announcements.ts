import type { Announcement, AnnouncementCategory } from '../../types/announcement';
import { pickRandom } from './random';

interface AnnouncementTemplate {
  category: AnnouncementCategory;
  message: string;
  translations: Readonly<Record<string, string>>;
}

/**
 * The simulated venue PA/board feed. Each template carries canned
 * translations for every supported language so one-click translation works
 * deterministically offline; the live path translates with Gemini instead.
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
      'Extra trains will run from Meadowlands Station for 90 minutes after the final whistle. Follow signs to the rail platform from Gates D and E.',
    translations: {
      es: 'Habrá trenes adicionales desde la estación Meadowlands durante 90 minutos tras el pitido final. Siga las señales al andén desde las puertas D y E.',
      fr: 'Des trains supplémentaires partiront de la gare Meadowlands pendant 90 minutes après le coup de sifflet final. Suivez les panneaux vers le quai depuis les portes D et E.',
      pt: 'Trens extras partirão da estação Meadowlands por 90 minutos após o apito final. Siga a sinalização para a plataforma a partir dos portões D e E.',
      de: 'Nach dem Schlusspfiff fahren 90 Minuten lang zusätzliche Züge ab Meadowlands Station. Folgen Sie ab den Toren D und E den Schildern zum Bahnsteig.',
      hi: 'अंतिम सीटी के बाद 90 मिनट तक मेडोलैंड्स स्टेशन से अतिरिक्त ट्रेनें चलेंगी। गेट D और E से रेल प्लेटफ़ॉर्म के संकेतों का पालन करें।',
      ar: 'ستنطلق قطارات إضافية من محطة ميدولاندز لمدة 90 دقيقة بعد صافرة النهاية. اتبعوا اللافتات إلى رصيف القطار من البوابتين D وE.',
      ja: '試合終了後90分間、メドウランズ駅から臨時列車が運行されます。ゲートDとEから案内表示に従いホームへお進みください。',
    },
  },
  {
    category: 'services',
    message:
      'Free water refill stations are available on every concourse. First aid is located next to Sections 112 and 132.',
    translations: {
      es: 'Hay estaciones gratuitas de recarga de agua en todos los pasillos. Los primeros auxilios están junto a las secciones 112 y 132.',
      fr: 'Des fontaines à eau gratuites sont disponibles sur chaque promenoir. Les premiers secours se trouvent près des sections 112 et 132.',
      pt: 'Há estações gratuitas de água em todos os corredores. Os primeiros socorros ficam ao lado das seções 112 e 132.',
      de: 'Kostenlose Wasserstationen finden Sie auf jedem Umlauf. Erste Hilfe befindet sich neben den Blöcken 112 und 132.',
      hi: 'हर कॉन्कोर्स पर मुफ्त पानी रीफिल स्टेशन उपलब्ध हैं। प्राथमिक चिकित्सा सेक्शन 112 और 132 के पास है।',
      ar: 'تتوفر محطات مجانية لإعادة تعبئة المياه في كل ممر. الإسعافات الأولية بجوار القسمين 112 و132.',
      ja: '各コンコースに無料の給水ステーションがあります。応急手当所はセクション112と132の隣にあります。',
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

function fromTemplate(template: AnnouncementTemplate, id: string, issuedAt: string): Announcement {
  return {
    id,
    category: template.category,
    message: template.message,
    translations: template.translations,
    issuedAt,
  };
}

/** Generates one announcement, used by useMockStream to grow the live feed over time. */
export function generateAnnouncement(): Announcement {
  announcementSequence += 1;
  return fromTemplate(
    pickRandom(ANNOUNCEMENT_TEMPLATES),
    `announcement-${announcementSequence}`,
    new Date().toISOString(),
  );
}

/** The feed as it looks on page load: every template already issued, newest first. */
export function getInitialAnnouncements(): Announcement[] {
  const MINUTES_BETWEEN_SEEDS = 7;
  return ANNOUNCEMENT_TEMPLATES.map((template, index) =>
    fromTemplate(
      template,
      `announcement-seed-${index + 1}`,
      new Date(Date.now() - index * MINUTES_BETWEEN_SEEDS * 60_000).toISOString(),
    ),
  );
}
