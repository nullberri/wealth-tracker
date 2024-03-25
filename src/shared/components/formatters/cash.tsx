import { Tooltip } from "@mui/material";
import { useMemo } from "react";
import { formatCash, formatCashShort } from "shared/utility/format-cash";

interface CashProps {
  value?: number;
  fallback?: number;
  disableTooltip?: boolean;
  compact?: boolean;
}
export const Cash = ({
  value,
  fallback,
  disableTooltip,
  compact = true,
}: CashProps) => {
  const formatted = useMemo(() => {
    if (!value) {
      return fallback;
    }
    return compact ? formatCashShort(value) : formatCash(value);
  }, [compact, fallback, value]);

  return (
    <Tooltip
      disableHoverListener={disableTooltip || !compact || !value}
      title={formatCash(value!)}
    >
      <span>{formatted}</span>
    </Tooltip>
  );
};
