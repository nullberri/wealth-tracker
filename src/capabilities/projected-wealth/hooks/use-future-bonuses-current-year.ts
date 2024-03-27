import { useCompanyBonus } from "capabilities/projected-income/hooks/use-company-bonus";
import { useMeritBonus } from "capabilities/projected-income/hooks/use-merit-bonus";
import { useRetirementBonus } from "capabilities/projected-income/hooks/use-retirement-bonus";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDates } from "shared/hooks/use-dates";

export const useFutureBonusesCurrentYear = () => {
  const local = DateTime.local();
  const year = local.year;
  const dates = useDates(year);
  const meritBonus = useMeritBonus(year);
  const companyBonus = useCompanyBonus(year);
  const retirementBonus = useRetirementBonus(year);

  const bonuses = useMemo(() => {
    return (
      [
        [dates.meritBonus, meritBonus.cash.actual],
        [dates.companyBonus, companyBonus.cash.actual ?? companyBonus.cash.avg],
        [
          dates.retirementBonus,
          retirementBonus.cash.actual ?? retirementBonus.cash.avg,
        ],
      ] as [DateTime, number][]
    )
      .map(([payedOn, amount]) => (local < payedOn ? amount : 0))
      .reduce((acc, curr) => acc + curr, 0);
  }, [
    companyBonus.cash.actual,
    companyBonus.cash.avg,
    local,
    dates.companyBonus,
    dates.meritBonus,
    dates.retirementBonus,
    meritBonus.cash.actual,
    retirementBonus.cash.actual,
    retirementBonus.cash.avg,
  ]);

  return bonuses;
};
