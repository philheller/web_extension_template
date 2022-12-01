// hooks
import { t } from "../hooks/i18n/useTranslate";

function App() {
  return (
    <div className="App h-full w-full bg-neutral-100 p-5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
      <h1 className="mb-2 text-3xl">{t("optionsTitle")}</h1>
      <p className="text-lg">{t("optionsMsg")}</p>
    </div>
  );
}

export default App;
