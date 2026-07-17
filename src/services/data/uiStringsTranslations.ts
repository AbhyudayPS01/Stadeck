import type { UiStrings } from './uiStrings';
import { AR_STRINGS, HI_STRINGS, JA_STRINGS } from './uiStringsNonLatin';

/**
 * The Latin-script interface-string tables (es, fr, pt, de) and the merged
 * record of all seven non-English languages (see uiStrings.ts for the key
 * contract and English source copy; uiStringsNonLatin.ts for hi, ar, ja).
 * Data only — split so no file crosses the size limit.
 */

const ES_STRINGS: UiStrings = {
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
  'action.send': 'Enviar',
  'action.translate': 'Traducir',
  'action.getDirections': 'Obtener indicaciones',
  'action.planStepFreeRoute': 'Planear ruta sin escalones',
  'action.planExit': 'Planear mi salida',
  'action.getEcoActions': 'Mis ecoacciones',
  'action.generateBriefing': 'Generar informe',
  'action.planScenario': 'Planear escenario',
  'placeholder.conciergeMessage': 'p. ej. ¿Dónde está la Puerta C?',
  'placeholder.destination': 'p. ej. Penn Station, Nueva York',
  'placeholder.scenario': 'p. ej. El tren deja de funcionar 20 minutos antes del final',
  'empty.conciergeIntro':
    'Pregunta lo que quieras sobre el estadio, en cualquier idioma. Prueba una de estas:',
  'empty.announcements': 'Los anuncios del estadio aparecerán aquí cuando se emitan.',
  'empty.incidents': 'Los incidentes reportados aparecerán aquí en tiempo real.',
  'empty.incidentNotSelected':
    'Elige un incidente de la lista para generar acciones inmediatas, notificaciones y criterios de escalada.',
};

const FR_STRINGS: UiStrings = {
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
    "Triez les incidents en direct et obtenez des plans d'action structurés par IA, plus la planification de scénarios hypothétiques.",
  'action.send': 'Envoyer',
  'action.translate': 'Traduire',
  'action.getDirections': "Obtenir l'itinéraire",
  'action.planStepFreeRoute': 'Planifier un itinéraire sans marches',
  'action.planExit': 'Planifier ma sortie',
  'action.getEcoActions': 'Mes écogestes',
  'action.generateBriefing': 'Générer le briefing',
  'action.planScenario': 'Planifier le scénario',
  'placeholder.conciergeMessage': 'p. ex. Où est la Porte C ?',
  'placeholder.destination': 'p. ex. Penn Station, New York',
  'placeholder.scenario': 'p. ex. La ligne ferroviaire tombe en panne 20 minutes avant la fin',
  'empty.conciergeIntro':
    "Posez n'importe quelle question sur le stade, dans n'importe quelle langue. Essayez :",
  'empty.announcements': 'Les annonces du stade apparaîtront ici dès leur diffusion.',
  'empty.incidents': 'Les incidents signalés apparaîtront ici en temps réel.',
  'empty.incidentNotSelected':
    "Choisissez un incident dans le fil pour générer les actions immédiates, les notifications et les critères d'escalade.",
};

const PT_STRINGS: UiStrings = {
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
  'action.send': 'Enviar',
  'action.translate': 'Traduzir',
  'action.getDirections': 'Obter direções',
  'action.planStepFreeRoute': 'Planejar rota sem degraus',
  'action.planExit': 'Planejar minha saída',
  'action.getEcoActions': 'Minhas ecoações',
  'action.generateBriefing': 'Gerar briefing',
  'action.planScenario': 'Planejar cenário',
  'placeholder.conciergeMessage': 'ex.: Onde fica o Portão C?',
  'placeholder.destination': 'ex.: Penn Station, Nova York',
  'placeholder.scenario': 'ex.: O trem para de funcionar 20 minutos antes do fim',
  'empty.conciergeIntro':
    'Pergunte qualquer coisa sobre o estádio, em qualquer idioma. Experimente uma destas:',
  'empty.announcements': 'Os avisos do estádio aparecerão aqui assim que forem emitidos.',
  'empty.incidents': 'Os incidentes relatados aparecerão aqui em tempo real.',
  'empty.incidentNotSelected':
    'Escolha um incidente da lista para gerar ações imediatas, notificações e critérios de escalonamento.',
};

const DE_STRINGS: UiStrings = {
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
  'action.send': 'Senden',
  'action.translate': 'Übersetzen',
  'action.getDirections': 'Route anzeigen',
  'action.planStepFreeRoute': 'Stufenfreie Route planen',
  'action.planExit': 'Abreise planen',
  'action.getEcoActions': 'Meine Öko-Aktionen',
  'action.generateBriefing': 'Briefing erstellen',
  'action.planScenario': 'Szenario planen',
  'placeholder.conciergeMessage': 'z. B. Wo ist Tor C?',
  'placeholder.destination': 'z. B. Penn Station, New York',
  'placeholder.scenario': 'z. B. Die Bahnlinie fällt 20 Minuten vor Schluss aus',
  'empty.conciergeIntro': 'Fragen Sie alles über das Stadion — in jeder Sprache. Zum Beispiel:',
  'empty.announcements': 'Stadiondurchsagen erscheinen hier, sobald sie veröffentlicht werden.',
  'empty.incidents': 'Gemeldete Vorfälle erscheinen hier in Echtzeit.',
  'empty.incidentNotSelected':
    'Wählen Sie einen Vorfall aus der Liste, um Sofortmaßnahmen, Benachrichtigungen und Eskalationskriterien zu erzeugen.',
};

/** Non-English tables keyed by BCP-47 code; merged with English in uiStrings.ts. */
export const UI_STRING_TRANSLATIONS: Readonly<Record<string, UiStrings>> = {
  es: ES_STRINGS,
  fr: FR_STRINGS,
  pt: PT_STRINGS,
  de: DE_STRINGS,
  hi: HI_STRINGS,
  ar: AR_STRINGS,
  ja: JA_STRINGS,
};
