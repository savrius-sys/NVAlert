import uk from '../locales/uk';
import en from '../locales/en';

type LocaleDict = Record<string, string>;
const dictionaries: Record<string, LocaleDict> = { uk, en };

let currentLanguage = 'uk';

// Detect language on first load if not set
if (typeof navigator !== 'undefined') {
  const browserLang = navigator.language || '';
  if (!browserLang.startsWith('uk') && !browserLang.startsWith('ru')) {
    currentLanguage = 'en';
  }
}

export const setI18nLanguage = (lang: string) => {
  if (dictionaries[lang]) {
    currentLanguage = lang;
  }
};

export const getI18nLanguage = () => currentLanguage;

export const t = (key: string, substitutions?: string[]): string => {
  const dict = dictionaries[currentLanguage] || dictionaries['uk'];
  let msg = dict[key];
  
  if (!msg) return key;

  if (substitutions && substitutions.length > 0) {
    substitutions.forEach((sub, i) => {
      msg = msg.replace(`$${i + 1}`, sub);
    });
  }
  
  return msg;
};
