import { useState, useEffect } from "react";
import { Button } from "rsuite";

export const WeeklyPerformanceInputScreen = () => {
  const [animation, setAnimation] = useState(false);
  const [loadingValue, setLoadingValue] = useState(false);

  useEffect(() => {
    setAnimation(true);
  },[]);

  return (
      <div
        className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <header
          className={`flex flex-col bg-light-mode dark:bg-dark-mode min-h-screen bg-no-repeat bg-cover bg-center bg-fixed text-white text-3xl justify-center items-center`}
        >
          <div
            className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 w-full max-w-md duration-1000 transform transition-all ease-out ${
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex justify-center items-center">
              <div className="py-2 md:py-9">
                <h1
                  className={`text-zinc-500 dark:text-black text-xl md:text-2xl text-center delay-200 duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
                >
                  Weekly Performance
                </h1>
              </div>
            </div>
            <div
              className={`flex flex-wrap items-center justify-center duration-1000 relative transform transition-all ease-out
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              Pickers and selectors here
            </div>
            <div
              className={`flex items-center justify-center mt-6 md:mt-10 duration-1000 relative transform transition-all ease-out md:pb-8
            ${
              // hiding components when they first appear and then applying a translate effect gradually
              animation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            >
              <Button
                  appearance="primary"
                  type="submit"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 20,
                    paddingLeft: 20,
                  }}
                  loading={loadingValue}
                >
                  Submit
                </Button>
            </div>
          </div>
        </header>
      </div>
  );
};
