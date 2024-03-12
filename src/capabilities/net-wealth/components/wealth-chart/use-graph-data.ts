import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";
import { getGraphDates, getGraphValue } from "shared/utility/graph-helpers";

export const useGraphData = () => {
  const wealth = useStore(store, (x) => x.wealth);
  return useMemo(() => {
    const dates = getGraphDates(Object.values(wealth));
    const accounts = Object.entries(wealth);
    const graphData = dates.map((date) => {
      return accounts.reduce(
        (acc, [accountName, account]) => {
          const value = getGraphValue(date, account);
          acc[accountName] = value;
          acc["total"] = (acc["total"] as number) + value;
          acc["date"] = date.toJSDate();
          return acc;
        },
        { total: 0 } as Record<string, number | Date>
      );
    });
    const firstNonZero = graphData.findIndex((x) => (x["total"] as number) > 0);
    return graphData.slice(firstNonZero);
  }, [wealth]);
};
