import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { create } from "mutative";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { formatCashShort } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";

export const createAccountColumnConfig = (
  accountName: string
): ColDef<AccountData>[] => [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    valueFormatter: (x) => formatCashShort(x.value),
    type: "numericColumn",
  },
  {
    headerName: "Actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            store.setState((prev) => {
              return create(prev, (next) => {
                const idxToRemove = next.wealth[accountName].data.findIndex(
                  (x) => x.id === props.data?.id
                );
                next.wealth[accountName].data.splice(idxToRemove, 1);
                return next;
              });
            });
          }}
          color="error"
        >
          <DeleteForeverIcon />
        </Button>
      );
    },
  },
];
