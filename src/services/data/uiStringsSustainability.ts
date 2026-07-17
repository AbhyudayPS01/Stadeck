import type { UiStringTable } from './uiStringsTypes';

/** Sustainability module: dashboard tiles, eco actions, and the organizer report. */
export type SustainabilityStringKey =
  | 'sustainability.venueDashboard'
  | 'sustainability.wasteDiverted'
  | 'sustainability.wasteCaption'
  | 'sustainability.renewableEnergy'
  | 'sustainability.renewableCaption'
  | 'sustainability.waterUsed'
  | 'sustainability.waterCaption'
  | 'sustainability.carbonOffset'
  | 'sustainability.carbonCaption'
  | 'sustainability.transitShare'
  | 'sustainability.transitCaption'
  | 'sustainability.crowdCarbon'
  | 'sustainability.crowdCarbonCaption'
  | 'sustainability.yourEcoActions'
  | 'sustainability.ecoIntro'
  | 'action.getEcoActions'
  | 'sustainability.findingActions'
  | 'sustainability.ecoUnavailable'
  | 'sustainability.ecoError'
  | 'sustainability.matchReport'
  | 'sustainability.reportIntro'
  | 'sustainability.generateReport'
  | 'sustainability.writingReport'
  | 'sustainability.reportUnavailable'
  | 'sustainability.reportError'
  | 'sustainability.highlights'
  | 'sustainability.nextMatch';

