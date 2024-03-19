import { DateTime } from "luxon";
import { useMemo } from "react";
import { useBaseIncome } from "./use-base-income";
import { store } from "shared/store";
import { useStore } from "@tanstack/react-store";
import {
  BonusOutcomes,
  scaleOutcome,
  minMaxAvg,
  actualizedOutcome,
} from "shared/utility/min-max-avg";
import { findSameYear } from "shared/utility/graph-helpers";
import { useMostFrequentValue } from "./use-most-frequent-value";

export const useAprilBonus = (year: number): BonusOutcomes => {
  const payedOn = useMemo(
    () => DateTime.fromObject({ day: 15, month: 4, year }),
    [year]
  );
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const { totalIncome } = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 1, year: year - 1 }),
    DateTime.fromObject({ day: 1, month: 1, year })
  );

  const bonusAmmount = useMemo(() => {
    return findSameYear(payedOn, timeSeries.meritBonus)?.value;
  }, [payedOn, timeSeries.meritBonus]);

  const bonusPercent = useMemo(() => {
    return findSameYear(payedOn, timeSeries.meritBonusPct)?.value;
  }, [payedOn, timeSeries.meritBonusPct]);

  const frequentMeritBonusPercent = useMostFrequentValue(
    timeSeries.meritBonusPct
  );

  return useMemo(() => {
    const meritOutcome = minMaxAvg(
      timeSeries.meritBonusPct
        .filter((x) => DateTime.fromISO(x.date).year <= year)
        .map((x) => x.value)
    );
    meritOutcome.avg = frequentMeritBonusPercent;

    return {
      percent: actualizedOutcome({ ...meritOutcome, actual: bonusPercent }),
      cash: actualizedOutcome({
        ...scaleOutcome(meritOutcome, totalIncome),
        actual: bonusAmmount,
      }),
    };
  }, [
    bonusAmmount,
    bonusPercent,
    frequentMeritBonusPercent,
    timeSeries.meritBonusPct,
    totalIncome,
    year,
  ]);
};
