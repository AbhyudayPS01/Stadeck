import type { AnnouncementCategory } from '../../types/announcement';
import type { UiStringTable } from './uiStringsTypes';

/**
 * Multilingual Assistance module: the fan concierge chat and the announcement
 * feed, plus the announcement category badge words (also used by the Access
 * Companion). The volunteer view's strings live in uiStringsVolunteer.ts.
 */
export type MultilingualAssistanceStringKey =
  | 'ml.aiConcierge'
  | 'ml.askAnyLanguage'
  | 'ml.detected'
  | 'ml.typing'
  | 'ml.replyFailedTitle'
  | 'ml.replyFailed'
  | 'action.send'
  | 'placeholder.conciergeMessage'
  | 'empty.conciergeIntro'
  | 'ml.liveAnnouncements'
  | 'ml.pickLanguageHint'
  | 'ml.oneClickTranslates'
  | 'action.translate'
  | 'ml.translating'
  | 'ml.noAnnouncementsTitle'
  | 'empty.announcements'
  | `announcementCategory.${AnnouncementCategory}`;

export const MULTILINGUAL_ASSISTANCE_STRINGS: UiStringTable<MultilingualAssistanceStringKey> = {
  en: {
    'ml.aiConcierge': 'AI concierge',
    'ml.askAnyLanguage': 'Ask in any language',
    'ml.detected': 'Detected:',
    'ml.typing': 'The concierge is typing.',
    'ml.replyFailedTitle': 'Reply failed',
    'ml.replyFailed': 'The concierge could not answer just now.',
    'action.send': 'Send',
    'placeholder.conciergeMessage': 'e.g. Where is Gate C?',
    'empty.conciergeIntro': 'Ask anything about the stadium — in any language. Try one of these:',
    'ml.liveAnnouncements': 'Live announcements',
    'ml.pickLanguageHint': 'Pick a language in the sidebar to translate announcements.',
    'ml.oneClickTranslates': 'One click translates into {language}.',
    'action.translate': 'Translate',
    'ml.translating': 'Translating',
    'ml.noAnnouncementsTitle': 'No announcements yet',
    'empty.announcements': 'Venue announcements will appear here as they are issued.',
    'announcementCategory.match': 'match',
    'announcementCategory.transit': 'transit',
    'announcementCategory.services': 'services',
    'announcementCategory.safety': 'safety',
  },
  es: {
    'ml.aiConcierge': 'Conserje de IA',
    'ml.askAnyLanguage': 'Pregunta en cualquier idioma',
    'ml.detected': 'Detectado:',
    'ml.typing': 'El conserje está escribiendo.',
    'ml.replyFailedTitle': 'Respuesta fallida',
    'ml.replyFailed': 'El conserje no pudo responder en este momento.',
    'action.send': 'Enviar',
    'placeholder.conciergeMessage': 'p. ej. ¿Dónde está la Puerta C?',
    'empty.conciergeIntro':
      'Pregunta lo que quieras sobre el estadio, en cualquier idioma. Prueba una de estas:',
    'ml.liveAnnouncements': 'Anuncios en vivo',
    'ml.pickLanguageHint': 'Elige un idioma en la barra lateral para traducir los anuncios.',
    'ml.oneClickTranslates': 'Un clic traduce al {language}.',
    'action.translate': 'Traducir',
    'ml.translating': 'Traduciendo',
    'ml.noAnnouncementsTitle': 'Aún sin anuncios',
    'empty.announcements': 'Los anuncios del estadio aparecerán aquí cuando se emitan.',
    'announcementCategory.match': 'partido',
    'announcementCategory.transit': 'transporte',
    'announcementCategory.services': 'servicios',
    'announcementCategory.safety': 'seguridad',
  },
  fr: {
    'ml.aiConcierge': 'Concierge IA',
    'ml.askAnyLanguage': "Posez votre question dans n'importe quelle langue",
    'ml.detected': 'Détecté :',
    'ml.typing': 'Le concierge écrit.',
    'ml.replyFailedTitle': 'Réponse échouée',
    'ml.replyFailed': "Le concierge n'a pas pu répondre pour le moment.",
    'action.send': 'Envoyer',
    'placeholder.conciergeMessage': 'p. ex. Où est la Porte C ?',
    'empty.conciergeIntro':
      "Posez n'importe quelle question sur le stade, dans n'importe quelle langue. Essayez :",
    'ml.liveAnnouncements': 'Annonces en direct',
    'ml.pickLanguageHint':
      'Choisissez une langue dans la barre latérale pour traduire les annonces.',
    'ml.oneClickTranslates': 'Un clic traduit en {language}.',
    'action.translate': 'Traduire',
    'ml.translating': 'Traduction en cours',
    'ml.noAnnouncementsTitle': 'Aucune annonce',
    'empty.announcements': 'Les annonces du stade apparaîtront ici dès leur diffusion.',
    'announcementCategory.match': 'match',
    'announcementCategory.transit': 'transports',
    'announcementCategory.services': 'services',
    'announcementCategory.safety': 'sécurité',
  },
  pt: {
    'ml.aiConcierge': 'Concierge de IA',
    'ml.askAnyLanguage': 'Pergunte em qualquer idioma',
    'ml.detected': 'Detectado:',
    'ml.typing': 'O concierge está digitando.',
    'ml.replyFailedTitle': 'Falha na resposta',
    'ml.replyFailed': 'O concierge não conseguiu responder agora.',
    'action.send': 'Enviar',
    'placeholder.conciergeMessage': 'ex.: Onde fica o Portão C?',
    'empty.conciergeIntro':
      'Pergunte qualquer coisa sobre o estádio, em qualquer idioma. Experimente uma destas:',
    'ml.liveAnnouncements': 'Avisos ao vivo',
    'ml.pickLanguageHint': 'Escolha um idioma na barra lateral para traduzir os avisos.',
    'ml.oneClickTranslates': 'Um clique traduz para {language}.',
    'action.translate': 'Traduzir',
    'ml.translating': 'Traduzindo',
    'ml.noAnnouncementsTitle': 'Ainda sem avisos',
    'empty.announcements': 'Os avisos do estádio aparecerão aqui assim que forem emitidos.',
    'announcementCategory.match': 'jogo',
    'announcementCategory.transit': 'transporte',
    'announcementCategory.services': 'serviços',
    'announcementCategory.safety': 'segurança',
  },
  de: {
    'ml.aiConcierge': 'KI-Concierge',
    'ml.askAnyLanguage': 'Fragen Sie in jeder Sprache',
    'ml.detected': 'Erkannt:',
    'ml.typing': 'Der Concierge schreibt.',
    'ml.replyFailedTitle': 'Antwort fehlgeschlagen',
    'ml.replyFailed': 'Der Concierge konnte gerade nicht antworten.',
    'action.send': 'Senden',
    'placeholder.conciergeMessage': 'z. B. Wo ist Tor C?',
    'empty.conciergeIntro': 'Fragen Sie alles über das Stadion — in jeder Sprache. Zum Beispiel:',
    'ml.liveAnnouncements': 'Live-Durchsagen',
    'ml.pickLanguageHint':
      'Wählen Sie in der Seitenleiste eine Sprache, um Durchsagen zu übersetzen.',
    'ml.oneClickTranslates': 'Ein Klick übersetzt auf {language}.',
    'action.translate': 'Übersetzen',
    'ml.translating': 'Wird übersetzt',
    'ml.noAnnouncementsTitle': 'Noch keine Durchsagen',
    'empty.announcements': 'Stadiondurchsagen erscheinen hier, sobald sie veröffentlicht werden.',
    'announcementCategory.match': 'Spiel',
    'announcementCategory.transit': 'Verkehr',
    'announcementCategory.services': 'Service',
    'announcementCategory.safety': 'Sicherheit',
  },
  hi: {
    'ml.aiConcierge': 'AI कंसीयज़',
    'ml.askAnyLanguage': 'किसी भी भाषा में पूछें',
    'ml.detected': 'पहचानी गई:',
    'ml.typing': 'कंसीयज़ लिख रहा है।',
    'ml.replyFailedTitle': 'उत्तर विफल',
    'ml.replyFailed': 'कंसीयज़ अभी उत्तर नहीं दे सका।',
    'action.send': 'भेजें',
    'placeholder.conciergeMessage': 'जैसे: गेट C कहाँ है?',
    'empty.conciergeIntro':
      'स्टेडियम के बारे में कुछ भी पूछें — किसी भी भाषा में। इनमें से एक आज़माएँ:',
    'ml.liveAnnouncements': 'लाइव घोषणाएँ',
    'ml.pickLanguageHint': 'घोषणाओं का अनुवाद करने के लिए साइडबार में भाषा चुनें।',
    'ml.oneClickTranslates': 'एक क्लिक में {language} में अनुवाद।',
    'action.translate': 'अनुवाद करें',
    'ml.translating': 'अनुवाद हो रहा है',
    'ml.noAnnouncementsTitle': 'अभी कोई घोषणा नहीं',
    'empty.announcements': 'स्टेडियम की घोषणाएँ जारी होते ही यहाँ दिखेंगी।',
    'announcementCategory.match': 'मैच',
    'announcementCategory.transit': 'परिवहन',
    'announcementCategory.services': 'सेवाएँ',
    'announcementCategory.safety': 'सुरक्षा',
  },
  ar: {
    'ml.aiConcierge': 'كونسيرج الذكاء الاصطناعي',
    'ml.askAnyLanguage': 'اسأل بأي لغة',
    'ml.detected': 'اللغة المكتشفة:',
    'ml.typing': 'الكونسيرج يكتب.',
    'ml.replyFailedTitle': 'فشل الرد',
    'ml.replyFailed': 'تعذّر على الكونسيرج الرد الآن.',
    'action.send': 'إرسال',
    'placeholder.conciergeMessage': 'مثال: أين البوابة C؟',
    'empty.conciergeIntro': 'اسأل أي شيء عن الملعب — بأي لغة. جرّب أحد هذه الأسئلة:',
    'ml.liveAnnouncements': 'إعلانات مباشرة',
    'ml.pickLanguageHint': 'اختر لغة من الشريط الجانبي لترجمة الإعلانات.',
    'ml.oneClickTranslates': 'نقرة واحدة تترجم إلى {language}.',
    'action.translate': 'ترجمة',
    'ml.translating': 'جارٍ الترجمة',
    'ml.noAnnouncementsTitle': 'لا إعلانات بعد',
    'empty.announcements': 'ستظهر إعلانات الملعب هنا فور صدورها.',
    'announcementCategory.match': 'المباراة',
    'announcementCategory.transit': 'المواصلات',
    'announcementCategory.services': 'الخدمات',
    'announcementCategory.safety': 'السلامة',
  },
  ja: {
    'ml.aiConcierge': 'AIコンシェルジュ',
    'ml.askAnyLanguage': 'どの言語でも質問できます',
    'ml.detected': '検出:',
    'ml.typing': 'コンシェルジュが入力中です。',
    'ml.replyFailedTitle': '返信できませんでした',
    'ml.replyFailed': 'コンシェルジュが現在応答できません。',
    'action.send': '送信',
    'placeholder.conciergeMessage': '例:ゲートCはどこですか?',
    'empty.conciergeIntro': 'スタジアムについて何でも質問してください — どの言語でも。例えば:',
    'ml.liveAnnouncements': 'ライブアナウンス',
    'ml.pickLanguageHint': 'サイドバーで言語を選ぶとアナウンスを翻訳できます。',
    'ml.oneClickTranslates': 'ワンクリックで{language}に翻訳します。',
    'action.translate': '翻訳',
    'ml.translating': '翻訳中',
    'ml.noAnnouncementsTitle': 'まだアナウンスがありません',
    'empty.announcements': '場内アナウンスは発表され次第ここに表示されます。',
    'announcementCategory.match': '試合',
    'announcementCategory.transit': '交通',
    'announcementCategory.services': 'サービス',
    'announcementCategory.safety': '安全',
  },
};
