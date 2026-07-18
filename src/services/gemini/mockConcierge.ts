import { DEFAULT_VENUE } from '../data/venues';
import type { Venue } from '../../types/venue';
import { venueAnchors } from './mockVenueHelpers';
import type { MultilingualAssistanceResponse } from './responses';

/**
 * Deterministic multilingual concierge fallback, one canned reply per
 * supported language, so the offline demo still auto-detects and answers in
 * the fan's language (detection comes from utils/detectLanguage on this
 * path). The {{firstAidA}}/{{firstAidB}}/{{guestServicesA}}/{{guestServicesB}}
 * tokens are filled in from the active venue's own layout, so the offline
 * concierge never cites a section a fan can't find at their venue.
 */

const ENGLISH_CONCIERGE_REPLY =
  'Happy to help! Gates open three hours before kickoff, first aid is next to sections {{firstAidA}} and {{firstAidB}}, and Guest Services at sections {{guestServicesA}} and {{guestServicesB}} can assist in your language.';

const CONCIERGE_REPLIES: Readonly<Record<string, string>> = {
  en: ENGLISH_CONCIERGE_REPLY,
  es: '¡Con gusto le ayudo! Las puertas abren tres horas antes del partido, los primeros auxilios están junto a las secciones {{firstAidA}} y {{firstAidB}}, y Atención al Cliente (secciones {{guestServicesA}} y {{guestServicesB}}) puede asistirle en su idioma.',
  fr: "Avec plaisir ! Les portes ouvrent trois heures avant le coup d'envoi, les premiers secours se trouvent près des sections {{firstAidA}} et {{firstAidB}}, et le Service Clients (sections {{guestServicesA}} et {{guestServicesB}}) peut vous aider dans votre langue.",
  pt: 'Claro, posso ajudar! Os portões abrem três horas antes do jogo, os primeiros socorros ficam ao lado das seções {{firstAidA}} e {{firstAidB}}, e o Atendimento ao Torcedor (seções {{guestServicesA}} e {{guestServicesB}}) pode ajudar no seu idioma.',
  de: 'Gern helfen wir Ihnen! Die Tore öffnen drei Stunden vor Anpfiff, Erste Hilfe finden Sie neben den Blöcken {{firstAidA}} und {{firstAidB}}, und der Gästeservice (Blöcke {{guestServicesA}} und {{guestServicesB}}) hilft Ihnen in Ihrer Sprache.',
  hi: 'हम आपकी मदद के लिए तैयार हैं! गेट किक-ऑफ़ से तीन घंटे पहले खुलते हैं, प्राथमिक चिकित्सा सेक्शन {{firstAidA}} और {{firstAidB}} के पास है, और गेस्ट सर्विसेज़ (सेक्शन {{guestServicesA}} और {{guestServicesB}}) आपकी भाषा में सहायता कर सकती है।',
  ar: 'يسعدنا مساعدتك! تُفتح البوابات قبل انطلاق المباراة بثلاث ساعات، وتوجد الإسعافات الأولية بجوار القسمين {{firstAidA}} و{{firstAidB}}، ويمكن لخدمات الضيوف (القسمان {{guestServicesA}} و{{guestServicesB}}) مساعدتك بلغتك.',
  ja: '喜んでお手伝いします！ゲートはキックオフの3時間前に開き、応急手当所はセクション{{firstAidA}}と{{firstAidB}}の隣にあります。ゲストサービス（セクション{{guestServicesA}}と{{guestServicesB}}）では多言語でご案内できます。',
};

function applyConciergeTokens(template: string, venue: Venue): string {
  const { firstAid, guestServices } = venueAnchors(venue);
  return template
    .replace('{{firstAidA}}', firstAid[0] ?? '')
    .replace('{{firstAidB}}', firstAid[1] ?? '')
    .replace('{{guestServicesA}}', guestServices[0] ?? '')
    .replace('{{guestServicesB}}', guestServices[1] ?? '');
}

export function mockMultilingualAssistanceResponse(
  language = 'en',
  venue: Venue = DEFAULT_VENUE,
): MultilingualAssistanceResponse {
  const template = CONCIERGE_REPLIES[language];
  return template
    ? { reply: applyConciergeTokens(template, venue), language }
    : { reply: applyConciergeTokens(ENGLISH_CONCIERGE_REPLY, venue), language: 'en' };
}
