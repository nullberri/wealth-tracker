import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import {
  AddOutcome,
  BonusOutcomes,
  actualizedOutcome,
  outcomeFromSingle,
  scaleOutcome,
} from "shared/utility/min-max-avg";
import { useAprilBonus } from "./use-april-bonus";
import { useBaseIncome } from "./use-base-income";
import { useJuneBonus } from "./use-june-bonus";

const bonusPercent = 0.15;
export const useJulyBonus = (year: number): BonusOutcomes => {
  const payDay = useMemo(
    () => DateTime.fromObject({ day: 15, month: 7, year }),
    [year]
  );

  const actual = useStore(
    store,
    (x) =>
      findSameYear(payDay, x.projectedIncome.timeSeries.retirementBonus)?.value
  );

  const { totalIncome } = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
    DateTime.fromObject({ day: 1, month: 7, year })
  );

  const meritBonus = useAprilBonus(year);
  const juneBonus = useJuneBonus(year);

  return useMemo(() => {
    const eligbleIncome = outcomeFromSingle(totalIncome);
    const outcome = scaleOutcome(
      AddOutcome(
        eligbleIncome,
        actualizedOutcome(meritBonus.cash),
        actualizedOutcome(juneBonus.cash)
      ),
      bonusPercent
    );
    return {
      cash: actualizedOutcome({ ...outcome, actual: actual ?? outcome.actual }),
      percent: {
        min: 0.15,
        max: 0.15,
        avg: 0.15,
        actual: 0.15,
      },
    };
  }, [actual, juneBonus.cash, meritBonus.cash, totalIncome]);
};
