import { drizzle } from "drizzle-orm/d1";
export {
  sql,
  eq,
  and,
  or,
  inArray,
  gt,
  gte,
  lt,
  lte,
  asc,
  desc,
} from "drizzle-orm";

export function useDrizzle() {
  return drizzle(hubDatabase());
}
