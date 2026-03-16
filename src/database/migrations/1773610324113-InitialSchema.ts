import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773610324113 implements MigrationInterface {
    name = 'InitialSchema1773610324113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_to_sources" DROP CONSTRAINT "FK_b9f01108c9c5c360bc3d5cf7fc7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9f01108c9c5c360bc3d5cf7fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52a7aa3c73770b0d26ea35fd50"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderDate" SET DEFAULT '"2026-03-15T21:32:07.363Z"'`);
        await queryRunner.query(`CREATE INDEX "IDX_b9f01108c9c5c360bc3d5cf7fc" ON "order_to_sources" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_52a7aa3c73770b0d26ea35fd50" ON "order_to_sources" ("orderSourceId") `);
        await queryRunner.query(`ALTER TABLE "order_to_sources" ADD CONSTRAINT "FK_b9f01108c9c5c360bc3d5cf7fc7" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_to_sources" DROP CONSTRAINT "FK_b9f01108c9c5c360bc3d5cf7fc7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52a7aa3c73770b0d26ea35fd50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9f01108c9c5c360bc3d5cf7fc"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderDate" SET DEFAULT '2026-03-15 20:41:31.228'`);
        await queryRunner.query(`CREATE INDEX "IDX_52a7aa3c73770b0d26ea35fd50" ON "order_to_sources" ("orderSourceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9f01108c9c5c360bc3d5cf7fc" ON "order_to_sources" ("orderId") `);
        await queryRunner.query(`ALTER TABLE "order_to_sources" ADD CONSTRAINT "FK_b9f01108c9c5c360bc3d5cf7fc7" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
