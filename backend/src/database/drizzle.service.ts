import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, or, sql } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from './database.constants';

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase,
  ) { }

  /**
   * Find a record by ID
   * @param table The table to query
   * @param id The ID to search for
   * @returns The found record or null
   */
  async findById(table: any, id: string) {
    const result = await this.db.select().from(table).where(eq(table.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Find a record by ID and throw an exception if not found
   * @param table The table to query
   * @param id The ID to search for
   * @returns The found record
   * @throws NotFoundException if no record is found
   */
  async findOneById(table: any, id: string) {
    const record = await this.findById(table, id);
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found in ${table.name}`);
    }
    return record;
  }

  /**
   * Find all records in a table
   * @param table The table to query
   * @param options Optional pagination parameters
   * @returns Array of records
   */
  async findAll(table: any, options?: { limit?: number; offset?: number }) {
    let query = this.db.select().from(table);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return query;
  }

  /**
   * Create a new record
   * @param table The table to insert into
   * @param data The data to insert
   * @returns The created record
   */
  async create(table: any, data: any) {
    const result = await this.db.insert(table).values(data).returning();
    return result[0];
  }

  /**
   * Update a record by ID
   * @param table The table to update
   * @param id The ID of the record to update
   * @param data The data to update
   * @returns The updated record
   */
  async update(table: any, id: string, data: any) {
    const result = await this.db
      .update(table)
      .set(data)
      .where(eq(table.id, id))
      .returning();
    return result[0];
  }

  /**
   * Delete a record by ID
   * @param table The table to delete from
   * @param id The ID of the record to delete
   * @returns The deleted record
   */
  async delete(table: any, id: string) {
    const result = await this.db
      .delete(table)
      .where(eq(table.id, id))
      .returning();
    return result[0];
  }

  /**
   * Find records by a specific field value
   * @param table The table to query
   * @param field The field to filter by
   * @param value The value to match
   * @returns Array of matching records
   */
  async findByField(table: any, field: any, value: any) {
    return this.db.select().from(table).where(eq(field, value));
  }

  /**
   * Execute a custom query
   * @param callback Function that receives the db instance
   * @returns Query result
   */
  async executeQuery<T>(callback: (db: NodePgDatabase) => Promise<T>): Promise<T> {
    return callback(this.db);
  }

  /**
   * Get the raw database instance
   * @returns The Drizzle database instance
   */
  getDb() {
    return this.db;
  }
}