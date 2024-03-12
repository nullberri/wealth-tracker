import { formatCashShort } from "shared/utility/format-cash";

interface CashProps {
  value?: number;
}
export const Cash = ({ value }: CashProps) => {
  return value ? formatCashShort(value) : 0;
};
