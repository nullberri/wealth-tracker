import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useDateRanges, useDates } from "shared/hooks/use-dates";
import { store } from "shared/store";
import {
  AddOutcome,
  actualizedOutcome,
  outcomeFromSingle,
} from "shared/utility/min-max-avg";
import { BonusOutcome } from "./components/bonus-outcome";
import { Layout } from "./components/data-entry/data-entry";
import { MeritOutcome } from "./components/merit-increase";
import { Outcome } from "./components/outcome";
import { useBaseIncome } from "./hooks/use-base-income";
import { useCompanyBonus } from "./hooks/use-company-bonus";
import { useMeritBonus } from "./hooks/use-merit-bonus";
import { useRetirementBonus } from "./hooks/use-retirement-bonus";

export const ProjectedIncome = () => {
  const [year, setYear] = useState(DateTime.local().year);

  const oldestYear = useStore(store, (x) => {
    const first = x.projectedIncome.timeSeries.paycheck[1]?.date;
    const date = first ? DateTime.fromISO(first) : DateTime.local();
    return date.year;
  });

  const dates = useDates(year);
  const { base } = useDateRanges(year);
  const income = useBaseIncome(base.start, base.end);

  const meritBonus = useMeritBonus(year);
  const juneBonus = useCompanyBonus(year);
  const julyBonus = useRetirementBonus(year);

  const incomeOutcome = useMemo(() => {
    return AddOutcome(
      outcomeFromSingle(income.totalIncome),
      actualizedOutcome(meritBonus.cash),
      actualizedOutcome(juneBonus.cash),
      actualizedOutcome(julyBonus.cash)
    );
  }, [income, julyBonus, juneBonus, meritBonus]);

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack gap={2} direction={"row"} overflow={"auto"}>
          <Outcome
            title={
              <Box display="flex" alignItems={"center"} gap={2} width={"100%"}>
                <span>Income</span>
                <DatePicker
                  sx={{ width: 90, marginLeft: "auto", marginRight: 2 }}
                  label={"year"}
                  views={["year"]}
                  minDate={DateTime.local().set({ year: oldestYear })}
                  maxDate={DateTime.local().plus({ years: 10 })}
                  defaultValue={DateTime.local()}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      label: "",
                    },
                  }}
                  onYearChange={(year) => {
                    setYear(year.year);
                  }}
                />
              </Box>
            }
            outcome={incomeOutcome}
            payDate={dates.companyBonus}
          />
          <MeritOutcome title="Merit Increase" payDate={dates.meritIncrease} />
          <BonusOutcome
            title="Merit Bonus"
            outcome={meritBonus}
            payDate={dates.meritBonus}
          />
          <BonusOutcome
            title="Company Bonus"
            outcome={juneBonus}
            payDate={dates.companyBonus}
          />
          <BonusOutcome
            title="Retirement Bonus"
            outcome={julyBonus}
            payDate={dates.retirementBonus}
          />
        </Stack>
      </Box>
      <Box flex="1 1 auto">
        <Box overflow={"auto"} width={"100%"} height={"100%"}>
          <Box
            height={"100%"}
            display={"flex"}
            gap={2}
            flexWrap={"nowrap"}
            flexShrink={0}
          >
            <Layout
              accountName="paycheck"
              variant="cash"
              defaultDate={DateTime.fromObject({ day: 1, month: 4 })}
              title="Income Per Check"
            />
            <Layout
              title="Merit Increase"
              accountName="meritIncreasePct"
              variant="percent"
              defaultDate={dates.meritIncrease}
            />
            <Layout
              title="Equity Increase"
              accountName="equityPct"
              variant="percent"
              defaultDate={dates.meritIncrease}
            />
            <Layout
              title="Merit Bonus"
              accountName="meritBonusPct"
              variant="percent"
              defaultDate={dates.meritBonus}
            />
            <Layout
              title="Merit Bonus"
              accountName="meritBonus"
              variant="cash"
              defaultDate={dates.meritBonus}
            />
            <Layout
              title="Company Bonus Factor"
              accountName="companyBonusPct"
              defaultDate={dates.companyBonus}
              variant="percent"
            />
            <Layout
              title="Company Bonus"
              accountName="companyBonus"
              defaultDate={dates.companyBonus}
              variant="cash"
            />
            <Layout
              title="Retirement Bonus"
              accountName="retirementBonus"
              defaultDate={dates.retirementBonus}
              variant="cash"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
