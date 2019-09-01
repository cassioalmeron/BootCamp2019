import React, { useEffect, useState } from "react";
import { withNavigationFocus } from 'react-navigation'
import Icon from "react-native-vector-icons/MaterialIcons";

import Background from "~/components/Background";

import { Container, Title, List } from "./styles";
import Appointment from "~/components/Appointment";
import api from "~/services/api";

function Dashboard({ isFocused }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function loadAppointments() {
      const response = await api.get("appointments");
      setAppointments(response.data);

      console.tron.log(response.data);
    }

    loadAppointments();
  }, [isFocused]);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);

    setAppointments(
      appointments.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              canceled_at: response.data.canceled_at
            }
          : appointment
      )
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointments}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Appointment data={item} onCancel={() => handleCancel(item.id)} />
          )}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: "Agendamentos",
  tabBarIcon: ({ tintColor }) => (
    <Icon name="event" size={20} color={tintColor} />
  )
};

export default withNavigationFocus(Dashboard);