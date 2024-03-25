import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Cash } from "shared/components/formatters/cash";
import { shortDate } from "shared/utility/format-date";
import { IncomePerPeriod } from "../hooks/use-base-income";

interface IncomePerPeriodTooltipProps {
  incomePerPeriod: IncomePerPeriod[];
  totalIncome: number;
}

export const IncomePerPeriodTooltip = (props: IncomePerPeriodTooltipProps) => {
  const { incomePerPeriod, totalIncome } = props;
  return (
    <Table sx={{ width: "max-content" }}>
      <TableBody>
        {incomePerPeriod.map(
          ({ start, end, value, perPayday, count }, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <Cash value={value} compact={false} />
                </TableCell>
                <TableCell>{start.toFormat(shortDate)}</TableCell>
                <TableCell>
                  <ArrowForwardIcon />
                </TableCell>
                <TableCell>{end.toFormat(shortDate)}</TableCell>
                <TableCell>
                  <Cash value={perPayday} compact={false} /> x {count}
                </TableCell>
              </TableRow>
            );
          }
        )}
        <TableRow>
          <TableCell colSpan={4}>Total:</TableCell>
          <TableCell>
            <Cash value={totalIncome} compact={false} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
