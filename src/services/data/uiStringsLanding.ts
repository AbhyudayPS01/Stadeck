import type { UiStringTable } from './uiStringsTypes';

/**
 * Landing role gate: hero copy, role cards, and the demo-access form.
 * "Stadeck", "FIFA World Cup 2026", and the venue name are brand/proper
 * nouns and stay untranslated; the demo access CODES are identifiers.
 */
export type LandingStringKey =
  | 'landing.tagline'
  | 'landing.chooseYourView'
  | 'landing.enterAsFan'
  | 'landing.demoAccessCode'
  | 'landing.enterAccessCode'
  | 'landing.enterWithCode'
  | 'landing.continueWithDemo'
  | 'landing.codeError'
  | 'role.fan.label'
  | 'role.fan.description'
  | 'role.volunteer.label'
  | 'role.volunteer.description'
  | 'role.organizer.label'
  | 'role.organizer.description';

export const LANDING_STRINGS: UiStringTable<LandingStringKey> = {
  en: {
    'landing.tagline':
      'GenAI-powered stadium operations and fan experience — navigation, crowd management, multilingual assistance, and real-time decision support for the 2026 Final.',
    'landing.chooseYourView': 'Choose your view',
    'landing.enterAsFan': 'Enter as Fan',
    'landing.demoAccessCode': 'Demo access code',
    'landing.enterAccessCode': 'Enter access code',
    'landing.enterWithCode': 'Enter with code',
    'landing.continueWithDemo': 'Continue with demo access',
    'landing.codeError': 'That code does not unlock the {role} view.',
    'role.fan.label': 'Fan',
    'role.fan.description':
      'Wayfinding, matchday help, and multilingual assistance — no sign-in needed.',
    'role.volunteer.label': 'Volunteer & Venue Staff',
    'role.volunteer.description':
      'Crowd flow, accessibility support, and live guidance for teams on the concourse.',
    'role.organizer.label': 'Organizer',
    'role.organizer.description':
      'The full operational picture: intelligence, decision support, and every module.',
  },
  es: {
    'landing.tagline':
      'Operaciones de estadio y experiencia del aficionado con IA generativa: navegación, gestión de multitudes, asistencia multilingüe y apoyo a decisiones en tiempo real para la Final 2026.',
    'landing.chooseYourView': 'Elige tu vista',
    'landing.enterAsFan': 'Entrar como aficionado',
    'landing.demoAccessCode': 'Código de acceso de demo',
    'landing.enterAccessCode': 'Introduce el código',
    'landing.enterWithCode': 'Entrar con código',
    'landing.continueWithDemo': 'Continuar con acceso de demo',
    'landing.codeError': 'Ese código no desbloquea la vista {role}.',
    'role.fan.label': 'Aficionado',
    'role.fan.description':
      'Orientación, ayuda el día del partido y asistencia multilingüe — sin registro.',
    'role.volunteer.label': 'Voluntariado y Personal',
    'role.volunteer.description':
      'Flujo de público, apoyo de accesibilidad y guía en vivo para los equipos en el estadio.',
    'role.organizer.label': 'Organización',
    'role.organizer.description':
      'El panorama operativo completo: inteligencia, apoyo a decisiones y todos los módulos.',
  },
  fr: {
    'landing.tagline':
      "Opérations de stade et expérience supporter propulsées par l'IA générative : navigation, gestion des foules, assistance multilingue et aide à la décision en temps réel pour la Finale 2026.",
    'landing.chooseYourView': 'Choisissez votre vue',
    'landing.enterAsFan': 'Entrer comme supporter',
    'landing.demoAccessCode': "Code d'accès démo",
    'landing.enterAccessCode': 'Saisir le code',
    'landing.enterWithCode': 'Entrer avec le code',
    'landing.continueWithDemo': "Continuer avec l'accès démo",
    'landing.codeError': 'Ce code ne déverrouille pas la vue {role}.',
    'role.fan.label': 'Supporter',
    'role.fan.description':
      'Orientation, aide le jour du match et assistance multilingue — sans inscription.',
    'role.volunteer.label': 'Bénévoles et Personnel',
    'role.volunteer.description':
      "Flux du public, aide à l'accessibilité et consignes en direct pour les équipes.",
    'role.organizer.label': 'Organisation',
    'role.organizer.description':
      'La vue opérationnelle complète : intelligence, aide à la décision et tous les modules.',
  },
  pt: {
    'landing.tagline':
      'Operações de estádio e experiência do torcedor com IA generativa: navegação, gestão de multidões, assistência multilíngue e apoio à decisão em tempo real para a Final de 2026.',
    'landing.chooseYourView': 'Escolha sua visão',
    'landing.enterAsFan': 'Entrar como torcedor',
    'landing.demoAccessCode': 'Código de acesso demo',
    'landing.enterAccessCode': 'Digite o código',
    'landing.enterWithCode': 'Entrar com código',
    'landing.continueWithDemo': 'Continuar com acesso demo',
    'landing.codeError': 'Esse código não desbloqueia a visão {role}.',
    'role.fan.label': 'Torcedor',
    'role.fan.description':
      'Orientação, ajuda no dia do jogo e assistência multilíngue — sem cadastro.',
    'role.volunteer.label': 'Voluntários e Equipe',
    'role.volunteer.description':
      'Fluxo do público, apoio de acessibilidade e orientação ao vivo para as equipes.',
    'role.organizer.label': 'Organização',
    'role.organizer.description':
      'O panorama operacional completo: inteligência, apoio à decisão e todos os módulos.',
  },
  de: {
    'landing.tagline':
      'Stadionbetrieb und Fan-Erlebnis mit generativer KI: Navigation, Besucherlenkung, mehrsprachige Hilfe und Echtzeit-Entscheidungshilfe für das Finale 2026.',
    'landing.chooseYourView': 'Ansicht wählen',
    'landing.enterAsFan': 'Als Fan starten',
    'landing.demoAccessCode': 'Demo-Zugangscode',
    'landing.enterAccessCode': 'Code eingeben',
    'landing.enterWithCode': 'Mit Code starten',
    'landing.continueWithDemo': 'Mit Demo-Zugang fortfahren',
    'landing.codeError': 'Dieser Code schaltet die Ansicht {role} nicht frei.',
    'role.fan.label': 'Fan',
    'role.fan.description':
      'Wegführung, Hilfe am Spieltag und mehrsprachige Unterstützung — ohne Anmeldung.',
    'role.volunteer.label': 'Freiwillige & Personal',
    'role.volunteer.description':
      'Besucherströme, Barrierefreiheit und Live-Anweisungen für Teams im Stadion.',
    'role.organizer.label': 'Veranstalter',
    'role.organizer.description':
      'Das vollständige Lagebild: Intelligenz, Entscheidungshilfe und alle Module.',
  },
  hi: {
    'landing.tagline':
      'जनरेटिव AI से संचालित स्टेडियम परिचालन और फ़ैन अनुभव — 2026 फ़ाइनल के लिए नेविगेशन, भीड़ प्रबंधन, बहुभाषी सहायता और रीयल-टाइम निर्णय सहायता।',
    'landing.chooseYourView': 'अपनी भूमिका चुनें',
    'landing.enterAsFan': 'फ़ैन के रूप में प्रवेश करें',
    'landing.demoAccessCode': 'डेमो एक्सेस कोड',
    'landing.enterAccessCode': 'एक्सेस कोड लिखें',
    'landing.enterWithCode': 'कोड से प्रवेश करें',
    'landing.continueWithDemo': 'डेमो एक्सेस से जारी रखें',
    'landing.codeError': 'यह कोड {role} व्यू नहीं खोलता।',
    'role.fan.label': 'फ़ैन',
    'role.fan.description': 'रास्ता खोजना, मैच के दिन की मदद और बहुभाषी सहायता — बिना साइन-इन के।',
    'role.volunteer.label': 'स्वयंसेवक और स्टाफ़',
    'role.volunteer.description':
      'भीड़ का प्रवाह, सुगम्यता सहयोग और स्टेडियम में टीमों के लिए लाइव मार्गदर्शन।',
    'role.organizer.label': 'आयोजक',
    'role.organizer.description': 'पूरी परिचालन तस्वीर: इंटेलिजेंस, निर्णय सहायता और सभी मॉड्यूल।',
  },
  ar: {
    'landing.tagline':
      'تشغيل الملعب وتجربة المشجعين بالذكاء الاصطناعي التوليدي — التنقل وإدارة الحشود والمساعدة متعددة اللغات ودعم القرار الفوري لنهائي 2026.',
    'landing.chooseYourView': 'اختر طريقة العرض',
    'landing.enterAsFan': 'الدخول كمشجع',
    'landing.demoAccessCode': 'رمز الدخول التجريبي',
    'landing.enterAccessCode': 'أدخل رمز الدخول',
    'landing.enterWithCode': 'الدخول بالرمز',
    'landing.continueWithDemo': 'المتابعة بالدخول التجريبي',
    'landing.codeError': 'هذا الرمز لا يفتح عرض {role}.',
    'role.fan.label': 'مشجع',
    'role.fan.description':
      'إرشادات الطريق ومساعدة يوم المباراة ودعم متعدد اللغات — دون تسجيل دخول.',
    'role.volunteer.label': 'المتطوعون والعاملون',
    'role.volunteer.description': 'تدفق الجمهور ودعم سهولة الوصول وتوجيهات مباشرة للفرق في الملعب.',
    'role.organizer.label': 'المنظمون',
    'role.organizer.description': 'الصورة التشغيلية الكاملة: الذكاء ودعم القرار وجميع الوحدات.',
  },
  ja: {
    'landing.tagline':
      '生成AIによるスタジアム運営とファン体験 — 2026年決勝のためのナビゲーション、混雑管理、多言語アシスタンス、リアルタイム意思決定支援。',
    'landing.chooseYourView': 'ビューを選択',
    'landing.enterAsFan': 'ファンとして入る',
    'landing.demoAccessCode': 'デモアクセスコード',
    'landing.enterAccessCode': 'アクセスコードを入力',
    'landing.enterWithCode': 'コードで入る',
    'landing.continueWithDemo': 'デモアクセスで続ける',
    'landing.codeError': 'このコードでは{role}ビューを開けません。',
    'role.fan.label': 'ファン',
    'role.fan.description': '道案内、試合当日のサポート、多言語アシスタンス — サインイン不要。',
    'role.volunteer.label': 'ボランティア・スタッフ',
    'role.volunteer.description':
      '観客の流れ、アクセシビリティ支援、現場チームへのライブガイダンス。',
    'role.organizer.label': '主催者',
    'role.organizer.description':
      '運営の全体像:インテリジェンス、意思決定支援、すべてのモジュール。',
  },
};
