import type { UiStringTable } from './uiStringsTypes';

/** Accessibility module: route planner, Access Companion, and display controls. */
export type AccessibilityStringKey =
  | 'accessibility.routeMap'
  | 'accessibility.routePlanner'
  | 'accessibility.accessibleSeatingArea'
  | 'action.planStepFreeRoute'
  | 'accessibility.planningRoute'
  | 'accessibility.routeUnavailable'
  | 'accessibility.routeError'
  | 'accessibility.atYourSeatingArea'
  | 'accessibility.accessCompanion'
  | 'accessibility.accessCompanionIntro'
  | 'accessibility.plainLanguage'
  | 'accessibility.rewriting'
  | 'accessibility.display'
  | 'accessibility.highContrast'
  | 'accessibility.on'
  | 'accessibility.off'
  | 'accessibility.textSize'
  | 'accessibility.textDefault'
  | 'accessibility.textLarge'
  | 'accessibility.textXLarge';

export const ACCESSIBILITY_STRINGS: UiStringTable<AccessibilityStringKey> = {
  en: {
    'accessibility.routeMap': 'Step-free route map',
    'accessibility.routePlanner': 'Step-free route planner',
    'accessibility.accessibleSeatingArea': 'Accessible seating area',
    'action.planStepFreeRoute': 'Plan step-free route',
    'accessibility.planningRoute': 'Planning step-free route',
    'accessibility.routeUnavailable': 'Route unavailable',
    'accessibility.routeError':
      'The step-free route from {gate} to {section} could not be planned.',
    'accessibility.atYourSeatingArea': 'At your seating area',
    'accessibility.accessCompanion': 'Access Companion',
    'accessibility.accessCompanionIntro':
      'Rewrites any announcement in plain language: short sentences, everyday words.',
    'accessibility.plainLanguage': 'Plain language',
    'accessibility.rewriting': 'Rewriting',
    'accessibility.display': 'Display',
    'accessibility.highContrast': 'High contrast',
    'accessibility.on': 'On',
    'accessibility.off': 'Off',
    'accessibility.textSize': 'Text size',
    'accessibility.textDefault': 'Default',
    'accessibility.textLarge': 'Large',
    'accessibility.textXLarge': 'Extra large',
  },
  es: {
    'accessibility.routeMap': 'Mapa de rutas sin escalones',
    'accessibility.routePlanner': 'Planificador de rutas sin escalones',
    'accessibility.accessibleSeatingArea': 'Zona de asientos accesibles',
    'action.planStepFreeRoute': 'Planear ruta sin escalones',
    'accessibility.planningRoute': 'Planificando la ruta sin escalones',
    'accessibility.routeUnavailable': 'Ruta no disponible',
    'accessibility.routeError': 'No se pudo planear la ruta sin escalones de {gate} a {section}.',
    'accessibility.atYourSeatingArea': 'En tu zona de asientos',
    'accessibility.accessCompanion': 'Asistente de Acceso',
    'accessibility.accessCompanionIntro':
      'Reescribe cualquier anuncio en lenguaje sencillo: frases cortas, palabras cotidianas.',
    'accessibility.plainLanguage': 'Lenguaje sencillo',
    'accessibility.rewriting': 'Reescribiendo',
    'accessibility.display': 'Pantalla',
    'accessibility.highContrast': 'Alto contraste',
    'accessibility.on': 'Activado',
    'accessibility.off': 'Desactivado',
    'accessibility.textSize': 'Tamaño del texto',
    'accessibility.textDefault': 'Normal',
    'accessibility.textLarge': 'Grande',
    'accessibility.textXLarge': 'Muy grande',
  },
  fr: {
    'accessibility.routeMap': 'Plan des itinéraires sans marches',
    'accessibility.routePlanner': "Planificateur d'itinéraire sans marches",
    'accessibility.accessibleSeatingArea': 'Zone de places accessibles',
    'action.planStepFreeRoute': 'Planifier un itinéraire sans marches',
    'accessibility.planningRoute': "Planification de l'itinéraire sans marches",
    'accessibility.routeUnavailable': 'Itinéraire indisponible',
    'accessibility.routeError':
      "L'itinéraire sans marches de {gate} à {section} n'a pas pu être planifié.",
    'accessibility.atYourSeatingArea': 'À votre zone de places',
    'accessibility.accessCompanion': "Compagnon d'Accès",
    'accessibility.accessCompanionIntro':
      'Réécrit toute annonce en langage simple : phrases courtes, mots du quotidien.',
    'accessibility.plainLanguage': 'Langage simple',
    'accessibility.rewriting': 'Réécriture en cours',
    'accessibility.display': 'Affichage',
    'accessibility.highContrast': 'Contraste élevé',
    'accessibility.on': 'Activé',
    'accessibility.off': 'Désactivé',
    'accessibility.textSize': 'Taille du texte',
    'accessibility.textDefault': 'Normale',
    'accessibility.textLarge': 'Grande',
    'accessibility.textXLarge': 'Très grande',
  },
  pt: {
    'accessibility.routeMap': 'Mapa de rotas sem degraus',
    'accessibility.routePlanner': 'Planejador de rota sem degraus',
    'accessibility.accessibleSeatingArea': 'Área de assentos acessíveis',
    'action.planStepFreeRoute': 'Planejar rota sem degraus',
    'accessibility.planningRoute': 'Planejando a rota sem degraus',
    'accessibility.routeUnavailable': 'Rota indisponível',
    'accessibility.routeError':
      'Não foi possível planejar a rota sem degraus de {gate} até {section}.',
    'accessibility.atYourSeatingArea': 'Na sua área de assentos',
    'accessibility.accessCompanion': 'Companheiro de Acesso',
    'accessibility.accessCompanionIntro':
      'Reescreve qualquer aviso em linguagem simples: frases curtas, palavras do dia a dia.',
    'accessibility.plainLanguage': 'Linguagem simples',
    'accessibility.rewriting': 'Reescrevendo',
    'accessibility.display': 'Tela',
    'accessibility.highContrast': 'Alto contraste',
    'accessibility.on': 'Ativado',
    'accessibility.off': 'Desativado',
    'accessibility.textSize': 'Tamanho do texto',
    'accessibility.textDefault': 'Padrão',
    'accessibility.textLarge': 'Grande',
    'accessibility.textXLarge': 'Extragrande',
  },
  de: {
    'accessibility.routeMap': 'Karte der stufenfreien Wege',
    'accessibility.routePlanner': 'Stufenfreier Routenplaner',
    'accessibility.accessibleSeatingArea': 'Barrierefreier Sitzbereich',
    'action.planStepFreeRoute': 'Stufenfreie Route planen',
    'accessibility.planningRoute': 'Stufenfreie Route wird geplant',
    'accessibility.routeUnavailable': 'Route nicht verfügbar',
    'accessibility.routeError':
      'Die stufenfreie Route von {gate} zu {section} konnte nicht geplant werden.',
    'accessibility.atYourSeatingArea': 'An Ihrem Sitzbereich',
    'accessibility.accessCompanion': 'Zugangs-Begleiter',
    'accessibility.accessCompanionIntro':
      'Schreibt jede Durchsage in einfacher Sprache um: kurze Sätze, Alltagswörter.',
    'accessibility.plainLanguage': 'Einfache Sprache',
    'accessibility.rewriting': 'Wird umgeschrieben',
    'accessibility.display': 'Anzeige',
    'accessibility.highContrast': 'Hoher Kontrast',
    'accessibility.on': 'Ein',
    'accessibility.off': 'Aus',
    'accessibility.textSize': 'Textgröße',
    'accessibility.textDefault': 'Standard',
    'accessibility.textLarge': 'Groß',
    'accessibility.textXLarge': 'Sehr groß',
  },
  hi: {
    'accessibility.routeMap': 'बिना सीढ़ी वाले रास्तों का नक्शा',
    'accessibility.routePlanner': 'बिना सीढ़ी वाले रास्ते का योजनाकार',
    'accessibility.accessibleSeatingArea': 'सुलभ सीटों का क्षेत्र',
    'action.planStepFreeRoute': 'बिना सीढ़ी वाला रास्ता बनाएँ',
    'accessibility.planningRoute': 'बिना सीढ़ी वाला रास्ता बन रहा है',
    'accessibility.routeUnavailable': 'रास्ता उपलब्ध नहीं',
    'accessibility.routeError': '{gate} से {section} तक बिना सीढ़ी वाला रास्ता नहीं बन सका।',
    'accessibility.atYourSeatingArea': 'आपकी सीट के पास उपलब्ध',
    'accessibility.accessCompanion': 'सुगम्यता साथी',
    'accessibility.accessCompanionIntro':
      'किसी भी घोषणा को सरल भाषा में लिखता है: छोटे वाक्य, रोज़मर्रा के शब्द।',
    'accessibility.plainLanguage': 'सरल भाषा',
    'accessibility.rewriting': 'सरल किया जा रहा है',
    'accessibility.display': 'डिस्प्ले',
    'accessibility.highContrast': 'उच्च कंट्रास्ट',
    'accessibility.on': 'चालू',
    'accessibility.off': 'बंद',
    'accessibility.textSize': 'अक्षरों का आकार',
    'accessibility.textDefault': 'सामान्य',
    'accessibility.textLarge': 'बड़ा',
    'accessibility.textXLarge': 'बहुत बड़ा',
  },
  ar: {
    'accessibility.routeMap': 'خريطة المسارات بلا درج',
    'accessibility.routePlanner': 'مخطط المسار بلا درج',
    'accessibility.accessibleSeatingArea': 'منطقة المقاعد الميسّرة',
    'action.planStepFreeRoute': 'خطط مسارًا بلا درج',
    'accessibility.planningRoute': 'جارٍ تخطيط المسار بلا درج',
    'accessibility.routeUnavailable': 'المسار غير متاح',
    'accessibility.routeError': 'تعذّر تخطيط المسار بلا درج من {gate} إلى {section}.',
    'accessibility.atYourSeatingArea': 'في منطقة مقعدك',
    'accessibility.accessCompanion': 'رفيق الوصول',
    'accessibility.accessCompanionIntro': 'يعيد صياغة أي إعلان بلغة مبسطة: جمل قصيرة وكلمات يومية.',
    'accessibility.plainLanguage': 'لغة مبسطة',
    'accessibility.rewriting': 'جارٍ إعادة الصياغة',
    'accessibility.display': 'العرض',
    'accessibility.highContrast': 'تباين عالٍ',
    'accessibility.on': 'مفعّل',
    'accessibility.off': 'متوقف',
    'accessibility.textSize': 'حجم النص',
    'accessibility.textDefault': 'افتراضي',
    'accessibility.textLarge': 'كبير',
    'accessibility.textXLarge': 'كبير جدًا',
  },
  ja: {
    'accessibility.routeMap': '段差のないルートマップ',
    'accessibility.routePlanner': '段差のないルートプランナー',
    'accessibility.accessibleSeatingArea': '車いす対応席エリア',
    'action.planStepFreeRoute': '段差のないルートを計画',
    'accessibility.planningRoute': '段差のないルートを計画中',
    'accessibility.routeUnavailable': 'ルートを取得できません',
    'accessibility.routeError': '{gate}から{section}までの段差のないルートを計画できませんでした。',
    'accessibility.atYourSeatingArea': '座席エリアの設備',
    'accessibility.accessCompanion': 'アクセスコンパニオン',
    'accessibility.accessCompanionIntro':
      '場内アナウンスをやさしい表現に言い換えます:短い文、日常の言葉。',
    'accessibility.plainLanguage': 'やさしい表現',
    'accessibility.rewriting': '言い換え中',
    'accessibility.display': '表示設定',
    'accessibility.highContrast': 'ハイコントラスト',
    'accessibility.on': 'オン',
    'accessibility.off': 'オフ',
    'accessibility.textSize': '文字サイズ',
    'accessibility.textDefault': '標準',
    'accessibility.textLarge': '大',
    'accessibility.textXLarge': '特大',
  },
};
