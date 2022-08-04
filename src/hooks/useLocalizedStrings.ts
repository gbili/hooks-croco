import initializeI18n, { DeepNestedStringsDict } from "../utils/i18n";
import { useBrowserLanguage } from "./useBrowserLanguage";

export function useLocalizedStrings<T extends DeepNestedStringsDict>(all: T, defaultLang: Extract<keyof T, string>) {
  const { getLocalizedStrings } = initializeI18n(all);
  const userPreferredLang = useBrowserLanguage();
  return getLocalizedStrings(userPreferredLang , defaultLang);
}
