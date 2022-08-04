export function useBrowserLanguage() {
  const lang = navigator.language || (navigator as unknown as { userLanguage: string; }).userLanguage;
  return lang.split('-')[0];
}