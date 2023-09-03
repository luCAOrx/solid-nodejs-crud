import * as dotenv from "dotenv";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

dotenv.config({ path: ".env" });

export class PrismaTestEnvironment {
  private readonly schema: string;
  private readonly connectionString: string;

  constructor() {
    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASSWORD;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${String(dbUser)}:${String(
      dbPass
    )}@${String(dbHost)}:${String(dbPort)}/${String(dbName)}?schema=${
      this.schema
    }`;
  }

  async setup(): Promise<void> {
    process.env.DATABASE_URL = this.connectionString;

    execSync("npx prisma migrate dev");
  }

  async teardown(): Promise<void> {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
