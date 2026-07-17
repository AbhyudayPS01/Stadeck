import type { UiStringTable } from './uiStringsTypes';

/** Shell chrome (sidebar, menu, skip link) and strings shared app-wide. */
export type ShellStringKey =
  | 'shell.menu'
  | 'shell.closeMenu'
  | 'shell.skipToContent'
  | 'shell.loadingModule'
  | 'shell.interfaceLanguage'
  | 'shell.viewingAs'
  | 'shell.switchRole'
  | 'common.tryAgain'
  | 'common.somethingWentWrong'
  | 'common.demoData'
  | 'common.crashScopeFallback'
  | 'common.crashMessage'
  | 'common.offlineMode';

export const SHELL_STRINGS: UiStringTable<ShellStringKey> = {
  en: {
    'shell.menu': 'Menu',
    'shell.closeMenu': 'Close menu',
    'shell.skipToContent': 'Skip to content',
    'shell.loadingModule': 'Loading module',
    'shell.interfaceLanguage': 'Interface language',
    'shell.viewingAs': 'Viewing as',
    'shell.switchRole': 'Switch role',
    'common.tryAgain': 'Try again',
    'common.somethingWentWrong': 'Something went wrong',
    'common.crashScopeFallback': 'This part of Stadeck',
    'common.crashMessage':
      '{scope} ran into an unexpected error. The rest of the app is unaffected — try again, or switch to another module from the sidebar.',
    'common.demoData': 'Demo data',
    'common.offlineMode': 'Offline mode',
  },
  es: {
    'shell.menu': 'Menú',
    'shell.closeMenu': 'Cerrar menú',
    'shell.skipToContent': 'Saltar al contenido',
    'shell.loadingModule': 'Cargando módulo',
    'shell.interfaceLanguage': 'Idioma de la interfaz',
    'shell.viewingAs': 'Viendo como',
    'shell.switchRole': 'Cambiar de vista',
    'common.tryAgain': 'Reintentar',
    'common.somethingWentWrong': 'Algo salió mal',
    'common.crashScopeFallback': 'Esta parte de Stadeck',
    'common.crashMessage':
      '{scope} encontró un error inesperado. El resto de la app no se ve afectado: reintenta o cambia de módulo desde la barra lateral.',
    'common.demoData': 'Datos de demostración',
    'common.offlineMode': 'Modo sin conexión',
  },
  fr: {
    'shell.menu': 'Menu',
    'shell.closeMenu': 'Fermer le menu',
    'shell.skipToContent': 'Aller au contenu',
    'shell.loadingModule': 'Chargement du module',
    'shell.interfaceLanguage': "Langue de l'interface",
    'shell.viewingAs': 'Vue :',
    'shell.switchRole': 'Changer de vue',
    'common.tryAgain': 'Réessayer',
    'common.somethingWentWrong': 'Une erreur est survenue',
    'common.crashScopeFallback': 'Cette partie de Stadeck',
    'common.crashMessage':
      "{scope} a rencontré une erreur inattendue. Le reste de l'application fonctionne : réessayez ou changez de module dans la barre latérale.",
    'common.demoData': 'Données de démo',
    'common.offlineMode': 'Mode hors ligne',
  },
  pt: {
    'shell.menu': 'Menu',
    'shell.closeMenu': 'Fechar menu',
    'shell.skipToContent': 'Pular para o conteúdo',
    'shell.loadingModule': 'Carregando módulo',
    'shell.interfaceLanguage': 'Idioma da interface',
    'shell.viewingAs': 'Visualizando como',
    'shell.switchRole': 'Trocar de visão',
    'common.tryAgain': 'Tentar novamente',
    'common.somethingWentWrong': 'Algo deu errado',
    'common.crashScopeFallback': 'Esta parte do Stadeck',
    'common.crashMessage':
      '{scope} encontrou um erro inesperado. O resto do app não foi afetado: tente novamente ou troque de módulo na barra lateral.',
    'common.demoData': 'Dados de demonstração',
    'common.offlineMode': 'Modo offline',
  },
  de: {
    'shell.menu': 'Menü',
    'shell.closeMenu': 'Menü schließen',
    'shell.skipToContent': 'Zum Inhalt springen',
    'shell.loadingModule': 'Modul wird geladen',
    'shell.interfaceLanguage': 'Sprache der Oberfläche',
    'shell.viewingAs': 'Ansicht als',
    'shell.switchRole': 'Ansicht wechseln',
    'common.tryAgain': 'Erneut versuchen',
    'common.somethingWentWrong': 'Etwas ist schiefgelaufen',
    'common.crashScopeFallback': 'Dieser Teil von Stadeck',
    'common.crashMessage':
      '{scope} ist auf einen unerwarteten Fehler gestoßen. Der Rest der App ist nicht betroffen — erneut versuchen oder in der Seitenleiste das Modul wechseln.',
    'common.demoData': 'Demodaten',
    'common.offlineMode': 'Offline-Modus',
  },
  hi: {
    'shell.menu': 'मेनू',
    'shell.closeMenu': 'मेनू बंद करें',
    'shell.skipToContent': 'सीधे सामग्री पर जाएँ',
    'shell.loadingModule': 'मॉड्यूल लोड हो रहा है',
    'shell.interfaceLanguage': 'इंटरफ़ेस की भाषा',
    'shell.viewingAs': 'इस रूप में देख रहे हैं:',
    'shell.switchRole': 'भूमिका बदलें',
    'common.tryAgain': 'फिर से कोशिश करें',
    'common.somethingWentWrong': 'कुछ गड़बड़ हो गई',
    'common.crashScopeFallback': 'Stadeck का यह हिस्सा',
    'common.crashMessage':
      '{scope} में अप्रत्याशित त्रुटि आई। बाकी ऐप ठीक है — फिर से कोशिश करें या साइडबार से दूसरा मॉड्यूल चुनें।',
    'common.demoData': 'डेमो डेटा',
    'common.offlineMode': 'ऑफ़लाइन मोड',
  },
  ar: {
    'shell.menu': 'القائمة',
    'shell.closeMenu': 'إغلاق القائمة',
    'shell.skipToContent': 'الانتقال إلى المحتوى',
    'shell.loadingModule': 'جارٍ تحميل الوحدة',
    'shell.interfaceLanguage': 'لغة الواجهة',
    'shell.viewingAs': 'تعرض بصفتك',
    'shell.switchRole': 'تبديل العرض',
    'common.tryAgain': 'أعد المحاولة',
    'common.somethingWentWrong': 'حدث خطأ ما',
    'common.crashScopeFallback': 'هذا الجزء من Stadeck',
    'common.crashMessage':
      'واجه {scope} خطأً غير متوقع. بقية التطبيق تعمل — أعد المحاولة أو انتقل إلى وحدة أخرى من الشريط الجانبي.',
    'common.demoData': 'بيانات تجريبية',
    'common.offlineMode': 'وضع عدم الاتصال',
  },
  ja: {
    'shell.menu': 'メニュー',
    'shell.closeMenu': 'メニューを閉じる',
    'shell.skipToContent': '本文へスキップ',
    'shell.loadingModule': 'モジュールを読み込み中',
    'shell.interfaceLanguage': '表示言語',
    'shell.viewingAs': '表示中のビュー:',
    'shell.switchRole': 'ビューを切り替え',
    'common.tryAgain': 'もう一度試す',
    'common.somethingWentWrong': '問題が発生しました',
    'common.crashScopeFallback': 'Stadeckのこの部分',
    'common.crashMessage':
      '{scope}で予期しないエラーが発生しました。他の部分には影響ありません — もう一度試すか、サイドバーから別のモジュールへ移動してください。',
    'common.demoData': 'デモデータ',
    'common.offlineMode': 'オフラインモード',
  },
};
