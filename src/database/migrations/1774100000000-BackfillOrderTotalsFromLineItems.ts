import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * One-time reconciliation so dashboard revenue (SUM orders.amount) and header
 * totals match line math, matching OrderService.normalizeLineQuantity / lineRevenue.
 *
 * Before mutating data, creates snapshot tables in the same database:
 *   - orders_backup_before_1774100000000
 *   - order-items_backup_before_1774100000000
 * (no indexes/FKs; row copies only). Drop manually after you verify production.
 *
 * Note: If legacy rows have incorrect line quantities in the DB, this cannot infer
 * the true units sold; it only aligns headers to whatever is stored on lines.
 */
export class BackfillOrderTotalsFromLineItems1774100000000
  implements MigrationInterface
{
  name = 'BackfillOrderTotalsFromLineItems1774100000000';

  private static readonly ordersBackup = 'orders_backup_before_1774100000000';
  private static readonly orderItemsBackup =
    'order-items_backup_before_1774100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $guard$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = '${BackfillOrderTotalsFromLineItems1774100000000.ordersBackup}'
        ) THEN
          RAISE EXCEPTION 'Backup table % already exists. Drop it only if you are sure, then re-run.',
            '${BackfillOrderTotalsFromLineItems1774100000000.ordersBackup}';
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = '${BackfillOrderTotalsFromLineItems1774100000000.orderItemsBackup}'
        ) THEN
          RAISE EXCEPTION 'Backup table % already exists. Drop it only if you are sure, then re-run.',
            '${BackfillOrderTotalsFromLineItems1774100000000.orderItemsBackup}';
        END IF;
      END
      $guard$;
    `);

    await queryRunner.query(`
      CREATE TABLE "${BackfillOrderTotalsFromLineItems1774100000000.ordersBackup}" AS
      SELECT * FROM orders
    `);
    await queryRunner.query(`
      CREATE TABLE "${BackfillOrderTotalsFromLineItems1774100000000.orderItemsBackup}" AS
      SELECT * FROM "order-items"
    `);

    await queryRunner.query(`
      UPDATE "order-items" oi
      SET "unitCostSnapshot" = p.cost
      FROM "product" p
      WHERE oi."productId" = p.id
        AND oi."unitCostSnapshot" IS NULL
    `);

    await queryRunner.query(`
      UPDATE orders o
      SET
        amount = agg.line_revenue,
        quantity = agg.line_units
      FROM (
        SELECT
          oi."orderId" AS oid,
          SUM(
            oi.price * GREATEST(1, FLOOR(COALESCE(oi.quantity, 0)::numeric))
          )::double precision AS line_revenue,
          SUM(
            GREATEST(1, FLOOR(COALESCE(oi.quantity, 0)::numeric))
          )::int AS line_units
        FROM "order-items" oi
        GROUP BY oi."orderId"
      ) agg
      WHERE o.id = agg.oid
    `);
  }

  public async down(): Promise<void> {
    /*
     * Data changes are not auto-reverted. To restore from snapshots (after stopping traffic):
     *   TRUNCATE "order-items", orders RESTART IDENTITY CASCADE;
     *   INSERT INTO orders SELECT * FROM orders_backup_before_1774100000000;
     *   INSERT INTO "order-items" SELECT * FROM "order-items_backup_before_1774100000000";
     * Then fix sequences if needed. Backup tables are intentionally left in place;
     * drop them manually when no longer needed.
     */
  }
}
