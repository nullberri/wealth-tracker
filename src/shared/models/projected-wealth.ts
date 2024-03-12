import { z } from "zod";
import { accountDataValidator } from "./account-data";

export const projectedWealth = z.object({
  timeSeries: z.object({
    monthlyIncome: z.array(accountDataValidator),
    retirementRate: z.array(accountDataValidator),
    savingsRate: z.array(accountDataValidator),
    meritBonusPct: z.array(accountDataValidator),
    companyBonusPct: z.array(accountDataValidator),
    meritBonus: z.array(accountDataValidator),
    companyBonus: z.array(accountDataValidator),
    mrpBonus: z.array(accountDataValidator),
    equityPct: z.array(accountDataValidator),
    meritIncreasePct: z.array(accountDataValidator),
  }),
});

export type ProjectedWealth = z.infer<typeof projectedWealth>;
export type TimeSeries = keyof ProjectedWealth["timeSeries"];
