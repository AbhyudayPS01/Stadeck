import type { UiStringTable } from './uiStringsTypes';

/**
 * Crowd Management module, plus the severity badge words shared by the
 * watchlist, the incident feed, and action-plan priorities.
 */
export type CrowdManagementStringKey =
  | 'crowd.densityMap'
  | 'crowd.busiestZones'
  | 'crowd.zoneSummary'
  | 'crowd.noReadingsTitle'
  | 'crowd.noReadingsMessage'
  | 'crowd.aiRecommendations'
  | 'crowd.analyzeIntro'
  | 'crowd.analyzeCta'
  | 'crowd.reanalyzeCta'
  | 'crowd.analyzing'
  | 'crowd.analysisFailedTitle'
  | 'crowd.analysisFailedMessage'
  | 'crowd.gatesToOpen'
  | 'crowd.stewardRedeployment'
  | 'crowd.congestionForecast'
  | 'crowd.legendNormal'
  | 'crowd.legendElevated'
  | 'crowd.legendCritical'
  | 'severity.normal'
  | 'severity.elevated'
  | 'severity.critical';

export const CROWD_MANAGEMENT_STRINGS: UiStringTable<CrowdManagementStringKey> = {
  en: {
    'crowd.densityMap': 'Density map',
    'crowd.busiestZones': 'Busiest zones',
    'crowd.zoneSummary':
      '{critical} critical · {elevated} elevated · {normal} normal of {total} zones',
    'crowd.noReadingsTitle': 'No readings yet',
    'crowd.noReadingsMessage': 'Sensor readings will appear here as soon as the sweep starts.',
    'crowd.aiRecommendations': 'AI staff recommendations',
    'crowd.analyzeIntro':
      'Run an AI read of the live sensor sweep for gate openings, steward redeployment, and a congestion forecast.',
    'crowd.analyzeCta': 'Analyze current state',
    'crowd.reanalyzeCta': 'Re-analyze with latest readings',
    'crowd.analyzing': 'Analyzing crowd state',
    'crowd.analysisFailedTitle': 'Analysis failed',
    'crowd.analysisFailedMessage': 'The crowd analysis could not be completed.',
    'crowd.gatesToOpen': 'Gates to open',
    'crowd.stewardRedeployment': 'Steward redeployment',
    'crowd.congestionForecast': 'Congestion forecast',
    'crowd.legendNormal': 'Normal — base color',
    'crowd.legendElevated': 'Elevated — gold wash, dashed gate ring',
    'crowd.legendCritical': 'Critical — hatch pattern, pulsing gate ring',
    'severity.normal': 'normal',
    'severity.elevated': 'elevated',
    'severity.critical': 'critical',
  },
  es: {
    'crowd.densityMap': 'Mapa de densidad',
    'crowd.busiestZones': 'Zonas más concurridas',
    'crowd.zoneSummary':
      '{critical} críticas · {elevated} elevadas · {normal} normales de {total} zonas',
    'crowd.noReadingsTitle': 'Aún sin lecturas',
    'crowd.noReadingsMessage':
      'Las lecturas de los sensores aparecerán aquí en cuanto empiece el barrido.',
    'crowd.aiRecommendations': 'Recomendaciones de IA para el personal',
    'crowd.analyzeIntro':
      'Ejecuta una lectura de IA del barrido de sensores: aperturas de puertas, redistribución de personal y pronóstico de congestión.',
    'crowd.analyzeCta': 'Analizar estado actual',
    'crowd.reanalyzeCta': 'Reanalizar con las últimas lecturas',
    'crowd.analyzing': 'Analizando el estado de la multitud',
    'crowd.analysisFailedTitle': 'Análisis fallido',
    'crowd.analysisFailedMessage': 'No se pudo completar el análisis de la multitud.',
    'crowd.gatesToOpen': 'Puertas por abrir',
    'crowd.stewardRedeployment': 'Redistribución del personal',
    'crowd.congestionForecast': 'Pronóstico de congestión',
    'crowd.legendNormal': 'Normal — color base',
    'crowd.legendElevated': 'Elevado — tinte dorado, anillo de puerta discontinuo',
    'crowd.legendCritical': 'Crítico — trama rayada, anillo de puerta pulsante',
    'severity.normal': 'normal',
    'severity.elevated': 'elevado',
    'severity.critical': 'crítico',
  },
  fr: {
    'crowd.densityMap': 'Carte de densité',
    'crowd.busiestZones': 'Zones les plus fréquentées',
    'crowd.zoneSummary':
      '{critical} critiques · {elevated} élevées · {normal} normales sur {total} zones',
    'crowd.noReadingsTitle': 'Aucune mesure',
    'crowd.noReadingsMessage':
      'Les mesures des capteurs apparaîtront ici dès le début du balayage.',
    'crowd.aiRecommendations': 'Recommandations IA pour le personnel',
    'crowd.analyzeIntro':
      "Lancez une lecture IA du balayage des capteurs : ouvertures de portes, redéploiement des stadiers et prévision d'affluence.",
    'crowd.analyzeCta': "Analyser l'état actuel",
    'crowd.reanalyzeCta': 'Réanalyser avec les dernières mesures',
    'crowd.analyzing': 'Analyse de la foule en cours',
    'crowd.analysisFailedTitle': 'Analyse échouée',
    'crowd.analysisFailedMessage': "L'analyse de la foule n'a pas pu aboutir.",
    'crowd.gatesToOpen': 'Portes à ouvrir',
    'crowd.stewardRedeployment': 'Redéploiement des stadiers',
    'crowd.congestionForecast': "Prévision d'affluence",
    'crowd.legendNormal': 'Normal — couleur de base',
    'crowd.legendElevated': 'Élevé — lavis doré, anneau de porte en pointillés',
    'crowd.legendCritical': 'Critique — hachures, anneau de porte pulsant',
    'severity.normal': 'normal',
    'severity.elevated': 'élevé',
    'severity.critical': 'critique',
  },
  pt: {
    'crowd.densityMap': 'Mapa de densidade',
    'crowd.busiestZones': 'Zonas mais cheias',
    'crowd.zoneSummary':
      '{critical} críticas · {elevated} elevadas · {normal} normais de {total} zonas',
    'crowd.noReadingsTitle': 'Ainda sem leituras',
    'crowd.noReadingsMessage':
      'As leituras dos sensores aparecerão aqui assim que a varredura começar.',
    'crowd.aiRecommendations': 'Recomendações de IA para a equipe',
    'crowd.analyzeIntro':
      'Execute uma leitura de IA da varredura de sensores: abertura de portões, remanejamento de equipe e previsão de congestionamento.',
    'crowd.analyzeCta': 'Analisar estado atual',
    'crowd.reanalyzeCta': 'Reanalisar com as leituras mais recentes',
    'crowd.analyzing': 'Analisando o estado da multidão',
    'crowd.analysisFailedTitle': 'Falha na análise',
    'crowd.analysisFailedMessage': 'Não foi possível concluir a análise da multidão.',
    'crowd.gatesToOpen': 'Portões a abrir',
    'crowd.stewardRedeployment': 'Remanejamento da equipe',
    'crowd.congestionForecast': 'Previsão de congestionamento',
    'crowd.legendNormal': 'Normal — cor base',
    'crowd.legendElevated': 'Elevado — tom dourado, anel de portão tracejado',
    'crowd.legendCritical': 'Crítico — hachurado, anel de portão pulsante',
    'severity.normal': 'normal',
    'severity.elevated': 'elevado',
    'severity.critical': 'crítico',
  },
  de: {
    'crowd.densityMap': 'Dichtekarte',
    'crowd.busiestZones': 'Vollste Bereiche',
    'crowd.zoneSummary':
      '{critical} kritisch · {elevated} erhöht · {normal} normal von {total} Zonen',
    'crowd.noReadingsTitle': 'Noch keine Messwerte',
    'crowd.noReadingsMessage': 'Sensormesswerte erscheinen hier, sobald der Durchlauf startet.',
    'crowd.aiRecommendations': 'KI-Empfehlungen für das Personal',
    'crowd.analyzeIntro':
      'KI-Auswertung des Sensordurchlaufs: Toröffnungen, Ordner-Umverteilung und Stauprognose.',
    'crowd.analyzeCta': 'Aktuellen Zustand analysieren',
    'crowd.reanalyzeCta': 'Mit neuesten Messwerten erneut analysieren',
    'crowd.analyzing': 'Besucherlage wird analysiert',
    'crowd.analysisFailedTitle': 'Analyse fehlgeschlagen',
    'crowd.analysisFailedMessage':
      'Die Analyse der Besucherlage konnte nicht abgeschlossen werden.',
    'crowd.gatesToOpen': 'Zu öffnende Tore',
    'crowd.stewardRedeployment': 'Ordner-Umverteilung',
    'crowd.congestionForecast': 'Stauprognose',
    'crowd.legendNormal': 'Normal — Grundfarbe',
    'crowd.legendElevated': 'Erhöht — goldene Fläche, gestrichelter Tor-Ring',
    'crowd.legendCritical': 'Kritisch — Schraffur, pulsierender Tor-Ring',
    'severity.normal': 'normal',
    'severity.elevated': 'erhöht',
    'severity.critical': 'kritisch',
  },
  hi: {
    'crowd.densityMap': 'भीड़ घनत्व नक्शा',
    'crowd.busiestZones': 'सबसे व्यस्त क्षेत्र',
    'crowd.zoneSummary':
      '{total} क्षेत्रों में {critical} गंभीर · {elevated} बढ़े हुए · {normal} सामान्य',
    'crowd.noReadingsTitle': 'अभी कोई रीडिंग नहीं',
    'crowd.noReadingsMessage': 'सेंसर की रीडिंग स्वीप शुरू होते ही यहाँ दिखेंगी।',
    'crowd.aiRecommendations': 'स्टाफ़ के लिए AI सुझाव',
    'crowd.analyzeIntro':
      'लाइव सेंसर स्वीप का AI विश्लेषण चलाएँ: गेट खोलना, स्टाफ़ की तैनाती और भीड़ का पूर्वानुमान।',
    'crowd.analyzeCta': 'वर्तमान स्थिति का विश्लेषण करें',
    'crowd.reanalyzeCta': 'नवीनतम रीडिंग से दोबारा विश्लेषण करें',
    'crowd.analyzing': 'भीड़ की स्थिति का विश्लेषण हो रहा है',
    'crowd.analysisFailedTitle': 'विश्लेषण विफल',
    'crowd.analysisFailedMessage': 'भीड़ का विश्लेषण पूरा नहीं हो सका।',
    'crowd.gatesToOpen': 'खोले जाने वाले गेट',
    'crowd.stewardRedeployment': 'स्टाफ़ की नई तैनाती',
    'crowd.congestionForecast': 'भीड़ का पूर्वानुमान',
    'crowd.legendNormal': 'सामान्य — मूल रंग',
    'crowd.legendElevated': 'बढ़ा हुआ — सुनहरी परत, कटी रेखा वाला गेट-चक्र',
    'crowd.legendCritical': 'गंभीर — धारीदार पैटर्न, धड़कता गेट-चक्र',
    'severity.normal': 'सामान्य',
    'severity.elevated': 'बढ़ा हुआ',
    'severity.critical': 'गंभीर',
  },
  ar: {
    'crowd.densityMap': 'خريطة الكثافة',
    'crowd.busiestZones': 'أكثر المناطق ازدحامًا',
    'crowd.zoneSummary':
      '{critical} حرجة · {elevated} مرتفعة · {normal} طبيعية من أصل {total} منطقة',
    'crowd.noReadingsTitle': 'لا قراءات بعد',
    'crowd.noReadingsMessage': 'ستظهر قراءات المستشعرات هنا فور بدء المسح.',
    'crowd.aiRecommendations': 'توصيات الذكاء الاصطناعي للعاملين',
    'crowd.analyzeIntro':
      'شغّل قراءة ذكاء اصطناعي لمسح المستشعرات: فتح البوابات، وإعادة توزيع المنظمين، وتوقع الازدحام.',
    'crowd.analyzeCta': 'حلّل الوضع الحالي',
    'crowd.reanalyzeCta': 'أعد التحليل بأحدث القراءات',
    'crowd.analyzing': 'جارٍ تحليل حالة الحشود',
    'crowd.analysisFailedTitle': 'فشل التحليل',
    'crowd.analysisFailedMessage': 'تعذّر إكمال تحليل الحشود.',
    'crowd.gatesToOpen': 'بوابات يجب فتحها',
    'crowd.stewardRedeployment': 'إعادة توزيع المنظمين',
    'crowd.congestionForecast': 'توقع الازدحام',
    'crowd.legendNormal': 'طبيعي — اللون الأساسي',
    'crowd.legendElevated': 'مرتفع — طبقة ذهبية وحلقة بوابة متقطعة',
    'crowd.legendCritical': 'حرج — نمط مخطط وحلقة بوابة نابضة',
    'severity.normal': 'طبيعي',
    'severity.elevated': 'مرتفع',
    'severity.critical': 'حرج',
  },
  ja: {
    'crowd.densityMap': '混雑マップ',
    'crowd.busiestZones': '最も混雑しているゾーン',
    'crowd.zoneSummary': '全{total}ゾーン中 危険{critical}・注意{elevated}・通常{normal}',
    'crowd.noReadingsTitle': 'まだ計測がありません',
    'crowd.noReadingsMessage': 'センサーの計測値はスイープ開始とともにここに表示されます。',
    'crowd.aiRecommendations': 'スタッフ向けAI推奨',
    'crowd.analyzeIntro': 'ライブセンサーのAI分析を実行:ゲート開放、係員の再配置、混雑予測。',
    'crowd.analyzeCta': '現在の状況を分析',
    'crowd.reanalyzeCta': '最新の計測で再分析',
    'crowd.analyzing': '混雑状況を分析中',
    'crowd.analysisFailedTitle': '分析に失敗しました',
    'crowd.analysisFailedMessage': '混雑分析を完了できませんでした。',
    'crowd.gatesToOpen': '開放するゲート',
    'crowd.stewardRedeployment': '係員の再配置',
    'crowd.congestionForecast': '混雑予測',
    'crowd.legendNormal': '通常 — 基本色',
    'crowd.legendElevated': '注意 — 金色の塗り、破線のゲートリング',
    'crowd.legendCritical': '危険 — 斜線パターン、点滅するゲートリング',
    'severity.normal': '通常',
    'severity.elevated': '注意',
    'severity.critical': '危険',
  },
};
