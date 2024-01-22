/* eslint-disable prettier/prettier */
export class DateUtil {

    public static isFutureDate(date: Date | string): boolean {
        return new Date(date) > new Date();
    }
}