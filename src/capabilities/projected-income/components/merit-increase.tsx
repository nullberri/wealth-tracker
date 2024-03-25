import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { Until } from "shared/components/formatters/until";
import { store } from "shared/store";
import { shortDate } from "shared/utility/format-date";
import { findSameYear } from "shared/utility/graph-helpers";
import { useBaseIncome } from "../hooks/use-base-income";
import { useMostFrequentValue } from "../hooks/use-most-frequent-value";
import { useProjectedPay } from "../hooks/use-projected-pay";
import { Value } from "./value";

export const MeritOutcome = (props: { title: string; payDate: DateTime }) => {
  const { title, payDate } = props;

  const income = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 1, year: payDate.year }),
    DateTime.fromObject({ day: 1, month: 1, year: payDate.year + 1 })
  );

  const meritIncreases = useStore(
    store,
    (x) => x.projectedIncome.timeSeries.meritIncreasePct
  );
  const commonMerit = useMostFrequentValue(meritIncreases);
  const meritPct = useStore(
    store,
    (x) =>
      findSameYear(payDate, x.projectedIncome.timeSeries.meritIncreasePct)
        ?.value ?? commonMerit
  );
  const payChecks = useProjectedPay();
  const hasActualPaycheck = useStore(
    store,
    (x) => !!findSameYear(payDate, x.projectedIncome.timeSeries.paycheck)
  );

  const payCheck = useMemo(() => {
    return payChecks.find(([start]) => start.year === payDate.year)?.[2] ?? 0;
  }, [payChecks, payDate.year]);

  const equityPct = useStore(
    store,
    (x) =>
      payDate && findSameYear(payDate, x.projectedIncome.timeSeries.equityPct)
  );

  const totalAdjust = (meritPct ?? 0) + (equityPct?.value ?? 0);
  //const multiplier = 1 + (DateTime.local() > payDate ? 0 : totalAdjust);

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1 }}
        variant="h5"
      >
        {title}
      </Typography>
      <Divider />

      <Stack padding={1} direction={"row"} spacing={0.5}>
        {!hasActualPaycheck && (
          <Value title={"Paycheck"}>
            <Cash value={payCheck * 1 + (equityPct?.value ?? 0)} />
          </Value>
        )}
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: "none",
              },
            },
          }}
          title={
            <Table sx={{ width: "max-content" }}>
              <TableBody>
                {income.incomePerPeriod.map(
                  ([start, end, value, _paycheck, weeks], index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Cash value={value} />
                        </TableCell>
                        <TableCell>{start.toFormat(shortDate)}</TableCell>
                        <TableCell>
                          <ArrowForwardIcon />
                        </TableCell>
                        <TableCell>{end.toFormat(shortDate)}</TableCell>
                        <TableCell>
                          <Cash value={_paycheck} /> x {weeks.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          }
        >
          <div>
            <Value title={"Base Pay"}>
              <Cash value={income.totalIncome ?? 0} />
            </Value>
          </div>
        </Tooltip>
        <Value
          title={"Actual"}
          secondaryValue={
            <Until dateTime={payDate}>
              <Percent value={totalAdjust} />
            </Until>
          }
        >
          <Duration dateTime={payDate}>
            <Percent value={totalAdjust} />
          </Duration>
        </Value>
      </Stack>
    </Box>
  );
};
