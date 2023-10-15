import { darkModeState } from "../../../shared/globalState";
import { useRecoilValue } from "recoil";

export const MonitoringKPI = (monitoringKPI) => {
  const darkMode = useRecoilValue(darkModeState);
  console.log(monitoringKPI);

  return (
    <div
      className="sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto px-10"
      style={{ height: 1260, width: "100%" }}
    >
      <div className="flex justify-center items-center">
        <span className="text-xl py-4">Drill State</span>
      </div>

        <div>hellooooo</div>

    </div>
  );
};
