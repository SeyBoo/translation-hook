import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Language } from "../interface/language.interface";

interface TranslationContextActions {
  translationData: Language | undefined;
}

const TranslationContext = createContext({} as TranslationContextActions);

type SupportedLanguage = "french" | "english";

const TranslationProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [translationData, setTranslationData] = useState<undefined | Language>(
    undefined
  );

  const getNavigatorLanguage = (): SupportedLanguage => {
    const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;

    if (userLocale === "fr") {
      return "french";
    }

    return "english";
  };

  const importCorrectLanguageData = async (
    selectedLanguage: SupportedLanguage
  ): Promise<Language> => {
    const mod = await import("../translation/" + selectedLanguage);
    return mod.Data;
  };

  useEffect(() => {
    if (translationData === undefined) {
      (async () => {
        const language = getNavigatorLanguage();
        const data = await importCorrectLanguageData(language);
        setTranslationData(data);
      })();
    }
  }, [translationData]);

  return (
    <TranslationContext.Provider value={{ translationData }}>
      {children}
    </TranslationContext.Provider>
  );
};

const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useTranslation must be placed wititn a TranslationProvider"
    );
  }

  return context.translationData;
};

export default TranslationProvider;
export { useTranslation };
