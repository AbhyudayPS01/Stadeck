import type { UiStringTable } from './uiStringsTypes';

/** Operational Intelligence module: KPI board words and the executive briefing. */
export type OperationalIntelligenceStringKey =
  | 'oi.venueKpis'
  | 'oi.kpiOk'
  | 'oi.kpiWatch'
  | 'oi.kpiCritical'
  | 'oi.kpiInfo'
  | 'oi.rising'
  | 'oi.falling'
  | 'oi.steady'
  | 'oi.executiveBriefing'
  | 'oi.briefingIntro'
  | 'action.generateBriefing'
  | 'oi.rebrief'
  | 'oi.writingBriefing'
  | 'oi.briefingFailedTitle'
  | 'oi.briefingFailed'
  | 'oi.anomalies'
  | 'oi.trends';

export const OPERATIONAL_INTELLIGENCE_STRINGS: UiStringTable<OperationalIntelligenceStringKey> = {
  en: {
    'oi.venueKpis': 'Venue KPIs',
    'oi.kpiOk': 'ok',
    'oi.kpiWatch': 'watch',
    'oi.kpiCritical': 'critical',
    'oi.kpiInfo': 'info',
    'oi.rising': '▲ rising',
    'oi.falling': '▼ falling',
    'oi.steady': '→ steady',
    'oi.executiveBriefing': 'Executive briefing',
    'oi.briefingIntro':
      'An AI state-of-venue read over the live KPI board: anomalies to act on and trends to watch.',
    'action.generateBriefing': 'Generate briefing',
    'oi.rebrief': 'Re-brief with latest KPIs',
    'oi.writingBriefing': 'Writing executive briefing',
    'oi.briefingFailedTitle': 'Briefing failed',
    'oi.briefingFailed': 'The executive briefing could not be generated.',
    'oi.anomalies': 'Anomalies to act on',
    'oi.trends': 'Trends to watch',
  },
  es: {
    'oi.venueKpis': 'KPI del estadio',
    'oi.kpiOk': 'bien',
    'oi.kpiWatch': 'vigilar',
    'oi.kpiCritical': 'crítico',
    'oi.kpiInfo': 'info',
    'oi.rising': '▲ subiendo',
    'oi.falling': '▼ bajando',
    'oi.steady': '→ estable',
    'oi.executiveBriefing': 'Informe ejecutivo',
    'oi.briefingIntro':
      'Una lectura de IA del estado del estadio sobre los KPI en vivo: anomalías que atender y tendencias que vigilar.',
    'action.generateBriefing': 'Generar informe',
    'oi.rebrief': 'Actualizar con los últimos KPI',
    'oi.writingBriefing': 'Redactando el informe ejecutivo',
    'oi.briefingFailedTitle': 'Informe fallido',
    'oi.briefingFailed': 'No se pudo generar el informe ejecutivo.',
    'oi.anomalies': 'Anomalías que atender',
    'oi.trends': 'Tendencias que vigilar',
  },
  fr: {
    'oi.venueKpis': 'KPI du stade',
    'oi.kpiOk': 'ok',
    'oi.kpiWatch': 'à surveiller',
    'oi.kpiCritical': 'critique',
    'oi.kpiInfo': 'info',
    'oi.rising': '▲ en hausse',
    'oi.falling': '▼ en baisse',
    'oi.steady': '→ stable',
    'oi.executiveBriefing': 'Briefing exécutif',
    'oi.briefingIntro':
      "Une lecture IA de l'état du stade sur les KPI en direct : anomalies à traiter et tendances à surveiller.",
    'action.generateBriefing': 'Générer le briefing',
    'oi.rebrief': 'Actualiser avec les derniers KPI',
    'oi.writingBriefing': 'Rédaction du briefing exécutif',
    'oi.briefingFailedTitle': 'Briefing échoué',
    'oi.briefingFailed': "Le briefing exécutif n'a pas pu être généré.",
    'oi.anomalies': 'Anomalies à traiter',
    'oi.trends': 'Tendances à surveiller',
  },
  pt: {
    'oi.venueKpis': 'KPIs do estádio',
    'oi.kpiOk': 'ok',
    'oi.kpiWatch': 'observar',
    'oi.kpiCritical': 'crítico',
    'oi.kpiInfo': 'info',
    'oi.rising': '▲ subindo',
    'oi.falling': '▼ caindo',
    'oi.steady': '→ estável',
    'oi.executiveBriefing': 'Briefing executivo',
    'oi.briefingIntro':
      'Uma leitura de IA do estado do estádio sobre os KPIs ao vivo: anomalias a tratar e tendências a observar.',
    'action.generateBriefing': 'Gerar briefing',
    'oi.rebrief': 'Atualizar com os KPIs mais recentes',
    'oi.writingBriefing': 'Escrevendo o briefing executivo',
    'oi.briefingFailedTitle': 'Falha no briefing',
    'oi.briefingFailed': 'Não foi possível gerar o briefing executivo.',
    'oi.anomalies': 'Anomalias a tratar',
    'oi.trends': 'Tendências a observar',
  },
  de: {
    'oi.venueKpis': 'Stadion-KPIs',
    'oi.kpiOk': 'ok',
    'oi.kpiWatch': 'beobachten',
    'oi.kpiCritical': 'kritisch',
    'oi.kpiInfo': 'Info',
    'oi.rising': '▲ steigend',
    'oi.falling': '▼ fallend',
    'oi.steady': '→ stabil',
    'oi.executiveBriefing': 'Executive Briefing',
    'oi.briefingIntro':
      'Eine KI-Lagebeurteilung über die Live-KPIs: Anomalien zum Handeln und Trends zum Beobachten.',
    'action.generateBriefing': 'Briefing erstellen',
    'oi.rebrief': 'Mit neuesten KPIs aktualisieren',
    'oi.writingBriefing': 'Executive Briefing wird geschrieben',
    'oi.briefingFailedTitle': 'Briefing fehlgeschlagen',
    'oi.briefingFailed': 'Das Executive Briefing konnte nicht erstellt werden.',
    'oi.anomalies': 'Anomalien zum Handeln',
    'oi.trends': 'Trends zum Beobachten',
  },
  hi: {
    'oi.venueKpis': 'स्टेडियम KPI',
    'oi.kpiOk': 'ठीक',
    'oi.kpiWatch': 'नज़र रखें',
    'oi.kpiCritical': 'गंभीर',
    'oi.kpiInfo': 'जानकारी',
    'oi.rising': '▲ बढ़ रहा',
    'oi.falling': '▼ घट रहा',
    'oi.steady': '→ स्थिर',
    'oi.executiveBriefing': 'कार्यकारी ब्रीफ़िंग',
    'oi.briefingIntro':
      'लाइव KPI बोर्ड पर स्टेडियम की स्थिति का AI विश्लेषण: कार्रवाई योग्य विसंगतियाँ और नज़र रखने योग्य रुझान।',
    'action.generateBriefing': 'ब्रीफ़िंग बनाएँ',
    'oi.rebrief': 'नवीनतम KPI से अपडेट करें',
    'oi.writingBriefing': 'कार्यकारी ब्रीफ़िंग लिखी जा रही है',
    'oi.briefingFailedTitle': 'ब्रीफ़िंग विफल',
    'oi.briefingFailed': 'कार्यकारी ब्रीफ़िंग तैयार नहीं हो सकी।',
    'oi.anomalies': 'कार्रवाई योग्य विसंगतियाँ',
    'oi.trends': 'नज़र रखने योग्य रुझान',
  },
  ar: {
    'oi.venueKpis': 'مؤشرات أداء الملعب',
    'oi.kpiOk': 'جيد',
    'oi.kpiWatch': 'مراقبة',
    'oi.kpiCritical': 'حرج',
    'oi.kpiInfo': 'معلومة',
    'oi.rising': '▲ صاعد',
    'oi.falling': '▼ هابط',
    'oi.steady': '→ مستقر',
    'oi.executiveBriefing': 'الموجز التنفيذي',
    'oi.briefingIntro':
      'قراءة ذكاء اصطناعي لحالة الملعب عبر مؤشرات الأداء المباشرة: شذوذات تتطلب إجراءً واتجاهات تستحق المراقبة.',
    'action.generateBriefing': 'إنشاء الموجز',
    'oi.rebrief': 'حدّث بأحدث المؤشرات',
    'oi.writingBriefing': 'جارٍ كتابة الموجز التنفيذي',
    'oi.briefingFailedTitle': 'فشل الموجز',
    'oi.briefingFailed': 'تعذّر إنشاء الموجز التنفيذي.',
    'oi.anomalies': 'شذوذات تتطلب إجراءً',
    'oi.trends': 'اتجاهات تستحق المراقبة',
  },
  ja: {
    'oi.venueKpis': 'スタジアムKPI',
    'oi.kpiOk': '正常',
    'oi.kpiWatch': '要注意',
    'oi.kpiCritical': '危険',
    'oi.kpiInfo': '情報',
    'oi.rising': '▲ 上昇',
    'oi.falling': '▼ 下降',
    'oi.steady': '→ 横ばい',
    'oi.executiveBriefing': 'エグゼクティブブリーフィング',
    'oi.briefingIntro': 'ライブKPIボードに基づくAIの状況分析:対応すべき異常と注視すべきトレンド。',
    'action.generateBriefing': 'ブリーフィングを生成',
    'oi.rebrief': '最新KPIで更新',
    'oi.writingBriefing': 'ブリーフィングを作成中',
    'oi.briefingFailedTitle': 'ブリーフィングに失敗しました',
    'oi.briefingFailed': 'エグゼクティブブリーフィングを生成できませんでした。',
    'oi.anomalies': '対応すべき異常',
    'oi.trends': '注視すべきトレンド',
  },
};
