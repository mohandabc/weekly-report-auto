/******************************************************************************
 *  SYNC STATE TO LOCAL STORAGE SO THAT IT PERSISTS THROUGH A PAGE REFRESH.   *
 *  USAGE IS SIMILAR TO USESTATE EXCEPT WE PASS IN A LOCAL STORAGE KEY WHICH  *
 * IS IN OUR CASE THE TOKEN SO THAT WE CAN DEFAULT TO THAT VALUE ON PAGE LOAD *
 *                  INSTEAD OF THE SPECIFIED INITIAL VALUE.                   *
 ******************************************************************************/

import { useState } from "react";

// localStorage setter.
export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.clear();
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
