import * as dotenv from "dotenv";
import NodeEnvironment from "jest-environment-node";
import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { Client } from "pg";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";

dotenv.config({ path: ".env" });

const execSync = promisify(exec);

export default class PrismaTestEnvironment extends NodeEnvironment {
  private readonly schema: string;
  private readonly connectionString: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

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
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync("npx prisma migrate dev");

    await super.setup();
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
