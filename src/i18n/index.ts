import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, useTranslation } from 'react-i18next';
import type { L } from '../data/types';
import vi from './vi.json';
import en from './en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    // Mặc định tiếng Việt; chỉ đổi khi người dùng đã chọn (lưu ở localStorage)
    detection: { order: ['localStorage'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export type Lang = 'vi' | 'en';

/** t() cho chuỗi giao diện + pick() cho dữ liệu song ngữ trong src/data */
export function useLang() {
  const { t, i18n: inst } = useTranslation();
  const lang: Lang = inst.language?.startsWith('en') ? 'en' : 'vi';
  const pick = (s: L) => s[lang];
  const setLang = (l: Lang) => inst.changeLanguage(l);
  return { t, lang, pick, setLang };
}

export default i18n;
