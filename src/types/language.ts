/** One AI-content language choice offered by the LanguagePicker. */
export interface LanguageOption {
  /** BCP-47 tag passed to prompt builders and set as `lang` on AI content containers. */
  code: string;
  /** English name — UI chrome stays English, only AI-generated content is multilingual. */
  label: string;
  /** Native-script name shown alongside so speakers recognise their language instantly. */
  nativeLabel: string;
}
