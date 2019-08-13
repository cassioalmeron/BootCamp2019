import * as DateFns from "date-fns";

export function horaInicialDia(date: Date): Date {
  date = DateFns.setHours(date, 0);
  date = DateFns.setMinutes(date, 0);
  date = DateFns.setSeconds(date, 0);
  return date;
}

export function horaFinalDia(date: Date): Date {
  date = DateFns.setHours(date, 23);
  date = DateFns.setMinutes(date, 59);
  date = DateFns.setSeconds(date, 59);
  return date;
}
