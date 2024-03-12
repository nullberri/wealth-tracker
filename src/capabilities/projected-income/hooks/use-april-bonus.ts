import { DateTime } from "luxon";
import { useMemo } from "react";
import { useBaseIncome } from "./use-base-income";
import { store } from "shared/store";
import { useStore } from "@tanstack/react-store";
import {
  BonusOutcomes,
  scaleOutcome,
  minMaxAvg,
} from "shared/utility/min-max-avg";
import { findSameYear } from "shared/utility/graph-helpers";

export const useAprilBonus = (year: number): BonusOutcomes => {
  const payedOn = useMemo(
    () => DateTime.fromObject({ day: 15, month: 4, year }),
    [year]
  );
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const income = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
    DateTime.fromObject({ day: 1, month: 1, year })
  );

  const bonusAmmount = useMemo(() => {
    return findSameYear(payedOn, timeSeries.meritBonus)?.value;
  }, [payedOn, timeSeries.meritBonus]);

  const bonusPercent = useMemo(() => {
    return findSameYear(payedOn, timeSeries.meritBonusPct)?.value;
  }, [payedOn, timeSeries.meritBonusPct]);

  return useMemo(() => {
    const meritOutcome = minMaxAvg(
      timeSeries.meritBonusPct
        .filter((x) => DateTime.fromISO(x.date).year <= year)
        .slice(-3)
        .map((x) => x.value)
    );

    return {
      percent: { ...meritOutcome, actual: bonusPercent },
      cash: {
        ...scaleOutcome(meritOutcome, income),
        actual: bonusAmmount,
      },
    };
  }, [bonusAmmount, bonusPercent, income, timeSeries.meritBonusPct, year]);
};
