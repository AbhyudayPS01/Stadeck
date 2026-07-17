import type { AmenityType } from '../../types/stadium';
import type { UiStringTable } from './uiStringsTypes';

/**
 * Stadium-map strings: amenity marker names and popup descriptions (shared
 * with the legend) and seating-tier names. Section numbers and gate letters
 * are wayfinding identifiers and are NEVER part of these tables — see
 * utils/uiText.ts for why they stay exactly as printed on venue signage.
 */
export type MapStringKey =
  | `amenity.${AmenityType}.label`
  | `amenity.${AmenityType}.description`
  | 'tier.lower'
  | 'tier.club'
  | 'tier.upper'
  | 'map.nearSections';

export const MAP_STRINGS: UiStringTable<MapStringKey> = {
  en: {
    'amenity.restroom.label': 'Restroom',
    'amenity.restroom.description': 'Public restrooms on the main concourse.',
    'amenity.food.label': 'Concessions',
    'amenity.food.description': 'Food and drink stands with local and international options.',
    'amenity.water.label': 'Water Refill Station',
    'amenity.water.description': 'Free filtered water available.',
    'amenity.first-aid.label': 'First Aid',
    'amenity.first-aid.description': 'Staffed medical station with trained personnel.',
    'amenity.accessible-seating.label': 'Accessible Seating',
    'amenity.accessible-seating.description':
      'Wheelchair-accessible seating area with companion seats.',
    'amenity.merchandise.label': 'Merchandise',
    'amenity.merchandise.description': 'Official tournament merchandise and souvenirs.',
    'amenity.guest-services.label': 'Guest Services',
    'amenity.guest-services.description':
      'Help desk for tickets, lost and found, and general questions.',
    'amenity.prayer-room.label': 'Prayer & Quiet Room',
    'amenity.prayer-room.description': 'Multi-faith prayer room and sensory quiet space.',
    'amenity.family-reunification.label': 'Family Reunification',
    'amenity.family-reunification.description':
      'Meeting point for separated groups and lost children, staffed by Guest Services.',
    'amenity.emergency-exit.label': 'Emergency Exit',
    'amenity.emergency-exit.description':
      'Follow staff instructions. Do not use during normal operations.',
    'tier.lower': 'lower bowl',
    'tier.club': 'club level',
    'tier.upper': 'upper bowl',
    'map.nearSections': 'Near sections {sections}',
  },
  es: {
    'amenity.restroom.label': 'Baños',
    'amenity.restroom.description': 'Baños públicos en la explanada principal.',
    'amenity.food.label': 'Comida y bebida',
    'amenity.food.description':
      'Puestos de comida y bebida con opciones locales e internacionales.',
    'amenity.water.label': 'Fuente de agua',
    'amenity.water.description': 'Agua filtrada gratuita.',
    'amenity.first-aid.label': 'Primeros auxilios',
    'amenity.first-aid.description': 'Puesto médico atendido por personal capacitado.',
    'amenity.accessible-seating.label': 'Asientos accesibles',
    'amenity.accessible-seating.description':
      'Zona de asientos accesible en silla de ruedas con asientos para acompañantes.',
    'amenity.merchandise.label': 'Tienda oficial',
    'amenity.merchandise.description': 'Productos y recuerdos oficiales del torneo.',
    'amenity.guest-services.label': 'Atención al Cliente',
    'amenity.guest-services.description':
      'Mostrador de ayuda para entradas, objetos perdidos y preguntas generales.',
    'amenity.prayer-room.label': 'Sala de oración y descanso',
    'amenity.prayer-room.description':
      'Sala de oración multiconfesional y espacio tranquilo sensorial.',
    'amenity.family-reunification.label': 'Reunificación familiar',
    'amenity.family-reunification.description':
      'Punto de encuentro para grupos separados y niños perdidos, atendido por Atención al Cliente.',
    'amenity.emergency-exit.label': 'Salida de emergencia',
    'amenity.emergency-exit.description':
      'Siga las instrucciones del personal. No usar en operación normal.',
    'tier.lower': 'grada baja',
    'tier.club': 'nivel club',
    'tier.upper': 'grada alta',
    'map.nearSections': 'Cerca de las secciones {sections}',
  },
  fr: {
    'amenity.restroom.label': 'Toilettes',
    'amenity.restroom.description': 'Toilettes publiques sur la coursive principale.',
    'amenity.food.label': 'Restauration',
    'amenity.food.description':
      'Stands de nourriture et boissons, options locales et internationales.',
    'amenity.water.label': 'Fontaine à eau',
    'amenity.water.description': 'Eau filtrée gratuite.',
    'amenity.first-aid.label': 'Premiers secours',
    'amenity.first-aid.description': 'Poste médical tenu par du personnel formé.',
    'amenity.accessible-seating.label': 'Places accessibles',
    'amenity.accessible-seating.description':
      'Zone de places accessibles en fauteuil roulant avec sièges accompagnants.',
    'amenity.merchandise.label': 'Boutique officielle',
    'amenity.merchandise.description': 'Produits et souvenirs officiels du tournoi.',
    'amenity.guest-services.label': 'Service Clients',
    'amenity.guest-services.description':
      "Comptoir d'aide pour billets, objets trouvés et questions générales.",
    'amenity.prayer-room.label': 'Salle de prière et de calme',
    'amenity.prayer-room.description':
      'Salle de prière multiconfessionnelle et espace calme sensoriel.',
    'amenity.family-reunification.label': 'Regroupement familial',
    'amenity.family-reunification.description':
      'Point de rencontre pour groupes séparés et enfants perdus, tenu par le Service Clients.',
    'amenity.emergency-exit.label': 'Sortie de secours',
    'amenity.emergency-exit.description':
      'Suivez les consignes du personnel. Ne pas utiliser en fonctionnement normal.',
    'tier.lower': 'tribune basse',
    'tier.club': 'niveau club',
    'tier.upper': 'tribune haute',
    'map.nearSections': 'Près des sections {sections}',
  },
  pt: {
    'amenity.restroom.label': 'Banheiros',
    'amenity.restroom.description': 'Banheiros públicos no saguão principal.',
    'amenity.food.label': 'Alimentação',
    'amenity.food.description': 'Barracas de comida e bebida com opções locais e internacionais.',
    'amenity.water.label': 'Ponto de água',
    'amenity.water.description': 'Água filtrada gratuita.',
    'amenity.first-aid.label': 'Primeiros socorros',
    'amenity.first-aid.description': 'Posto médico com equipe treinada.',
    'amenity.accessible-seating.label': 'Assentos acessíveis',
    'amenity.accessible-seating.description':
      'Área de assentos acessível para cadeira de rodas com lugares para acompanhantes.',
    'amenity.merchandise.label': 'Loja oficial',
    'amenity.merchandise.description': 'Produtos e lembranças oficiais do torneio.',
    'amenity.guest-services.label': 'Atendimento ao Torcedor',
    'amenity.guest-services.description':
      'Balcão de ajuda para ingressos, achados e perdidos e dúvidas gerais.',
    'amenity.prayer-room.label': 'Sala de oração e descanso',
    'amenity.prayer-room.description':
      'Sala de oração multirreligiosa e espaço sensorial tranquilo.',
    'amenity.family-reunification.label': 'Reencontro familiar',
    'amenity.family-reunification.description':
      'Ponto de encontro para grupos separados e crianças perdidas, com equipe do Atendimento.',
    'amenity.emergency-exit.label': 'Saída de emergência',
    'amenity.emergency-exit.description':
      'Siga as instruções da equipe. Não use em operação normal.',
    'tier.lower': 'anel inferior',
    'tier.club': 'nível club',
    'tier.upper': 'anel superior',
    'map.nearSections': 'Perto das seções {sections}',
  },
  de: {
    'amenity.restroom.label': 'Toiletten',
    'amenity.restroom.description': 'Öffentliche Toiletten auf dem Hauptumlauf.',
    'amenity.food.label': 'Verpflegung',
    'amenity.food.description':
      'Essens- und Getränkestände mit lokalen und internationalen Optionen.',
    'amenity.water.label': 'Wasserstation',
    'amenity.water.description': 'Kostenloses gefiltertes Wasser.',
    'amenity.first-aid.label': 'Erste Hilfe',
    'amenity.first-aid.description': 'Besetzte Sanitätsstation mit geschultem Personal.',
    'amenity.accessible-seating.label': 'Barrierefreie Plätze',
    'amenity.accessible-seating.description': 'Rollstuhlgerechter Sitzbereich mit Begleitplätzen.',
    'amenity.merchandise.label': 'Fanshop',
    'amenity.merchandise.description': 'Offizielle Turnierartikel und Souvenirs.',
    'amenity.guest-services.label': 'Gästeservice',
    'amenity.guest-services.description':
      'Serviceschalter für Tickets, Fundsachen und allgemeine Fragen.',
    'amenity.prayer-room.label': 'Gebets- & Ruheraum',
    'amenity.prayer-room.description': 'Multireligiöser Gebetsraum und reizarmer Ruhebereich.',
    'amenity.family-reunification.label': 'Familienzusammenführung',
    'amenity.family-reunification.description':
      'Treffpunkt für getrennte Gruppen und verlorene Kinder, betreut vom Gästeservice.',
    'amenity.emergency-exit.label': 'Notausgang',
    'amenity.emergency-exit.description':
      'Anweisungen des Personals befolgen. Nicht im Normalbetrieb benutzen.',
    'tier.lower': 'Unterrang',
    'tier.club': 'Club-Ebene',
    'tier.upper': 'Oberrang',
    'map.nearSections': 'Nahe den Blöcken {sections}',
  },
  hi: {
    'amenity.restroom.label': 'शौचालय',
    'amenity.restroom.description': 'मुख्य कॉनकोर्स पर सार्वजनिक शौचालय।',
    'amenity.food.label': 'खान-पान',
    'amenity.food.description': 'देसी और अंतरराष्ट्रीय विकल्पों वाले खाने-पीने के स्टॉल।',
    'amenity.water.label': 'पेयजल स्टेशन',
    'amenity.water.description': 'मुफ़्त फ़िल्टर किया हुआ पानी उपलब्ध।',
    'amenity.first-aid.label': 'प्राथमिक चिकित्सा',
    'amenity.first-aid.description': 'प्रशिक्षित कर्मचारियों वाला चिकित्सा केंद्र।',
    'amenity.accessible-seating.label': 'सुलभ सीटें',
    'amenity.accessible-seating.description':
      'व्हीलचेयर-सुलभ बैठने की जगह, साथ आए व्यक्ति की सीट सहित।',
    'amenity.merchandise.label': 'आधिकारिक स्टोर',
    'amenity.merchandise.description': 'टूर्नामेंट का आधिकारिक सामान और स्मृति-चिह्न।',
    'amenity.guest-services.label': 'अतिथि सेवा',
    'amenity.guest-services.description': 'टिकट, खोया-पाया और सामान्य सवालों के लिए सहायता डेस्क।',
    'amenity.prayer-room.label': 'प्रार्थना और शांत कक्ष',
    'amenity.prayer-room.description': 'सर्व-धर्म प्रार्थना कक्ष और संवेदी शांत स्थान।',
    'amenity.family-reunification.label': 'परिवार पुनर्मिलन',
    'amenity.family-reunification.description':
      'बिछड़े समूहों और खोए बच्चों के लिए मिलन स्थल, अतिथि सेवा द्वारा संचालित।',
    'amenity.emergency-exit.label': 'आपातकालीन निकास',
    'amenity.emergency-exit.description':
      'स्टाफ़ के निर्देशों का पालन करें। सामान्य स्थिति में उपयोग न करें।',
    'tier.lower': 'निचला स्तर',
    'tier.club': 'क्लब स्तर',
    'tier.upper': 'ऊपरी स्तर',
    'map.nearSections': 'सेक्शन {sections} के पास',
  },
  ar: {
    'amenity.restroom.label': 'دورات المياه',
    'amenity.restroom.description': 'دورات مياه عامة على الممر الرئيسي.',
    'amenity.food.label': 'المأكولات',
    'amenity.food.description': 'أكشاك طعام وشراب بخيارات محلية وعالمية.',
    'amenity.water.label': 'محطة مياه شرب',
    'amenity.water.description': 'مياه مفلترة مجانية.',
    'amenity.first-aid.label': 'الإسعافات الأولية',
    'amenity.first-aid.description': 'نقطة طبية بطاقم مدرّب.',
    'amenity.accessible-seating.label': 'مقاعد ميسّرة',
    'amenity.accessible-seating.description':
      'منطقة مقاعد ميسّرة للكراسي المتحركة مع مقاعد للمرافقين.',
    'amenity.merchandise.label': 'المتجر الرسمي',
    'amenity.merchandise.description': 'منتجات وتذكارات البطولة الرسمية.',
    'amenity.guest-services.label': 'خدمات الضيوف',
    'amenity.guest-services.description': 'مكتب مساعدة للتذاكر والمفقودات والأسئلة العامة.',
    'amenity.prayer-room.label': 'غرفة الصلاة والهدوء',
    'amenity.prayer-room.description': 'غرفة صلاة لجميع الأديان ومساحة هادئة حسّيًا.',
    'amenity.family-reunification.label': 'لمّ شمل العائلة',
    'amenity.family-reunification.description':
      'نقطة التقاء للمجموعات المتفرقة والأطفال التائهين، يشرف عليها فريق خدمات الضيوف.',
    'amenity.emergency-exit.label': 'مخرج الطوارئ',
    'amenity.emergency-exit.description': 'اتبع تعليمات العاملين. لا يُستخدم في الأوضاع العادية.',
    'tier.lower': 'المدرج السفلي',
    'tier.club': 'طابق النخبة',
    'tier.upper': 'المدرج العلوي',
    'map.nearSections': 'قرب الأقسام {sections}',
  },
  ja: {
    'amenity.restroom.label': 'トイレ',
    'amenity.restroom.description': 'メインコンコースの公衆トイレ。',
    'amenity.food.label': '売店',
    'amenity.food.description': '地元・世界各国のメニューを揃えた飲食スタンド。',
    'amenity.water.label': '給水ステーション',
    'amenity.water.description': '無料のろ過水を利用できます。',
    'amenity.first-aid.label': '救護所',
    'amenity.first-aid.description': '訓練を受けたスタッフが常駐する医療ステーション。',
    'amenity.accessible-seating.label': '車いす対応席',
    'amenity.accessible-seating.description': '車いすで利用できる観覧エリア。同伴者席あり。',
    'amenity.merchandise.label': '公式グッズ',
    'amenity.merchandise.description': '大会公式グッズとお土産。',
    'amenity.guest-services.label': 'ゲストサービス',
    'amenity.guest-services.description': 'チケット・落とし物・各種お問い合わせの窓口。',
    'amenity.prayer-room.label': '礼拝・静養室',
    'amenity.prayer-room.description': '多宗教対応の礼拝室と感覚に配慮した静かなスペース。',
    'amenity.family-reunification.label': '家族再会ポイント',
    'amenity.family-reunification.description':
      'はぐれたグループや迷子のための集合場所。ゲストサービスのスタッフが常駐。',
    'amenity.emergency-exit.label': '非常口',
    'amenity.emergency-exit.description':
      'スタッフの指示に従ってください。通常時は使用しないでください。',
    'tier.lower': '下層スタンド',
    'tier.club': 'クラブレベル',
    'tier.upper': '上層スタンド',
    'map.nearSections': 'セクション{sections}付近',
  },
};
