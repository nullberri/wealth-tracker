import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { AddOutcome, outcomeFromSingle } from "shared/utility/min-max-avg";
import { BonusOutcome } from "./components/bonus-outcome";
import { Layout } from "./components/data-entry/data-entry";
import { MeritOutcome } from "./components/merit-increase";
import { Outcome } from "./components/outcome";
import { useAprilBonus } from "./hooks/use-april-bonus";
import { useBaseIncome } from "./hooks/use-base-income";
import { useJulyBonus } from "./hooks/use-july-bonus";
import { useJuneBonus } from "./hooks/use-june-bonus";

export const ProjectedIncome = () => {
  const [year, setYear] = useState(DateTime.local().year);

  const dates = useMemo(() => {
    return {
      janFirst: DateTime.fromObject({ day: 1, month: 1, year: year }),
      nextJanFirst: DateTime.fromObject({
        day: 1,
        month: 1,
        year: year + 1,
      }),
      junePayDay: DateTime.fromObject({ day: 15, month: 6, year: year }),
      meritPayDay: DateTime.fromObject({ day: 15, month: 4, year: year }),
      meritIncreaseDay: DateTime.fromObject({ day: 1, month: 4, year: year }),
      julyPayDay: DateTime.fromObject({ day: 15, month: 7, year: year }),
    };
  }, [year]);

  const income = useBaseIncome(dates.janFirst, dates.nextJanFirst);

  const meritBonus = useAprilBonus(year);
  const juneBonus = useJuneBonus(year);
  const julyBonus = useJulyBonus(year);

  const incomeOutcome = useMemo(() => {
    return AddOutcome(
      outcomeFromSingle(income.totalIncome),
      meritBonus.cash,
      juneBonus.cash,
      julyBonus.cash
    );
  }, [income, julyBonus, juneBonus, meritBonus]);

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack gap={2} direction={"row"} overflow={"auto"}>
          <Outcome
            title={
              <Box display="flex" alignItems={"center"} gap={2} width={"100%"}>
                <span>Projected Income</span>
                <DatePicker
                  sx={{ width: 90, marginLeft: "auto", marginRight: 2 }}
                  label={"year"}
                  views={["year"]}
                  minDate={DateTime.local().plus({ years: -1 })}
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
            payDate={dates.junePayDay}
          />
          <MeritOutcome
            title="Merit Increase"
            payDate={dates.meritIncreaseDay}
          />
          <BonusOutcome
            title="Merit Bonus"
            outcome={meritBonus}
            payDate={dates.meritPayDay}
          />
          <BonusOutcome
            title="Company Bonus"
            outcome={juneBonus}
            payDate={dates.junePayDay}
          />
          <BonusOutcome
            title="Retirement Bonus"
            outcome={julyBonus}
            payDate={dates.julyPayDay}
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
              defaultDate={dates.meritIncreaseDay}
            />
            <Layout
              title="Equity Increase"
              accountName="equityPct"
              variant="percent"
              defaultDate={dates.meritIncreaseDay}
            />
            <Layout
              title="Merit Bonus"
              accountName="meritBonusPct"
              variant="percent"
              defaultDate={dates.meritPayDay}
            />
            <Layout
              title="Merit Bonus"
              accountName="meritBonus"
              variant="cash"
              defaultDate={dates.meritPayDay}
            />
            <Layout
              title="Company Bonus Factor"
              accountName="companyBonusPct"
              defaultDate={dates.junePayDay}
              variant="percent"
            />
            <Layout
              title="Company Bonus"
              accountName="companyBonus"
              defaultDate={dates.junePayDay}
              variant="cash"
            />
            <Layout
              title="Retirement Bonus"
              accountName="retirementBonus"
              defaultDate={dates.julyPayDay}
              variant="cash"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
