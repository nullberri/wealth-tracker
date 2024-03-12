import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { ReactNode, useMemo } from "react";

interface DurationProps {
  dateTime: DateTime;
  children?: ReactNode;
}
export const Duration = ({ dateTime, children }: DurationProps) => {
  const countDownStr = useMemo(
    () => dateTime.diffNow(["months", "days", "hours"]).toFormat("d'd'"),
    [dateTime]
  );

  const countDownColor = useMemo(() => {
    const days = dateTime.diffNow("days").days;
    if (days < 30) {
      return "green";
    } else if (days < 60) {
      return "yellow";
    }
    return "red";
  }, [dateTime]);

  return dateTime > DateTime.local() ? (
    <Box color={countDownColor}>{countDownStr}</Box>
  ) : (
    children
  );
};
