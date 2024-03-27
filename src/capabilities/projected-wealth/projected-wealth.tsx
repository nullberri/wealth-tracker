import { Grid, Paper, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { AgGrid } from "shared/components/ag-grid";
import { columnConfig } from "./colum-config";
import { useTimeSeriesWealth } from "./hooks/use-times-series-wealth";

export const ProjectedWealth = () => {
  const data = useTimeSeriesWealth();
  return (
    <Grid container height={"100%"} spacing={2}>
      <Grid item xs={6}>
        <Stack height="100%" spacing={2}>
          <Box height={"50%"}> chart here</Box>
          <Box height={"50%"}>
            <AgGrid
              id="time-series-wealth"
              rowData={data}
              columnDefs={columnConfig}
            />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ height: "100%", width: "100%", padding: 2 }}>
          Config goes here
        </Paper>
      </Grid>
    </Grid>
  );
};

/*
Show Year+1 

future savings:
  +SSN 
  -Medicare surplus
  +Monthly Saving rate target
 
When do we hit SSN limit, 168600 2024
when do we hit medicare surplus (.009 on all wages over 200k )

*/
