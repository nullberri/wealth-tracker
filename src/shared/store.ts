import { Store as CreateStore } from "@tanstack/store";
import merge from "deepmerge";
import { ZodSchema } from "zod";
import { Store, getDefaultStore, storeValidator } from "./models/store";

const createStore = <T extends object>(
  key: string,
  validator: ZodSchema,
  defaultValue: T
) => {
  const localData = localStorage.getItem(key);
  let data = localData ? JSON.parse(localData) : defaultValue;
  const parse = validator.safeParse(data);

  if (!parse.success) {
    console.log("zod error", parse.error);
    console.log("original", data);

    const next = merge(data, defaultValue);
    console.log("merged", next);
    localStorage.setItem(`${key}-previous`, JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(next));
    data = next;
  }

  const store = new CreateStore<T>(data);
  store.subscribe(() => {
    const current = localStorage.getItem(key);
    current && localStorage.setItem(`${key}-previous`, current);
    localStorage.setItem(key, JSON.stringify(store.state));
  });

  return store;
};

export const store = createStore<Store>(
  "store",
  storeValidator,
  getDefaultStore()
);
