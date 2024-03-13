import { formatCashShort } from "shared/utility/format-cash";

interface CashProps {
  value?: number;
  fallback?: number;
}
export const Cash = ({ value, fallback }: CashProps) => {
  return value ? formatCashShort(value) : fallback;
};
