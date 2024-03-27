import { useStore } from "@tanstack/react-store";
import { useTotalIncome } from "capabilities/projected-income/hooks/use-total-income";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { useEarliestAccountEntry } from "./use-earliest-account-entry";
import { useFutureBonusesCurrentYear } from "./use-future-bonuses-current-year";

export interface TimeSeriesWealth {
  graphDate: Date;
  date: DateTime;
  wealth: number;
  yoyCash?: number;
  yoyPct?: number;
}

export const useTimeSeriesWealth = () => {
  const localDateTime = DateTime.local().startOf("day");
  const currentYear = DateTime.local().year;
  const earliest = useEarliestAccountEntry();
  const accounts = useStore(store, (x) => x.wealth);
  const config = useStore(store, (x) => x.projectedWealth);
  const { taxableIncome } = useTotalIncome(currentYear);

  const bonuses = useFutureBonusesCurrentYear();

  const data = useMemo(() => {
    if (!earliest.isValid) {
      return [];
    }
    const dates = new Array(currentYear + 2 - earliest.year)
      .fill(earliest.year)
      .map((x, i) =>
        DateTime.fromObject({ day: 1, month: 1, year: x + i }).startOf("day")
      );

    if (localDateTime !== dates[dates.length - 2]) {
      dates.splice(-1, 0, localDateTime);
    }

    return dates
      .map((date) => {
        const homeEquity = Object.values(accounts)
          .map((x) => {
            if (x.type === "mortgage" && x.loan) {
              const houseValue = findNearestOnOrBefore(date, x.data);
              const balance = calcLoanBalance(date, x.loan);
              return calcEquity(
                x.loan.ownershipPct,
                houseValue?.value,
                balance,
                x.loan.principal
              );
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0);

        const accountsWealth = Object.values(accounts)
          .map((x) => {
            if (x.type === "account") {
              const entry = findNearestOnOrBefore(date, x.data);
              return entry?.value ?? 0;
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0);

        let futureWealth = 0;
        if (date.year === currentYear + 1) {
          futureWealth += bonuses;
          futureWealth += config.savingsRate * date.diffNow("months").months;
          const income = taxableIncome.actual ?? taxableIncome.avg;
          futureWealth +=
            income > config.socialSecurityCap
              ? config.socialSecurityTaxPct *
                (income - config.socialSecurityCap)
              : 0;
          futureWealth -=
            income > config.medicareSupplementalTaxCap
              ? config.medicareSupplementalTaxPct *
                (income - config.medicareSupplementalTaxCap)
              : 0;
        }

        return {
          date,
          graphDate: date.toJSDate(),
          wealth: homeEquity + accountsWealth + futureWealth,
        };
      })
      .map((x, idx, arr) => {
        const benchmarkWealth = arr[idx - 1]?.wealth;
        if (!benchmarkWealth) {
          return x;
        }
        return {
          ...x,
          yoyCash: x.wealth - benchmarkWealth,
          yoyPct: x.wealth / benchmarkWealth - 1,
        };
      });
  }, [
    accounts,
    bonuses,
    config.medicareSupplementalTaxCap,
    config.medicareSupplementalTaxPct,
    config.savingsRate,
    config.socialSecurityCap,
    config.socialSecurityTaxPct,
    currentYear,
    earliest.isValid,
    earliest.year,
    localDateTime,
    taxableIncome.actual,
    taxableIncome.avg,
  ]);
  return data as TimeSeriesWealth[];
};
