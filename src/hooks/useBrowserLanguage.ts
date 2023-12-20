export function useBrowserLanguage() {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const lang = navigator.language || (navigator as unknown as { userLanguage: string }).userLanguage;
  return lang.split('-')[0];
}