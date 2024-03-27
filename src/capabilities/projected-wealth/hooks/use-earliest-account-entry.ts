import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { store } from "shared/store";

export const useEarliestAccountEntry = () => {
  const accounts = useStore(store, (x) => x.wealth);
  return DateTime.fromMillis(
    Object.values(accounts)
      .map((x) => {
        if (x.type === "account") {
          return x.data[0]?.date
            ? DateTime.fromISO(x.data[0].date)
            : DateTime.local();
        }
        return DateTime.local();
      })
      .reduce(
        (acc, curr) => Math.min(acc, curr?.toMillis() ?? Infinity),
        DateTime.local().toMillis()
      )
  );
};
