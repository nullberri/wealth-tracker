import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import {
  BonusOutcomes,
  actualizedOutcome,
  minMaxAvg,
  scaleOutcome,
} from "shared/utility/min-max-avg";
import { useBaseIncome } from "./use-base-income";

export const useJuneBonus = (year: number): BonusOutcomes => {
  const payedOn = useMemo(
    () => DateTime.fromObject({ day: 15, month: 6, year }),
    [year]
  );
  const timeseries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const { totalIncome } = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 4, year: year - 1 }),
    DateTime.fromObject({ day: 31, month: 3, year })
  );

  return useMemo(() => {
    const mostRecentBonus = findSameYear(payedOn, timeseries.companyBonus);
    const mostRecentPercent = findSameYear(payedOn, timeseries.companyBonusPct);

    const meritFactor = timeseries.meritBonusPct
      .filter((x) => DateTime.fromISO(x.date).year <= year)
      .slice(-3)
      .reduce((acc, curr) => acc + curr.value, 0);

    const outcomes = minMaxAvg(timeseries.companyBonusPct.map((x) => x.value));
    const cash = scaleOutcome(outcomes, meritFactor * totalIncome);
    const projectedActual = mostRecentPercent?.value
      ? mostRecentPercent?.value * meritFactor * totalIncome
      : undefined;

    return {
      percent: actualizedOutcome({
        ...outcomes,
        actual: mostRecentPercent?.value,
      }),
      cash: actualizedOutcome({
        ...cash,
        actual: mostRecentBonus?.value ?? projectedActual,
      }),
    };
  }, [
    totalIncome,
    payedOn,
    timeseries.companyBonus,
    timeseries.companyBonusPct,
    timeseries.meritBonusPct,
    year,
  ]);
};
