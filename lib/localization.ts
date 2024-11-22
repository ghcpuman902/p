const SUPPORTED_LOCALES = ['en-GB', 'zh-TW', 'zh-CN'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];
const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];
import { translations } from './translations';

export interface Translations {
    [key: string]: {
        [key in Locale]: string;
    };
}

function getTranslation(locale: Locale, key: string): string {
    const translation = translations[key]?.[locale] || translations[key]?.[DEFAULT_LOCALE] || `Missing translation for ${key}`;
    return typeof translation === 'string' ? translation : JSON.stringify(translation);
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, getTranslation };
export type { Locale };

