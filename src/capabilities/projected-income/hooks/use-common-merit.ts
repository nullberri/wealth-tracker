import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { store } from "shared/store";

export const useCommonMerit = () => {
  const meritIncreasePcts = useStore(
    store,
    (x) => x.projectedIncome.timeSeries.meritIncreasePct
  );

  return useMemo(() => {
    return Object.entries(
      Object.groupBy(
        meritIncreasePcts.map((x) => x.value),
        (x) => x
      )
    )
      .map(([key, values]) => [+key, values?.length ?? 0])
      .sort(([, a], [, b]) => {
        return b - a;
      })[0][0];
  }, [meritIncreasePcts]);
};
