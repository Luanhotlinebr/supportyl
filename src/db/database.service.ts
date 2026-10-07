import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class DatabaseService {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    this.db = drizzle({ client: this.pool });
  }
}
