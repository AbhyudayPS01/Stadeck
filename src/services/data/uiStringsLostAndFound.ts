import type { UiStringTable } from './uiStringsTypes';

export type LostAndFoundStringKey =
  | 'lostfound.reportLost'
  | 'lostfound.viewFound'
  | 'lostfound.itemName'
  | 'lostfound.itemDescription'
  | 'lostfound.location'
  | 'lostfound.submit'
  | 'lostfound.title'
  | 'lostfound.description';

export const LOST_AND_FOUND_STRINGS: UiStringTable<LostAndFoundStringKey> = {
  en: {
    'lostfound.reportLost': 'Report Lost Item',
    'lostfound.viewFound': 'View Found Items',
    'lostfound.itemName': 'Item Name',
    'lostfound.itemDescription': 'Description',
    'lostfound.location': 'Last Known Location',
    'lostfound.submit': 'Submit Report',
    'lostfound.title': 'Lost & Found',
    'lostfound.description': 'Report a lost item or browse items that have been found at the venue.',
  },
  es: {
    'lostfound.reportLost': 'Reportar Objeto Perdido',
    'lostfound.viewFound': 'Ver Objetos Encontrados',
    'lostfound.itemName': 'Nombre del Objeto',
    'lostfound.itemDescription': 'Descripción',
    'lostfound.location': 'Última Ubicación Conocida',
    'lostfound.submit': 'Enviar Reporte',
    'lostfound.title': 'Objetos Perdidos',
    'lostfound.description': 'Reporta un objeto perdido o busca entre los objetos encontrados en el estadio.',
  },
  fr: {
    'lostfound.reportLost': 'Signaler un Objet Perdu',
    'lostfound.viewFound': 'Voir les Objets Trouvés',
    'lostfound.itemName': 'Nom de l\'Objet',
    'lostfound.itemDescription': 'Description',
    'lostfound.location': 'Dernière Localisation Connue',
    'lostfound.submit': 'Soumettre le Rapport',
    'lostfound.title': 'Objets Perdus',
    'lostfound.description': 'Signalez un objet perdu ou parcourez les objets trouvés dans le stade.',
  },
  pt: {
    'lostfound.reportLost': 'Reportar Item Perdido',
    'lostfound.viewFound': 'Ver Itens Encontrados',
    'lostfound.itemName': 'Nome do Item',
    'lostfound.itemDescription': 'Descrição',
    'lostfound.location': 'Última Localização Conhecida',
    'lostfound.submit': 'Enviar Relatório',
    'lostfound.title': 'Achados e Perdidos',
    'lostfound.description': 'Reporte um item perdido ou navegue pelos itens encontrados no local.',
  },
  de: {
    'lostfound.reportLost': 'Verlorenen Gegenstand Melden',
    'lostfound.viewFound': 'Gefundene Gegenstände Ansehen',
    'lostfound.itemName': 'Gegenstandsname',
    'lostfound.itemDescription': 'Beschreibung',
    'lostfound.location': 'Letzter Bekannter Ort',
    'lostfound.submit': 'Bericht Einreichen',
    'lostfound.title': 'Fundbüro',
    'lostfound.description': 'Melden Sie einen verlorenen Gegenstand oder durchsuchen Sie die im Stadion gefundenen Gegenstände.',
  },
  hi: {
    'lostfound.reportLost': 'खोई हुई वस्तु की रिपोर्ट करें',
    'lostfound.viewFound': 'मिली हुई वस्तुएं देखें',
    'lostfound.itemName': 'वस्तु का नाम',
    'lostfound.itemDescription': 'विवरण',
    'lostfound.location': 'अंतिम ज्ञात स्थान',
    'lostfound.submit': 'रिपोर्ट जमा करें',
    'lostfound.title': 'खोया और पाया',
    'lostfound.description': 'खोई हुई वस्तु की रिपोर्ट करें या स्टेडियम में मिली हुई वस्तुओं को ब्राउज़ करें।',
  },
  ar: {
    'lostfound.reportLost': 'الإبلاغ عن عنصر مفقود',
    'lostfound.viewFound': 'عرض العناصر المعثور عليها',
    'lostfound.itemName': 'اسم العنصر',
    'lostfound.itemDescription': 'الوصف',
    'lostfound.location': 'آخر موقع معروف',
    'lostfound.submit': 'إرسال التقرير',
    'lostfound.title': 'المفقودات والمعثورات',
    'lostfound.description': 'أبلغ عن عنصر مفقود أو تصفح العناصر التي تم العثور عليها في الملعب.',
  },
  ja: {
    'lostfound.reportLost': '遺失物を報告する',
    'lostfound.viewFound': '拾得物を見る',
    'lostfound.itemName': '品名',
    'lostfound.itemDescription': '詳細',
    'lostfound.location': '最後に確認した場所',
    'lostfound.submit': '送信する',
    'lostfound.title': 'お忘れ物センター',
    'lostfound.description': '遺失物を報告するか、会場で発見された拾得物を確認してください。',
  },
};
