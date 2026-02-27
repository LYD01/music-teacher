// Vercel Postgres (Neon) + Drizzle ORM
// Uses @vercel/postgres which reads POSTGRES_URL from env automatically

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle(sql);
