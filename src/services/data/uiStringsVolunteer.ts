import type { UiStringTable } from './uiStringsTypes';

/** Volunteer quick-answer view of Multilingual Assistance: chips and answer panels. */
export type VolunteerStringKey =
  | 'volunteer.commonQuestions'
  | 'volunteer.introEnglish'
  | 'volunteer.introTranslated'
  | 'volunteer.englishForYou'
  | 'volunteer.showTheFan'
  | 'volunteer.fetching'
  | 'volunteer.answerFailedTitle'
  | 'volunteer.answerFailed'
  | 'volunteer.anythingElse'
  | 'placeholder.volunteerQuestion'
  | 'volunteer.chip.seat'
  | 'volunteer.chip.restroom'
  | 'volunteer.chip.water'
  | 'volunteer.chip.prayer'
  | 'volunteer.chip.halal'
  | 'volunteer.chip.firstAid'
  | 'volunteer.chip.lostChild'
  | 'volunteer.chip.exits'
  | 'volunteer.chip.transit'
  | 'volunteer.chip.cashless'
  | 'volunteer.chip.bags'
  | 'volunteer.chip.reEntry';

export const VOLUNTEER_STRINGS: UiStringTable<VolunteerStringKey> = {
  en: {
    'volunteer.commonQuestions': 'Common questions',
    'volunteer.introEnglish':
      'Tap a question for the grounded answer. Pick a language in the sidebar to also get a show-the-fan translation.',
    'volunteer.introTranslated': 'Tap a question — you read English, the fan reads {language}.',
    'volunteer.englishForYou': 'English — for you',
    'volunteer.showTheFan': '{language} — show the fan',
    'volunteer.fetching': 'Fetching the grounded answer',
    'volunteer.answerFailedTitle': 'Answer failed',
    'volunteer.answerFailed': 'The answer could not be generated just now.',
    'volunteer.anythingElse': 'Anything not on the grid',
    'placeholder.volunteerQuestion': 'e.g. Where is the merchandise stand?',
    'volunteer.chip.seat': 'Find my seat',
    'volunteer.chip.restroom': 'Nearest restroom',
    'volunteer.chip.water': 'Free water',
    'volunteer.chip.prayer': 'Prayer room',
    'volunteer.chip.halal': 'Halal food',
    'volunteer.chip.firstAid': 'First aid',
    'volunteer.chip.lostChild': 'Lost child',
    'volunteer.chip.exits': 'Exits',
    'volunteer.chip.transit': 'Train & rideshare',
    'volunteer.chip.cashless': 'Paying with cash',
    'volunteer.chip.bags': 'Bag policy',
    'volunteer.chip.reEntry': 'Re-entry',
  },
  es: {
    'volunteer.commonQuestions': 'Preguntas frecuentes',
    'volunteer.introEnglish':
      'Toca una pregunta para ver la respuesta verificada. Elige un idioma en la barra lateral para obtener también la traducción para el aficionado.',
    'volunteer.introTranslated':
      'Toca una pregunta: tú lees en inglés y el aficionado lee en {language}.',
    'volunteer.englishForYou': 'Inglés — para ti',
    'volunteer.showTheFan': '{language} — muéstraselo al aficionado',
    'volunteer.fetching': 'Buscando la respuesta verificada',
    'volunteer.answerFailedTitle': 'Respuesta fallida',
    'volunteer.answerFailed': 'No se pudo generar la respuesta en este momento.',
    'volunteer.anythingElse': 'Algo que no esté en la lista',
    'placeholder.volunteerQuestion': 'p. ej. ¿Dónde está la tienda oficial?',
    'volunteer.chip.seat': 'Encontrar mi asiento',
    'volunteer.chip.restroom': 'Baño más cercano',
    'volunteer.chip.water': 'Agua gratis',
    'volunteer.chip.prayer': 'Sala de oración',
    'volunteer.chip.halal': 'Comida halal',
    'volunteer.chip.firstAid': 'Primeros auxilios',
    'volunteer.chip.lostChild': 'Niño perdido',
    'volunteer.chip.exits': 'Salidas',
    'volunteer.chip.transit': 'Tren y transporte',
    'volunteer.chip.cashless': 'Pagar en efectivo',
    'volunteer.chip.bags': 'Política de bolsos',
    'volunteer.chip.reEntry': 'Reingreso',
  },
  fr: {
    'volunteer.commonQuestions': 'Questions fréquentes',
    'volunteer.introEnglish':
      'Touchez une question pour la réponse vérifiée. Choisissez une langue dans la barre latérale pour obtenir aussi la traduction à montrer au supporter.',
    'volunteer.introTranslated':
      'Touchez une question — vous lisez en anglais, le supporter lit en {language}.',
    'volunteer.englishForYou': 'Anglais — pour vous',
    'volunteer.showTheFan': '{language} — à montrer au supporter',
    'volunteer.fetching': 'Recherche de la réponse vérifiée',
    'volunteer.answerFailedTitle': 'Réponse échouée',
    'volunteer.answerFailed': "La réponse n'a pas pu être générée pour le moment.",
    'volunteer.anythingElse': 'Autre chose hors de la grille',
    'placeholder.volunteerQuestion': 'p. ex. Où est la boutique officielle ?',
    'volunteer.chip.seat': 'Trouver ma place',
    'volunteer.chip.restroom': 'Toilettes les plus proches',
    'volunteer.chip.water': 'Eau gratuite',
    'volunteer.chip.prayer': 'Salle de prière',
    'volunteer.chip.halal': 'Nourriture halal',
    'volunteer.chip.firstAid': 'Premiers secours',
    'volunteer.chip.lostChild': 'Enfant perdu',
    'volunteer.chip.exits': 'Sorties',
    'volunteer.chip.transit': 'Train et VTC',
    'volunteer.chip.cashless': 'Payer en espèces',
    'volunteer.chip.bags': 'Règles des sacs',
    'volunteer.chip.reEntry': 'Réadmission',
  },
  pt: {
    'volunteer.commonQuestions': 'Perguntas frequentes',
    'volunteer.introEnglish':
      'Toque em uma pergunta para ver a resposta verificada. Escolha um idioma na barra lateral para obter também a tradução para o torcedor.',
    'volunteer.introTranslated':
      'Toque em uma pergunta — você lê em inglês e o torcedor lê em {language}.',
    'volunteer.englishForYou': 'Inglês — para você',
    'volunteer.showTheFan': '{language} — mostre ao torcedor',
    'volunteer.fetching': 'Buscando a resposta verificada',
    'volunteer.answerFailedTitle': 'Falha na resposta',
    'volunteer.answerFailed': 'Não foi possível gerar a resposta agora.',
    'volunteer.anythingElse': 'Algo fora da lista',
    'placeholder.volunteerQuestion': 'ex.: Onde fica a loja oficial?',
    'volunteer.chip.seat': 'Encontrar meu assento',
    'volunteer.chip.restroom': 'Banheiro mais próximo',
    'volunteer.chip.water': 'Água grátis',
    'volunteer.chip.prayer': 'Sala de oração',
    'volunteer.chip.halal': 'Comida halal',
    'volunteer.chip.firstAid': 'Primeiros socorros',
    'volunteer.chip.lostChild': 'Criança perdida',
    'volunteer.chip.exits': 'Saídas',
    'volunteer.chip.transit': 'Trem e transporte',
    'volunteer.chip.cashless': 'Pagar em dinheiro',
    'volunteer.chip.bags': 'Política de bolsas',
    'volunteer.chip.reEntry': 'Reentrada',
  },
  de: {
    'volunteer.commonQuestions': 'Häufige Fragen',
    'volunteer.introEnglish':
      'Tippen Sie auf eine Frage für die geprüfte Antwort. Wählen Sie in der Seitenleiste eine Sprache für die Übersetzung zum Vorzeigen.',
    'volunteer.introTranslated': 'Frage antippen — Sie lesen Englisch, der Fan liest {language}.',
    'volunteer.englishForYou': 'Englisch — für Sie',
    'volunteer.showTheFan': '{language} — dem Fan zeigen',
    'volunteer.fetching': 'Geprüfte Antwort wird geladen',
    'volunteer.answerFailedTitle': 'Antwort fehlgeschlagen',
    'volunteer.answerFailed': 'Die Antwort konnte gerade nicht erstellt werden.',
    'volunteer.anythingElse': 'Etwas, das nicht im Raster steht',
    'placeholder.volunteerQuestion': 'z. B. Wo ist der Fanshop?',
    'volunteer.chip.seat': 'Meinen Platz finden',
    'volunteer.chip.restroom': 'Nächste Toilette',
    'volunteer.chip.water': 'Gratis Wasser',
    'volunteer.chip.prayer': 'Gebetsraum',
    'volunteer.chip.halal': 'Halal-Essen',
    'volunteer.chip.firstAid': 'Erste Hilfe',
    'volunteer.chip.lostChild': 'Verlorenes Kind',
    'volunteer.chip.exits': 'Ausgänge',
    'volunteer.chip.transit': 'Bahn & Mitfahrdienst',
    'volunteer.chip.cashless': 'Barzahlung',
    'volunteer.chip.bags': 'Taschenregeln',
    'volunteer.chip.reEntry': 'Wiedereinlass',
  },
  hi: {
    'volunteer.commonQuestions': 'आम सवाल',
    'volunteer.introEnglish':
      'सत्यापित उत्तर के लिए किसी सवाल पर टैप करें। फ़ैन को दिखाने वाला अनुवाद भी पाने के लिए साइडबार में भाषा चुनें।',
    'volunteer.introTranslated': 'सवाल पर टैप करें — आप अंग्रेज़ी पढ़ें, फ़ैन {language} पढ़े।',
    'volunteer.englishForYou': 'अंग्रेज़ी — आपके लिए',
    'volunteer.showTheFan': '{language} — फ़ैन को दिखाएँ',
    'volunteer.fetching': 'सत्यापित उत्तर लाया जा रहा है',
    'volunteer.answerFailedTitle': 'उत्तर विफल',
    'volunteer.answerFailed': 'अभी उत्तर तैयार नहीं हो सका।',
    'volunteer.anythingElse': 'सूची से बाहर कुछ और',
    'placeholder.volunteerQuestion': 'जैसे: आधिकारिक स्टोर कहाँ है?',
    'volunteer.chip.seat': 'मेरी सीट खोजें',
    'volunteer.chip.restroom': 'निकटतम शौचालय',
    'volunteer.chip.water': 'मुफ़्त पानी',
    'volunteer.chip.prayer': 'प्रार्थना कक्ष',
    'volunteer.chip.halal': 'हलाल खाना',
    'volunteer.chip.firstAid': 'प्राथमिक चिकित्सा',
    'volunteer.chip.lostChild': 'खोया बच्चा',
    'volunteer.chip.exits': 'निकास',
    'volunteer.chip.transit': 'ट्रेन और राइडशेयर',
    'volunteer.chip.cashless': 'नकद भुगतान',
    'volunteer.chip.bags': 'बैग नियम',
    'volunteer.chip.reEntry': 'दोबारा प्रवेश',
  },
  ar: {
    'volunteer.commonQuestions': 'أسئلة شائعة',
    'volunteer.introEnglish':
      'انقر على سؤال للحصول على الإجابة الموثّقة. اختر لغة من الشريط الجانبي لتحصل أيضًا على ترجمة تعرضها للمشجع.',
    'volunteer.introTranslated':
      'انقر على سؤال — أنت تقرأ بالإنجليزية والمشجع يقرأ بالـ{language}.',
    'volunteer.englishForYou': 'الإنجليزية — لك',
    'volunteer.showTheFan': '{language} — اعرضها للمشجع',
    'volunteer.fetching': 'جارٍ جلب الإجابة الموثّقة',
    'volunteer.answerFailedTitle': 'فشلت الإجابة',
    'volunteer.answerFailed': 'تعذّر إنشاء الإجابة الآن.',
    'volunteer.anythingElse': 'أي شيء خارج القائمة',
    'placeholder.volunteerQuestion': 'مثال: أين المتجر الرسمي؟',
    'volunteer.chip.seat': 'إيجاد مقعدي',
    'volunteer.chip.restroom': 'أقرب دورة مياه',
    'volunteer.chip.water': 'ماء مجاني',
    'volunteer.chip.prayer': 'غرفة الصلاة',
    'volunteer.chip.halal': 'طعام حلال',
    'volunteer.chip.firstAid': 'الإسعافات الأولية',
    'volunteer.chip.lostChild': 'طفل تائه',
    'volunteer.chip.exits': 'المخارج',
    'volunteer.chip.transit': 'القطار والمواصلات',
    'volunteer.chip.cashless': 'الدفع نقدًا',
    'volunteer.chip.bags': 'قواعد الحقائب',
    'volunteer.chip.reEntry': 'إعادة الدخول',
  },
  ja: {
    'volunteer.commonQuestions': 'よくある質問',
    'volunteer.introEnglish':
      '質問をタップすると検証済みの回答が表示されます。サイドバーで言語を選ぶと、ファンに見せる翻訳も表示されます。',
    'volunteer.introTranslated': '質問をタップ — あなたは英語を、ファンは{language}を読みます。',
    'volunteer.englishForYou': '英語 — あなた用',
    'volunteer.showTheFan': '{language} — ファンに見せる',
    'volunteer.fetching': '検証済みの回答を取得中',
    'volunteer.answerFailedTitle': '回答できませんでした',
    'volunteer.answerFailed': '現在回答を生成できません。',
    'volunteer.anythingElse': 'リストにない質問',
    'placeholder.volunteerQuestion': '例:公式グッズ売り場はどこですか?',
    'volunteer.chip.seat': '座席を探す',
    'volunteer.chip.restroom': '最寄りのトイレ',
    'volunteer.chip.water': '無料の水',
    'volunteer.chip.prayer': '礼拝室',
    'volunteer.chip.halal': 'ハラール料理',
    'volunteer.chip.firstAid': '救護所',
    'volunteer.chip.lostChild': '迷子',
    'volunteer.chip.exits': '出口',
    'volunteer.chip.transit': '鉄道・ライドシェア',
    'volunteer.chip.cashless': '現金での支払い',
    'volunteer.chip.bags': '持ち込みバッグ',
    'volunteer.chip.reEntry': '再入場',
  },
};
