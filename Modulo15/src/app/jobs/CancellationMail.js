import * as DateFns from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";

class CancellationMail {
  get key() {
    return "CancellationMail"; // para cada job precisa de uma chave única
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log("a fila executou!");

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Agendamento cancelado",
      // text: "Você tem um novo cancelamento"
      template: "cancellation",
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: DateFns.format(
          DateFns.parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}

export default new CancellationMail();
