import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { store } from "shared/store";
import { shortDate } from "shared/utility/format-date";

export const useExport = () => {
  const storeData = useStore(store);
  const onExport = useCallback(() => {
    const data = JSON.stringify(storeData, null, 2);
    const link = document.createElement("a");
    link.download = `wealth-tracker-${DateTime.local().toFormat(
      shortDate
    )}.json`;
    const blob = new Blob([data], { type: "application/json" });
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }, [storeData]);

  return onExport;
};
