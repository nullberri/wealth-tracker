import { DateTime } from "luxon";
import { useMemo } from "react";
import { useBaseIncome } from "./use-base-income";
import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/graph-helpers";
import {
  BonusOutcomes,
  scaleOutcome,
  minMaxAvg,
} from "shared/utility/min-max-avg";

export const useJuneBonus = (year: number): BonusOutcomes => {
  const payedOn = useMemo(
    () => DateTime.fromObject({ day: 15, month: 6, year }),
    [year]
  );
  const timeseries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const income = useBaseIncome(
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
    const cash = scaleOutcome(outcomes, meritFactor * income);
    const projectedActual = mostRecentPercent?.value
      ? mostRecentPercent?.value * meritFactor * income
      : undefined;

    return {
      percent: { ...outcomes, actual: mostRecentPercent?.value },
      cash: { ...cash, actual: mostRecentBonus?.value ?? projectedActual },
    };
  }, [
    income,
    payedOn,
    timeseries.companyBonus,
    timeseries.companyBonusPct,
    timeseries.meritBonusPct,
    year,
  ]);
};
