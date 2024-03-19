import { DateTime } from "luxon";
import { useYearlyWealth } from "./hooks/use-yearly-wealth";

export const ProjectedWealth = () => {
  return (
    <>
      {JSON.stringify(
        useYearlyWealth(DateTime.local(), DateTime.fromObject({ year: 2024 })),
        null,
        2
      )}
      <br />
      {JSON.stringify(
        useYearlyWealth(
          DateTime.fromObject({ year: 2024 }),
          DateTime.fromObject({ year: 2022 })
        ),
        null,
        2
      )}
      <br />
      {JSON.stringify(
        useYearlyWealth(
          DateTime.fromObject({ year: 2023 }),
          DateTime.fromObject({ year: 2022 })
        ),
        null,
        2
      )}
      <br />
      {JSON.stringify(
        useYearlyWealth(
          DateTime.fromObject({ year: 2022 }),
          DateTime.fromObject({ year: 2021 })
        ),
        null,
        2
      )}
      <br />
      {JSON.stringify(
        useYearlyWealth(
          DateTime.fromObject({ year: 2021 }),
          DateTime.fromObject({ year: 2020 })
        ),
        null,
        2
      )}
      <br />
      {JSON.stringify(
        useYearlyWealth(
          DateTime.fromObject({ year: 2020 }),
          DateTime.fromObject({ year: 2019 })
        ),
        null,
        2
      )}
      <br />
    </>
  );
};

/*
Show Year+1 

future savings:
  +SSN 
  -Medicare surplus
  +SDI limit
  +Monthly Saving rate target
  +Bonuses remaining
    - April, June, July
  +EOY home equity


When do we hit SSN limit, 168600 2024
when do we hit mediare surplus (.009 on all wages over 200k )
when do we hit SDI limit


Show all prior years on jan 1 20xx for which we have data
YoY Growth in %
YoY growth in $


*/
