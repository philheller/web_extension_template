import { useState } from "react";
import { t } from "../hooks/i18n/useTranslate";
import reactLogo from "../assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App flex h-full w-full flex-col bg-neutral-100 p-5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
      <h1 className="flex-grow-0 text-3xl">{t("extensionName")}</h1>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <img
          className="h-32 w-32 self-center"
          src={chrome.runtime.getURL(reactLogo)}
          alt="react logo"
        />
        <p className="self-center text-xl font-bold">{count}</p>
        <button
          className="self-center  rounded bg-[#00d8ff] py-1 px-3 text-lg text-neutral-900"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;
