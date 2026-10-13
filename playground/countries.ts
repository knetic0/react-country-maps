import type { Country } from "../src/core/types";

const modules = import.meta.glob<{ default: Country }>("../src/countries/*/index.ts", { eager: true });

export const countries: Country[] = Object.values(modules)
  .map((m) => m.default)
  .filter((c): c is Country => c != null && c.regions?.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));
