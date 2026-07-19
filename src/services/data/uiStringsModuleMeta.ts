import type { ModuleId } from '../../types/module';
import type { UiStringTable } from './uiStringsTypes';

/** Module titles and descriptions — the sidebar nav and each screen's header. */
export type ModuleMetaStringKey = `module.${ModuleId}.title` | `module.${ModuleId}.description`;

export const MODULE_META_STRINGS: UiStringTable<ModuleMetaStringKey> = {
  en: {
    'module.navigation.title': 'Navigation',
    'module.navigation.description':
      'Turn-by-turn wayfinding to seats, gates, and amenities across MetLife Stadium. Pick your gate and section — or tap them on the map.',
    'module.crowd-management.title': 'Crowd Management',
    'module.crowd-management.description':
      'Live occupancy from simulated sensors across all 96 sections and 8 gates, with AI staff recommendations for keeping the crowd moving.',
    'module.accessibility.title': 'Accessibility',
    'module.accessibility.description':
      'Step-free routes to accessible seating, plain-language announcements, and display settings that apply across the whole app.',
    'module.transportation.title': 'Transportation',
    'module.transportation.description':
      'Beat the post-match rush: live transit options and an AI departure plan tuned to your destination.',
    'module.sustainability.title': 'Sustainability',
    'module.sustainability.description':
      'How the venue is performing right now — and what you can do to lower the matchday footprint.',
    'module.multilingual-assistance.title': 'Multilingual Assistance',
    'module.multilingual-assistance.description':
      'Ask the concierge anything in your own language, and translate venue announcements instantly. AI answers are grounded in verified stadium facts.',
    'module.operational-intelligence.title': 'Operational Intelligence',
    'module.operational-intelligence.description':
      'The operational picture at a glance — live KPIs from every monitored system, with an AI executive briefing on demand.',
    'module.real-time-decision-support.title': 'Real-Time Decision Support',
    'module.real-time-decision-support.description':
      'Triage live incidents and get structured AI action plans — plus what-if scenario planning for organizers.',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Lost & Found',
    'module.lost-and-found.description':
      'Report lost items or check the database of items found around the venue.',
  },
  es: {
    'module.navigation.title': 'Navegación',
    'module.navigation.description':
      'Indicaciones paso a paso hacia asientos, puertas y servicios en el MetLife Stadium. Elige tu puerta y sección, o tócalas en el mapa.',
    'module.crowd-management.title': 'Gestión de Multitudes',
    'module.crowd-management.description':
      'Ocupación en vivo de sensores simulados en las 96 secciones y 8 puertas, con recomendaciones de IA para el personal.',
    'module.accessibility.title': 'Accesibilidad',
    'module.accessibility.description':
      'Rutas sin escalones hacia asientos accesibles, anuncios en lenguaje sencillo y ajustes de pantalla para toda la app.',
    'module.transportation.title': 'Transporte',
    'module.transportation.description':
      'Evita la salida masiva: opciones de transporte en vivo y un plan de salida con IA según tu destino.',
    'module.sustainability.title': 'Sostenibilidad',
    'module.sustainability.description':
      'Cómo va el estadio ahora mismo, y qué puedes hacer para reducir la huella del día del partido.',
    'module.multilingual-assistance.title': 'Asistencia Multilingüe',
    'module.multilingual-assistance.description':
      'Pregunta lo que quieras al conserje en tu idioma y traduce los anuncios del estadio al instante. Las respuestas de IA se basan en datos verificados.',
    'module.operational-intelligence.title': 'Inteligencia Operativa',
    'module.operational-intelligence.description':
      'El panorama operativo de un vistazo: KPI en vivo de cada sistema monitorizado, con informes ejecutivos de IA bajo demanda.',
    'module.real-time-decision-support.title': 'Apoyo a Decisiones en Tiempo Real',
    'module.real-time-decision-support.description':
      'Prioriza incidentes en vivo y obtén planes de acción estructurados de IA, además de planificación de escenarios hipotéticos.',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Objetos Perdidos',
    'module.lost-and-found.description':
      'Reporta un objeto perdido o busca entre los objetos encontrados en el estadio.',
  },
  fr: {
    'module.navigation.title': 'Navigation',
    'module.navigation.description':
      'Itinéraires détaillés vers les sièges, portes et services du MetLife Stadium. Choisissez votre porte et votre section, ou touchez-les sur la carte.',
    'module.crowd-management.title': 'Gestion des Foules',
    'module.crowd-management.description':
      'Occupation en direct des 96 sections et 8 portes via des capteurs simulés, avec recommandations IA pour le personnel.',
    'module.accessibility.title': 'Accessibilité',
    'module.accessibility.description':
      "Itinéraires sans marches vers les places accessibles, annonces en langage simple et réglages d'affichage pour toute l'application.",
    'module.transportation.title': 'Transports',
    'module.transportation.description':
      "Évitez la cohue d'après-match : options de transport en direct et plan de départ IA selon votre destination.",
    'module.sustainability.title': 'Durabilité',
    'module.sustainability.description':
      "Les performances du stade en ce moment — et ce que vous pouvez faire pour réduire l'empreinte du jour de match.",
    'module.multilingual-assistance.title': 'Assistance Multilingue',
    'module.multilingual-assistance.description':
      "Posez vos questions au concierge dans votre langue et traduisez les annonces instantanément. Les réponses IA s'appuient sur des faits vérifiés.",
    'module.operational-intelligence.title': 'Intelligence Opérationnelle',
    'module.operational-intelligence.description':
      "La situation opérationnelle en un coup d'œil : KPI en direct de chaque système surveillé, avec briefing exécutif IA à la demande.",
    'module.real-time-decision-support.title': 'Aide à la Décision en Temps Réel',
    'module.real-time-decision-support.description':
      "Triez les incidents en direct et obtenez des plans d'action structurados par IA, plus la planification de scénarios hypothétiques.",
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Objets Perdus',
    'module.lost-and-found.description':
      'Signalez un objet perdu ou parcourez les objets trouvés dans le stade.',
  },
  pt: {
    'module.navigation.title': 'Navegação',
    'module.navigation.description':
      'Orientação passo a passo até assentos, portões e serviços no MetLife Stadium. Escolha seu portão e seção, ou toque neles no mapa.',
    'module.crowd-management.title': 'Gestão de Multidões',
    'module.crowd-management.description':
      'Ocupação ao vivo de sensores simulados nas 96 seções e 8 portões, com recomendações de IA para a equipe.',
    'module.accessibility.title': 'Acessibilidade',
    'module.accessibility.description':
      'Rotas sem degraus até assentos acessíveis, avisos em linguagem simples e ajustes de exibição para todo o app.',
    'module.transportation.title': 'Transporte',
    'module.transportation.description':
      'Evite a correria pós-jogo: opções de transporte ao vivo e um plano de saída com IA para o seu destino.',
    'module.sustainability.title': 'Sustentabilidade',
    'module.sustainability.description':
      'Como o estádio está se saindo agora — e o que você pode fazer para reduzir a pegada do dia de jogo.',
    'module.multilingual-assistance.title': 'Assistência Multilíngue',
    'module.multilingual-assistance.description':
      'Pergunte o que quiser ao concierge no seu idioma e traduza os avisos do estádio na hora. As respostas de IA se baseiam em fatos verificados.',
    'module.operational-intelligence.title': 'Inteligência Operacional',
    'module.operational-intelligence.description':
      'O panorama operacional em um relance: KPIs ao vivo de cada sistema monitorado, com briefing executivo de IA sob demanda.',
    'module.real-time-decision-support.title': 'Apoio à Decisão em Tempo Real',
    'module.real-time-decision-support.description':
      'Faça a triagem de incidentes ao vivo e receba planos de ação estruturados de IA, além de planejamento de cenários hipotéticos.',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Achados e Perdidos',
    'module.lost-and-found.description':
      'Reporte um item perdido ou navegue pelos itens encontrados no local.',
  },
  de: {
    'module.navigation.title': 'Navigation',
    'module.navigation.description':
      'Schritt-für-Schritt-Wegführung zu Plätzen, Toren und Services im MetLife Stadium. Tor und Block wählen — oder auf der Karte antippen.',
    'module.crowd-management.title': 'Besucherlenkung',
    'module.crowd-management.description':
      'Live-Auslastung aus simulierten Sensoren in allen 96 Blöcken und 8 Toren, mit KI-Empfehlungen für das Personal.',
    'module.accessibility.title': 'Barrierefreiheit',
    'module.accessibility.description':
      'Stufenfreie Wege zu barrierefreien Plätzen, Durchsagen in einfacher Sprache und Anzeigeeinstellungen für die ganze App.',
    'module.transportation.title': 'Transport',
    'module.transportation.description':
      'Dem Ansturm nach dem Spiel zuvorkommen: Live-Verkehrsoptionen und ein KI-Abreiseplan für Ihr Ziel.',
    'module.sustainability.title': 'Nachhaltigkeit',
    'module.sustainability.description':
      'Wie das Stadion gerade abschneidet — und was Sie tun können, um den Fußabdruck am Spieltag zu senken.',
    'module.multilingual-assistance.title': 'Mehrsprachige Hilfe',
    'module.multilingual-assistance.description':
      'Fragen Sie den Concierge in Ihrer Sprache und übersetzen Sie Durchsagen sofort. KI-Antworten stützen sich auf geprüfte Fakten.',
    'module.operational-intelligence.title': 'Operative Intelligenz',
    'module.operational-intelligence.description':
      'Die Lage auf einen Blick: Live-KPIs aller überwachten Systeme, mit KI-Briefing auf Abruf.',
    'module.real-time-decision-support.title': 'Echtzeit-Entscheidungshilfe',
    'module.real-time-decision-support.description':
      'Vorfälle live sichten und strukturierte KI-Maßnahmenpläne erhalten — plus Was-wäre-wenn-Szenarien.',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Fundbüro',
    'module.lost-and-found.description':
      'Melden Sie einen verlorenen Gegenstand oder durchsuchen Sie die im Stadion gefundenen Gegenstände.',
  },
  hi: {
    'module.navigation.title': 'नेविगेशन',
    'module.navigation.description':
      'मेटलाइफ़ स्टेडियम में सीटों, गेटों और सुविधाओं तक कदम-दर-कदम रास्ता। अपना गेट और सेक्शन चुनें — या नक्शे पर टैप करें।',
    'module.crowd-management.title': 'भीड़ प्रबंधन',
    'module.crowd-management.description':
      'सभी 96 सेक्शन और 8 गेटों के सिम्युलेटेड सेंसर से लाइव भीड़ की जानकारी, स्टाफ़ के लिए AI सुझावों के साथ।',
    'module.accessibility.title': 'सुगम्यता',
    'module.accessibility.description':
      'सुलभ सीटों तक बिना सीढ़ी वाले रास्ते, सरल भाषा में घोषणाएँ और पूरे ऐप पर लागू डिस्प्ले सेटिंग्स।',
    'module.transportation.title': 'परिवहन',
    'module.transportation.description':
      'मैच के बाद की भीड़ से बचें: लाइव ट्रांज़िट विकल्प और आपकी मंज़िल के अनुसार AI प्रस्थान योजना।',
    'module.sustainability.title': 'पर्यावरणीय स्थिरता',
    'module.sustainability.description':
      'स्टेडियम का अभी का प्रदर्शन — और मैच के दिन का फ़ुटप्रिंट घटाने के लिए आप क्या कर सकते हैं।',
    'module.multilingual-assistance.title': 'बहुभाषी सहायता',
    'module.multilingual-assistance.description':
      'अपनी भाषा में कंसीयज़ से कुछ भी पूछें और स्टेडियम की घोषणाओं का तुरंत अनुवाद करें। AI उत्तर सत्यापित तथ्यों पर आधारित हैं।',
    'module.operational-intelligence.title': 'परिचालन इंटेलिजेंस',
    'module.operational-intelligence.description':
      'एक नज़र में परिचालन स्थिति: हर निगरानी प्रणाली के लाइव KPI, माँग पर AI कार्यकारी ब्रीफ़िंग के साथ।',
    'module.real-time-decision-support.title': 'रीयल-टाइम निर्णय सहायता',
    'module.real-time-decision-support.description':
      'लाइव घटनाओं को प्राथमिकता दें और संरचित AI कार्य-योजनाएँ पाएँ — साथ ही काल्पनिक परिदृश्यों की योजना।',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'खोया और पाया',
    'module.lost-and-found.description':
      'खोई हुई वस्तु की रिपोर्ट करें या स्टेडियम में मिली हुई वस्तुओं को ब्राउज़ करें।',
  },
  ar: {
    'module.navigation.title': 'التنقل',
    'module.navigation.description':
      'إرشادات خطوة بخطوة إلى المقاعد والبوابات والخدمات في ملعب متلايف. اختر بوابتك وقسمك — أو انقر عليهما في الخريطة.',
    'module.crowd-management.title': 'إدارة الحشود',
    'module.crowd-management.description':
      'الإشغال المباشر من مستشعرات محاكاة في 96 قسمًا و8 بوابات، مع توصيات ذكاء اصطناعي للعاملين.',
    'module.accessibility.title': 'سهولة الوصول',
    'module.accessibility.description':
      'مسارات بلا درج إلى المقاعد الميسّرة، وإعلانات بلغة مبسطة، وإعدادات عرض تسري على التطبيق كله.',
    'module.transportation.title': 'المواصلات',
    'module.transportation.description':
      'تجنّب زحام ما بعد المباراة: خيارات نقل مباشرة وخطة مغادرة بالذكاء الاصطناعي حسب وجهتك.',
    'module.sustainability.title': 'الاستدامة',
    'module.sustainability.description':
      'أداء الملعب الآن — وما يمكنك فعله لتقليل الأثر البيئي في يوم المباراة.',
    'module.multilingual-assistance.title': 'المساعدة متعددة اللغات',
    'module.multilingual-assistance.description':
      'اسأل الكونسيرج أي شيء بلغتك وترجم إعلانات الملعب فورًا. إجابات الذكاء الاصطناعي مبنية على حقائق موثّقة.',
    'module.operational-intelligence.title': 'الذكاء التشغيلي',
    'module.operational-intelligence.description':
      'الصورة التشغيلية في لمحة: مؤشرات أداء مباشرة لكل نظام مراقب، مع موجز تنفيذي بالذكاء الاصطناعي عند الطلب.',
    'module.real-time-decision-support.title': 'دعم القرار الفوري',
    'module.real-time-decision-support.description':
      'افرز الحوادث المباشرة واحصل على خطط عمل منظمة بالذكاء الاصطناعي، إضافة إلى تخطيط سيناريوهات افتراضية.',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'المفقودات والمعثورات',
    'module.lost-and-found.description':
      'أبلغ عن عنصر مفقود أو تصفح العناصر التي تم العثور عليها في الملعب.',
  },
  ja: {
    'module.navigation.title': 'ナビゲーション',
    'module.navigation.description':
      'メットライフ・スタジアムの座席・ゲート・施設までの道順を案内。ゲートとセクションを選ぶか、マップでタップしてください。',
    'module.crowd-management.title': '混雑管理',
    'module.crowd-management.description':
      '全96セクションと8ゲートのシミュレーションセンサーによるライブ混雑状況と、スタッフ向けAI推奨。',
    'module.accessibility.title': 'アクセシビリティ',
    'module.accessibility.description':
      'バリアフリー席への段差のないルート、やさしい表現への言い換え、アプリ全体の表示設定。',
    'module.transportation.title': '交通',
    'module.transportation.description':
      '試合後の混雑を回避:ライブ交通情報と目的地に合わせたAI帰路プラン。',
    'module.sustainability.title': 'サステナビリティ',
    'module.sustainability.description':
      'スタジアムの現在の環境パフォーマンスと、試合日の環境負荷を減らすためにできること。',
    'module.multilingual-assistance.title': '多言語アシスタンス',
    'module.multilingual-assistance.description':
      '自分の言語でコンシェルジュに質問し、場内アナウンスを即座に翻訳。AIの回答は検証済みの情報に基づきます。',
    'module.operational-intelligence.title': '運営インテリジェンス',
    'module.operational-intelligence.description':
      '運営状況をひと目で:監視中の全システムのライブKPIと、オンデマンドのAIブリーフィング。',
    'module.real-time-decision-support.title': 'リアルタイム意思決定支援',
    'module.real-time-decision-support.description':
      'ライブのインシデントをトリアージし、構造化されたAIアクションプランを取得。仮想シナリオの計画も。',
    'module.emergency-services.title': 'Emergency Services',
    'module.emergency-services.description':
      'Immediate access to report critical incidents and coordinate with on-site police, stewards, and medical teams.',
    'module.lost-and-found.title': 'Lost & Found',
    'module.lost-and-found.description':
      'Report lost items or check the database of items found around the venue.',
  },
};
