import { z } from "zod";

export const projectedWealth = z.object({
  socialSecurityCap: z.number(),
  socialSecurityTaxPct: z.number(),
  medicareSupplementalTaxCap: z.number(),
  medicareSupplementalTaxPct: z.number(),
  savingsRate: z.number(),
});

export type ProjectedWealth = z.infer<typeof projectedWealth>;
