import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const t = (key) => {
    return getTranslation(key, currentLanguage);
  };

  return { t, currentLanguage };
};