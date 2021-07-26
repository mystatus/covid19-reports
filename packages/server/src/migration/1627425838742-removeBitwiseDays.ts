import {MigrationInterface, QueryRunner} from "typeorm";

interface OldMusterConfiguration {
    days: number | number[],
    startTime: string,
    timezone: string,
    durationMinutes: number,
    reportId?: string,
}

const bitwiseDaysOfWeek: number[] = [
    1,
    2,
    4,
    8,
    16,
    32,
    64,
];

const convertBitwiseDays = (bitwiseDay: number) => {
    let newDays: number[] = [];
    /* eslint-disable no-bitwise */
    if (bitwiseDay & 1) {
        newDays.push(1);
    }
    if (bitwiseDay & 2) {
        newDays.push(2);
    }
    if (bitwiseDay & 4) {
        newDays.push(3);
    }
    if (bitwiseDay & 8) {
        newDays.push(4);
    }
    if (bitwiseDay & 16) {
        newDays.push(5);
    }
    if (bitwiseDay & 32) {
        newDays.push(6);
    }
    if (bitwiseDay & 64) {
        newDays.push(7);
    }
    return newDays;
}

const deConvertBitwiseDays = (days: number[]) => {
    return days
    .map((day: number) => bitwiseDaysOfWeek[day - 1])
    .reduce((currNum: number, nextNum: number) => currNum + nextNum);
   }

export class removeBitwiseDays1627425838742 implements MigrationInterface {
    name = 'removeBitwiseDays1627425838742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const totalUnits = await queryRunner.query(`SELECT id, muster_configuration FROM unit`) as { id: number, muster_configuration: OldMusterConfiguration[] }[];;
        for (const unit of totalUnits) {
            if (unit.muster_configuration == null) {
                continue;
            }
            for (const musterConfiguration of unit.muster_configuration) {
                if (!musterConfiguration.days) {
                    continue;
                }
                if (typeof musterConfiguration.days === 'number') {
                    musterConfiguration.days = convertBitwiseDays(musterConfiguration.days);
                }
            }
            await queryRunner.query(
                `UPDATE "unit" SET muster_configuration=$1 WHERE id=${unit.id}`,
                [JSON.stringify(unit.muster_configuration)],
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const totalUnits = await queryRunner.query(`SELECT id, muster_configuration FROM unit`) as { id: number, muster_configuration: OldMusterConfiguration[] }[];;
        for (const unit of totalUnits) {
            if (unit.muster_configuration == null) {
                continue;
            }
            for (const musterConfiguration of unit.muster_configuration) {
                if (!musterConfiguration.days) {
                    continue;
                }
                if (typeof musterConfiguration.days !== 'number') {
                    musterConfiguration.days = deConvertBitwiseDays(musterConfiguration.days);
                }
            }
            await queryRunner.query(
                `UPDATE "unit" SET muster_configuration=$1 WHERE id=${unit.id}`,
                [JSON.stringify(unit.muster_configuration)],
            );
        }
    }

}
