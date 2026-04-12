import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemUnitCostSnapshot1774000000000
  implements MigrationInterface
{
  name = 'AddOrderItemUnitCostSnapshot1774000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD "unitCostSnapshot" double precision`,
    );
    await queryRunner.query(`
      UPDATE "order-items" oi
      SET "unitCostSnapshot" = p.cost
      FROM "product" p
      WHERE oi."productId" = p.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-items" DROP COLUMN "unitCostSnapshot"`,
    );
  }
}
