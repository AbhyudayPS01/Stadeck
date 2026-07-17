import type { UiStrings } from './uiStrings';

/**
 * The non-Latin-script interface-string tables (Hindi, Arabic, Japanese) —
 * split from uiStringsTranslations.ts purely for the file-size limit; the
 * key contract and English source copy live in uiStrings.ts.
 */

export const HI_STRINGS: UiStrings = {
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
  'action.send': 'भेजें',
  'action.translate': 'अनुवाद करें',
  'action.getDirections': 'रास्ता देखें',
  'action.planStepFreeRoute': 'बिना सीढ़ी वाला रास्ता बनाएँ',
  'action.planExit': 'मेरी निकासी योजना',
  'action.getEcoActions': 'मेरे इको-कदम',
  'action.generateBriefing': 'ब्रीफ़िंग बनाएँ',
  'action.planScenario': 'परिदृश्य योजना बनाएँ',
  'placeholder.conciergeMessage': 'जैसे: गेट C कहाँ है?',
  'placeholder.destination': 'जैसे: पेन स्टेशन, न्यूयॉर्क',
  'placeholder.scenario': 'जैसे: मैच ख़त्म होने से 20 मिनट पहले रेल लाइन बंद हो जाती है',
  'empty.conciergeIntro':
    'स्टेडियम के बारे में कुछ भी पूछें — किसी भी भाषा में। इनमें से एक आज़माएँ:',
  'empty.announcements': 'स्टेडियम की घोषणाएँ जारी होते ही यहाँ दिखेंगी।',
  'empty.incidents': 'रिपोर्ट की गई घटनाएँ यहाँ रीयल-टाइम में दिखेंगी।',
  'empty.incidentNotSelected':
    'तुरंत कार्रवाइयाँ, सूचनाएँ और एस्केलेशन मानदंड बनाने के लिए फ़ीड से एक घटना चुनें।',
};

export const AR_STRINGS: UiStrings = {
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
  'action.send': 'إرسال',
  'action.translate': 'ترجمة',
  'action.getDirections': 'عرض الاتجاهات',
  'action.planStepFreeRoute': 'خطط مسارًا بلا درج',
  'action.planExit': 'خطط مغادرتي',
  'action.getEcoActions': 'إجراءاتي البيئية',
  'action.generateBriefing': 'إنشاء الموجز',
  'action.planScenario': 'خطط السيناريو',
  'placeholder.conciergeMessage': 'مثال: أين البوابة C؟',
  'placeholder.destination': 'مثال: محطة بن، نيويورك',
  'placeholder.scenario': 'مثال: يتعطل خط القطار قبل 20 دقيقة من نهاية المباراة',
  'empty.conciergeIntro': 'اسأل أي شيء عن الملعب — بأي لغة. جرّب أحد هذه الأسئلة:',
  'empty.announcements': 'ستظهر إعلانات الملعب هنا فور صدورها.',
  'empty.incidents': 'ستظهر الحوادث المبلّغ عنها هنا مباشرة.',
  'empty.incidentNotSelected':
    'اختر حادثة من القائمة لإنشاء الإجراءات الفورية والإخطارات ومعايير التصعيد.',
};

export const JA_STRINGS: UiStrings = {
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
  'action.send': '送信',
  'action.translate': '翻訳',
  'action.getDirections': '道順を見る',
  'action.planStepFreeRoute': '段差のないルートを計画',
  'action.planExit': '帰路を計画',
  'action.getEcoActions': 'エコアクションを見る',
  'action.generateBriefing': 'ブリーフィングを生成',
  'action.planScenario': 'シナリオを計画',
  'placeholder.conciergeMessage': '例:ゲートCはどこですか?',
  'placeholder.destination': '例:ペン駅(ニューヨーク)',
  'placeholder.scenario': '例:試合終了20分前に鉄道が停止する',
  'empty.conciergeIntro': 'スタジアムについて何でも質問してください — どの言語でも。例えば:',
  'empty.announcements': '場内アナウンスは発表され次第ここに表示されます。',
  'empty.incidents': '報告されたインシデントはリアルタイムでここに表示されます。',
  'empty.incidentNotSelected':
    'フィードからインシデントを選ぶと、即時対応・通知先・エスカレーション基準を生成します。',
};
