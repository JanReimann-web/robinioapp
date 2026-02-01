import { defaultLocale, isLocale } from "./config";

export type Messages = typeof import("./messages/en.json");

export const getMessages = async (locale: string) => {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  const messages = await import(`./messages/${safeLocale}.json`);
  return messages.default as Messages;
};
