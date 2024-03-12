import { DateTime } from "luxon";
import { useMemo } from "react";
import { useBaseIncome } from "./use-base-income";
import { useAprilBonus } from "./use-april-bonus";
import { useJuneBonus } from "./use-june-bonus";
import {
  AddOutcome,
  Outcome,
  outcomeFromSingle,
  scaleOutcome,
} from "shared/utility/min-max-avg";
import { useStore } from "@tanstack/react-store";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/graph-helpers";

const bonusPercent = 0.15;
export const useJulyBonus = (year: number): Outcome => {
  const payDay = useMemo(
    () => DateTime.fromObject({ day: 15, month: 7, year }),
    [year]
  );

  const actual = useStore(
    store,
    (x) =>
      findSameYear(payDay, x.projectedIncome.timeSeries.retirementBonus)?.value
  );

  const income = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 7, year: year - 1 }),
    DateTime.fromObject({ day: 1, month: 7, year })
  );

  const meritBonus = useAprilBonus(year);
  const juneBonus = useJuneBonus(year);

  return useMemo(() => {
    const eligbleIncome = outcomeFromSingle(income);
    const outcome = scaleOutcome(
      AddOutcome(eligbleIncome, meritBonus.cash, juneBonus.cash),
      bonusPercent
    );
    return { ...outcome, actual: actual ?? outcome.actual };
  }, [actual, income, juneBonus.cash, meritBonus.cash]);
};
