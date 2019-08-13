import React, { useState, useMemo, useEffect } from "react";
import * as DateFns from "date-fns";
import * as DateFnsTz from "date-fns-tz";
import pt from "date-fns/locale/pt";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import api from "~/services/api";

import { Container, Time } from "./styles";

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => DateFns.format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      const response = await api.get("schedule", { params: { date } });

      console.tron.log("TESTE1");
      console.tron.log("response:", response);
      console.tron.log("TESTE2");
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.tron.log("TESTE3");
      console.tron.log("RANGE:", range);

      // try {
      const data = range.map(hour => {
        let checkDate = DateFns.setHours(date, hour);
        checkDate = DateFns.setMinutes(checkDate, 0);
        checkDate = DateFns.setSeconds(checkDate, 0);

        const compareDate = DateFnsTz.utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: DateFns.isBefore(compareDate, new Date()),
          appointment: response.data.find(a =>
            DateFns.isEqual(DateFns.parseISO(a.date), compareDate)
          ),
        };
      });

      console.tron.log("DATA:", data);

      setSchedule(data);
      // } catch (ex) {
      //   console.tron.log(ex);
      // }
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(DateFns.subDays(date, 1));
  }

  function handleNextDay() {
    setDate(DateFns.addDays(date, 1));
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#FFF" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#FFF" />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : "Em Aberto"}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
