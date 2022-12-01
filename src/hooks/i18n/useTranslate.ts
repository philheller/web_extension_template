const useTranslate = (messageId: string, ...args: string[]) => {
  return chrome.i18n.getMessage(messageId, args);
};

export { useTranslate as t };
