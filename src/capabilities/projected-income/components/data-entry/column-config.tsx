import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Tooltip } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { create } from "mutative";
import { AccountData } from "shared/models/account-data";
import { TimeSeries } from "shared/models/projected-wealth";
import { store } from "shared/store";
import { formatCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import UpdateIcon from "@mui/icons-material/Update";
import { Stack } from "@mui/system";

export const createAccountColumnConfig = (
  accountName: TimeSeries,
  variant: "number" | "cash" | "percent"
): ColDef<AccountData>[] => [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data && DateTime.fromISO(x.data.date),
    cellRenderer: (x: ICellRendererParams<unknown, DateTime>) => {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          {x.valueFormatted}&nbsp;
          {x.value && x.value > DateTime.local() && (
            <Tooltip title="Future Event">
              <UpdateIcon htmlColor="yellow" />
            </Tooltip>
          )}
        </Stack>
      );
    },
  },
  {
    headerName: "Value",
    valueGetter: (x) => x.data?.value,
    valueFormatter: (x) =>
      variant === "number"
        ? x.value
        : variant === "cash"
        ? formatCash(x.value)
        : (x.value * 100).toFixed(2) + "%",
    type: "numericColumn",
    editable: true,
    cellEditor: "agNumberCellEditor",
    valueSetter: (x) => {
      store.setState((prev) => {
        const next = create(prev, (next) => {
          const account = next.projectedIncome.timeSeries[accountName];
          const idx = account.findIndex(({ id }) => id === x.data.id);
          account[idx].value = +x.newValue;
        });
        return next;
      });
      return true;
    },
  },
  {
    headerName: "Actions",
    cellRenderer: (props: CustomCellRendererProps<AccountData>) => {
      return (
        <Button
          onClick={() => {
            store.setState((prev) => {
              return create(prev, (next) => {
                const idxToRemove = next.projectedIncome.timeSeries[
                  accountName
                ].findIndex((x) => x.id === props.data?.id);
                next.projectedIncome.timeSeries[accountName].splice(
                  idxToRemove,
                  1
                );
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
