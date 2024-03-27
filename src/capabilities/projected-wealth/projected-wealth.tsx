import { Grid, Paper } from "@mui/material";
import { AgGrid } from "shared/components/ag-grid";
import { columnConfig } from "./colum-config";
import { useTimeSeriesWealth } from "./hooks/use-times-series-wealth";
import { WealthChart } from "./wealth-chart";

export const ProjectedWealth = () => {
  const data = useTimeSeriesWealth();
  return (
    <Grid container height={"100%"} spacing={2}>
      <Grid item xs={6} height={"50%"}>
        <WealthChart />
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <pre>SSN Medicare Savings</pre>
        </Paper>
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <AgGrid
          id="time-series-wealth"
          rowData={data}
          columnDefs={columnConfig}
        />
      </Grid>
      <Grid item xs={6} height={"50%"}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <div> Stats</div>
        </Paper>
      </Grid>
    </Grid>
  );
};