export const SUSTAINABILITY_STRINGS: UiStringTable<SustainabilityStringKey> = {
  en: {
    'sustainability.venueDashboard': 'Venue dashboard',
    'sustainability.wasteDiverted': 'Waste diverted',
    'sustainability.wasteCaption': 'of matchday waste',
    'sustainability.renewableEnergy': 'Renewable energy',
    'sustainability.renewableCaption': 'of current venue draw',
    'sustainability.waterUsed': 'Water used',
    'sustainability.waterCaption': 'so far today',
    'sustainability.carbonOffset': 'Carbon offset',
    'sustainability.carbonCaption': 'purchased for this match',
    'sustainability.transitShare': 'Transit share',
    'sustainability.transitCaption': 'fans arriving by rail, bus, or shuttle',
    'sustainability.crowdCarbon': 'Crowd carbon',
    'sustainability.crowdCarbonCaption': 'est. travel footprint for {count} fans',
    'sustainability.yourEcoActions': 'Your eco actions',
    'sustainability.ecoIntro':
      "Get 3-4 concrete actions you can take right now, based on today's live venue metrics.",
    'action.getEcoActions': 'Get my eco actions',
    'sustainability.findingActions': 'Finding eco actions',
    'sustainability.ecoUnavailable': 'Eco actions unavailable',
    'sustainability.ecoError': 'Your eco actions could not be generated.',
    'sustainability.matchReport': 'Match report',
    'sustainability.reportIntro':
      'An AI report for organizers: headline verdict, highlights, and what to improve for the next match.',
    'sustainability.generateReport': 'Generate match report',
    'sustainability.writingReport': 'Writing match report',
    'sustainability.reportUnavailable': 'Report unavailable',
    'sustainability.reportError': 'The sustainability match report could not be generated.',
    'sustainability.highlights': 'Highlights',
    'sustainability.nextMatch': 'For the next match',
  },
  es: {
    'sustainability.venueDashboard': 'Panel del estadio',
    'sustainability.wasteDiverted': 'Residuos desviados',
    'sustainability.wasteCaption': 'de los residuos del partido',
    'sustainability.renewableEnergy': 'Energía renovable',
    'sustainability.renewableCaption': 'del consumo actual del estadio',
    'sustainability.waterUsed': 'Agua utilizada',
    'sustainability.waterCaption': 'en lo que va del día',
    'sustainability.carbonOffset': 'Compensación de carbono',
    'sustainability.carbonCaption': 'adquirida para este partido',
    'sustainability.transitShare': 'Cuota de transporte público',
    'sustainability.transitCaption': 'aficionados que llegan en tren, bus o lanzadera',
    'sustainability.crowdCarbon': 'Carbono del público',
    'sustainability.crowdCarbonCaption': 'huella de viaje estimada de {count} aficionados',
    'sustainability.yourEcoActions': 'Tus ecoacciones',
    'sustainability.ecoIntro':
      'Recibe 3-4 acciones concretas que puedes hacer ahora mismo, según las métricas en vivo de hoy.',
    'action.getEcoActions': 'Mis ecoacciones',
    'sustainability.findingActions': 'Buscando ecoacciones',
    'sustainability.ecoUnavailable': 'Ecoacciones no disponibles',
    'sustainability.ecoError': 'No se pudieron generar tus ecoacciones.',
    'sustainability.matchReport': 'Informe del partido',
    'sustainability.reportIntro':
      'Un informe de IA para la organización: veredicto, aspectos destacados y mejoras para el próximo partido.',
    'sustainability.generateReport': 'Generar informe del partido',
    'sustainability.writingReport': 'Redactando el informe',
    'sustainability.reportUnavailable': 'Informe no disponible',
    'sustainability.reportError': 'No se pudo generar el informe de sostenibilidad.',
    'sustainability.highlights': 'Aspectos destacados',
    'sustainability.nextMatch': 'Para el próximo partido',
  },
  fr: {
    'sustainability.venueDashboard': 'Tableau de bord du stade',
    'sustainability.wasteDiverted': 'Déchets valorisés',
    'sustainability.wasteCaption': 'des déchets du jour de match',
    'sustainability.renewableEnergy': 'Énergie renouvelable',
    'sustainability.renewableCaption': 'de la consommation actuelle',
    'sustainability.waterUsed': 'Eau consommée',
    'sustainability.waterCaption': 'depuis ce matin',
    'sustainability.carbonOffset': 'Compensation carbone',
    'sustainability.carbonCaption': 'achetée pour ce match',
    'sustainability.transitShare': 'Part des transports en commun',
    'sustainability.transitCaption': 'supporters arrivés en train, bus ou navette',
    'sustainability.crowdCarbon': 'Carbone du public',
    'sustainability.crowdCarbonCaption': 'empreinte de déplacement estimée pour {count} supporters',
    'sustainability.yourEcoActions': 'Vos écogestes',
    'sustainability.ecoIntro':
      "Recevez 3-4 gestes concrets à faire maintenant, d'après les métriques en direct du jour.",
    'action.getEcoActions': 'Mes écogestes',
    'sustainability.findingActions': 'Recherche des écogestes',
    'sustainability.ecoUnavailable': 'Écogestes indisponibles',
    'sustainability.ecoError': "Vos écogestes n'ont pas pu être générés.",
    'sustainability.matchReport': 'Rapport de match',
    'sustainability.reportIntro':
      "Un rapport IA pour l'organisation : verdict, points forts et améliorations pour le prochain match.",
    'sustainability.generateReport': 'Générer le rapport de match',
    'sustainability.writingReport': 'Rédaction du rapport',
    'sustainability.reportUnavailable': 'Rapport indisponible',
    'sustainability.reportError': "Le rapport de durabilité n'a pas pu être généré.",
    'sustainability.highlights': 'Points forts',
    'sustainability.nextMatch': 'Pour le prochain match',
  },
  pt: {
    'sustainability.venueDashboard': 'Painel do estádio',
    'sustainability.wasteDiverted': 'Resíduos desviados',
    'sustainability.wasteCaption': 'dos resíduos do dia de jogo',
    'sustainability.renewableEnergy': 'Energia renovável',
    'sustainability.renewableCaption': 'do consumo atual do estádio',
    'sustainability.waterUsed': 'Água utilizada',
    'sustainability.waterCaption': 'até agora hoje',
    'sustainability.carbonOffset': 'Compensação de carbono',
    'sustainability.carbonCaption': 'adquirida para este jogo',
    'sustainability.transitShare': 'Parcela de transporte público',
    'sustainability.transitCaption': 'torcedores chegando de trem, ônibus ou shuttle',
    'sustainability.crowdCarbon': 'Carbono do público',
    'sustainability.crowdCarbonCaption': 'pegada de viagem estimada para {count} torcedores',
    'sustainability.yourEcoActions': 'Suas ecoações',
    'sustainability.ecoIntro':
      'Receba 3-4 ações concretas para fazer agora, com base nas métricas ao vivo de hoje.',
    'action.getEcoActions': 'Minhas ecoações',
    'sustainability.findingActions': 'Buscando ecoações',
    'sustainability.ecoUnavailable': 'Ecoações indisponíveis',
    'sustainability.ecoError': 'Não foi possível gerar suas ecoações.',
    'sustainability.matchReport': 'Relatório do jogo',
    'sustainability.reportIntro':
      'Um relatório de IA para a organização: veredicto, destaques e melhorias para o próximo jogo.',
    'sustainability.generateReport': 'Gerar relatório do jogo',
    'sustainability.writingReport': 'Escrevendo o relatório',
    'sustainability.reportUnavailable': 'Relatório indisponível',
    'sustainability.reportError': 'Não foi possível gerar o relatório de sustentabilidade.',
    'sustainability.highlights': 'Destaques',
    'sustainability.nextMatch': 'Para o próximo jogo',
  },
  de: {
    'sustainability.venueDashboard': 'Stadion-Dashboard',
    'sustainability.wasteDiverted': 'Abfall verwertet',
    'sustainability.wasteCaption': 'des Spieltagsabfalls',
    'sustainability.renewableEnergy': 'Erneuerbare Energie',
    'sustainability.renewableCaption': 'des aktuellen Verbrauchs',
    'sustainability.waterUsed': 'Wasserverbrauch',
    'sustainability.waterCaption': 'bisher heute',
    'sustainability.carbonOffset': 'CO₂-Kompensation',
    'sustainability.carbonCaption': 'für dieses Spiel erworben',
    'sustainability.transitShare': 'ÖPNV-Anteil',
    'sustainability.transitCaption': 'Fans, die mit Bahn, Bus oder Shuttle anreisen',
    'sustainability.crowdCarbon': 'CO₂ des Publikums',
    'sustainability.crowdCarbonCaption': 'geschätzter Reise-Fußabdruck für {count} Fans',
    'sustainability.yourEcoActions': 'Ihre Öko-Aktionen',
    'sustainability.ecoIntro':
      'Erhalten Sie 3-4 konkrete Schritte für jetzt, basierend auf den Live-Werten von heute.',
    'action.getEcoActions': 'Meine Öko-Aktionen',
    'sustainability.findingActions': 'Öko-Aktionen werden gesucht',
    'sustainability.ecoUnavailable': 'Öko-Aktionen nicht verfügbar',
    'sustainability.ecoError': 'Ihre Öko-Aktionen konnten nicht erstellt werden.',
    'sustainability.matchReport': 'Spielbericht',
    'sustainability.reportIntro':
      'Ein KI-Bericht für Veranstalter: Fazit, Höhepunkte und Verbesserungen fürs nächste Spiel.',
    'sustainability.generateReport': 'Spielbericht erstellen',
    'sustainability.writingReport': 'Bericht wird geschrieben',
    'sustainability.reportUnavailable': 'Bericht nicht verfügbar',
    'sustainability.reportError': 'Der Nachhaltigkeitsbericht konnte nicht erstellt werden.',
    'sustainability.highlights': 'Höhepunkte',
    'sustainability.nextMatch': 'Fürs nächste Spiel',
  },
  hi: {
    'sustainability.venueDashboard': 'स्टेडियम डैशबोर्ड',
    'sustainability.wasteDiverted': 'रीसाइकल कचरा',
    'sustainability.wasteCaption': 'मैच के दिन के कचरे का',
    'sustainability.renewableEnergy': 'नवीकरणीय ऊर्जा',
    'sustainability.renewableCaption': 'वर्तमान बिजली खपत का',
    'sustainability.waterUsed': 'पानी की खपत',
    'sustainability.waterCaption': 'आज अब तक',
    'sustainability.carbonOffset': 'कार्बन ऑफ़सेट',
    'sustainability.carbonCaption': 'इस मैच के लिए खरीदा गया',
    'sustainability.transitShare': 'सार्वजनिक परिवहन हिस्सा',
    'sustainability.transitCaption': 'ट्रेन, बस या शटल से आने वाले फ़ैन',
    'sustainability.crowdCarbon': 'दर्शकों का कार्बन',
    'sustainability.crowdCarbonCaption': '{count} फ़ैन की अनुमानित यात्रा फ़ुटप्रिंट',
    'sustainability.yourEcoActions': 'आपके इको-कदम',
    'sustainability.ecoIntro': 'आज के लाइव आँकड़ों के आधार पर अभी करने लायक 3-4 ठोस कदम पाएँ।',
    'action.getEcoActions': 'मेरे इको-कदम',
    'sustainability.findingActions': 'इको-कदम खोजे जा रहे हैं',
    'sustainability.ecoUnavailable': 'इको-कदम उपलब्ध नहीं',
    'sustainability.ecoError': 'आपके इको-कदम तैयार नहीं हो सके।',
    'sustainability.matchReport': 'मैच रिपोर्ट',
    'sustainability.reportIntro':
      'आयोजकों के लिए AI रिपोर्ट: निष्कर्ष, मुख्य बातें और अगले मैच के लिए सुधार।',
    'sustainability.generateReport': 'मैच रिपोर्ट बनाएँ',
    'sustainability.writingReport': 'रिपोर्ट लिखी जा रही है',
    'sustainability.reportUnavailable': 'रिपोर्ट उपलब्ध नहीं',
    'sustainability.reportError': 'स्थिरता रिपोर्ट तैयार नहीं हो सकी।',
    'sustainability.highlights': 'मुख्य बातें',
    'sustainability.nextMatch': 'अगले मैच के लिए',
  },
  ar: {
    'sustainability.venueDashboard': 'لوحة الملعب',
    'sustainability.wasteDiverted': 'نفايات معاد تدويرها',
    'sustainability.wasteCaption': 'من نفايات يوم المباراة',
    'sustainability.renewableEnergy': 'طاقة متجددة',
    'sustainability.renewableCaption': 'من استهلاك الملعب الحالي',
    'sustainability.waterUsed': 'المياه المستهلكة',
    'sustainability.waterCaption': 'حتى الآن اليوم',
    'sustainability.carbonOffset': 'تعويض الكربون',
    'sustainability.carbonCaption': 'تم شراؤه لهذه المباراة',
    'sustainability.transitShare': 'حصة النقل العام',
    'sustainability.transitCaption': 'مشجعون يصلون بالقطار أو الحافلة أو المكوك',
    'sustainability.crowdCarbon': 'كربون الجمهور',
    'sustainability.crowdCarbonCaption': 'البصمة التقديرية لتنقل {count} مشجع',
    'sustainability.yourEcoActions': 'إجراءاتك البيئية',
    'sustainability.ecoIntro':
      'احصل على 3-4 خطوات ملموسة يمكنك فعلها الآن، بناءً على مقاييس اليوم المباشرة.',
    'action.getEcoActions': 'إجراءاتي البيئية',
    'sustainability.findingActions': 'جارٍ البحث عن الإجراءات البيئية',
    'sustainability.ecoUnavailable': 'الإجراءات البيئية غير متاحة',
    'sustainability.ecoError': 'تعذّر إنشاء إجراءاتك البيئية.',
    'sustainability.matchReport': 'تقرير المباراة',
    'sustainability.reportIntro':
      'تقرير ذكاء اصطناعي للمنظمين: الخلاصة وأبرز النقاط وما يجب تحسينه للمباراة القادمة.',
    'sustainability.generateReport': 'أنشئ تقرير المباراة',
    'sustainability.writingReport': 'جارٍ كتابة التقرير',
    'sustainability.reportUnavailable': 'التقرير غير متاح',
    'sustainability.reportError': 'تعذّر إنشاء تقرير الاستدامة.',
    'sustainability.highlights': 'أبرز النقاط',
    'sustainability.nextMatch': 'للمباراة القادمة',
  },
  ja: {
    'sustainability.venueDashboard': 'スタジアムダッシュボード',
    'sustainability.wasteDiverted': '廃棄物リサイクル率',
    'sustainability.wasteCaption': '試合日の廃棄物のうち',
    'sustainability.renewableEnergy': '再生可能エネルギー',
    'sustainability.renewableCaption': '現在の消費電力のうち',
    'sustainability.waterUsed': '水使用量',
    'sustainability.waterCaption': '本日ここまで',
    'sustainability.carbonOffset': 'カーボンオフセット',
    'sustainability.carbonCaption': 'この試合のために購入',
    'sustainability.transitShare': '公共交通利用率',
    'sustainability.transitCaption': '鉄道・バス・シャトルで来場したファン',
    'sustainability.crowdCarbon': '観客のCO₂',
    'sustainability.crowdCarbonCaption': 'ファン{count}人の移動による推定排出量',
    'sustainability.yourEcoActions': 'あなたのエコアクション',
    'sustainability.ecoIntro':
      '今日のライブ指標に基づいて、いますぐできる具体的な行動を3〜4つ提案します。',
    'action.getEcoActions': 'エコアクションを見る',
    'sustainability.findingActions': 'エコアクションを検索中',
    'sustainability.ecoUnavailable': 'エコアクションを取得できません',
    'sustainability.ecoError': 'エコアクションを生成できませんでした。',
    'sustainability.matchReport': '試合レポート',
    'sustainability.reportIntro': '主催者向けAIレポート:総評、ハイライト、次の試合への改善点。',
    'sustainability.generateReport': '試合レポートを生成',
    'sustainability.writingReport': 'レポートを作成中',
    'sustainability.reportUnavailable': 'レポートを取得できません',
    'sustainability.reportError': 'サステナビリティレポートを生成できませんでした。',
    'sustainability.highlights': 'ハイライト',
    'sustainability.nextMatch': '次の試合に向けて',
  },
};
