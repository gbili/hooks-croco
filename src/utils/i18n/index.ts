export interface DeepNestedStringsDict { [k: string]: string | number | JSX.Element | DeepNestedStringsDict; };

export function initializeI18n<T extends DeepNestedStringsDict>(all: T) {
  type SupportedLangs = Extract<keyof T, string>;

  const isSupportedLang = (s: string): s is SupportedLangs => {
    return undefined !== Object.keys(all).find(implementedLang => implementedLang === s);
  }

  const getLocalizedStrings = (userPreferredLang: string, defaultLang: SupportedLangs) => {
    const lang = (isSupportedLang(userPreferredLang) && userPreferredLang) || defaultLang;
    return all[lang];
  }

  return {
    isSupportedLang,
    getLocalizedStrings,
  };
};

export default initializeI18n;