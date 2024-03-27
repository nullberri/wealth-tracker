import UpdateIcon from "@mui/icons-material/Update";
import { Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DateTime } from "luxon";
import { formatCash } from "shared/utility/format-cash";
import { shortDate } from "shared/utility/format-date";
import { formatPercent } from "shared/utility/format-percent";
import { TimeSeriesWealth } from "./hooks/use-times-series-wealth";

export const columnConfig: ColDef<TimeSeriesWealth>[] = [
  {
    headerName: "Date",
    sort: "desc",
    valueFormatter: (x) => x.value?.toFormat(shortDate),
    valueGetter: (x) => x.data?.date,
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
    headerName: "Wealth",
    valueGetter: (x) => x.data?.wealth,
    valueFormatter: (x) => formatCash(x.data?.wealth ?? 0),
  },
  {
    headerName: "YoY ($)",
    valueGetter: (x) => x.data?.yoyCash,
    valueFormatter: (x) => (x.value != undefined ? formatCash(x.value) : ""),
  },
  {
    headerName: "YoY (%)",
    valueGetter: (x) => x.data?.yoyPct,
    valueFormatter: (x) =>
      x.value !== undefined ? formatPercent(x.value) : "",
  },
];
