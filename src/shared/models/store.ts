import { z } from "zod";
import { wealth } from "./net-wealth";
import { projectedIncome } from "./projected-income";
import { projectedWealth } from "./projected-wealth";

export const getDefaultStore = (): Store => ({
  projectedIncome: {
    timeSeries: {
      paycheck: [],
      retirementRate: [],
      savingsRate: [],
      meritBonusPct: [],
      companyBonusPct: [],
      meritBonus: [],
      companyBonus: [],
      retirementBonus: [],
      equityPct: [],
      meritIncreasePct: [],
    },
  },
  wealth: {},
  projectedWealth: {
    medicareSupplementalTaxCap: 200_000,
    socialSecurityCap: 168_600,
    socialSecurityTaxPct: 0.062,
    medicareSupplementalTaxPct: 0.009,
    savingsRate: 0,
  },
});

export const storeValidator = z.object({
  wealth: wealth,
  projectedIncome: projectedIncome,
  projectedWealth: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;
