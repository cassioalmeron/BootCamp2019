import React, { Component } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Title,
  Author,
  Info,
  Loading
} from "./styles";

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("user").name
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func
    }).isRequired
  };

  state = {
    stars: [],
    page: 1,
    loading: false
  };

  async componentDidMount() {
    await this.carregar();
  }

  carregaMaisItens = async () => {
    this.carregar();
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate("Repository", { repository });
  };

  async carregar() {
    const { navigation } = this.props;
    let { stars, page, loading } = this.state;

    if (page > 1 && stars.length < 30) return;

    const user = navigation.getParam("user");

    // console.tron.log(`Page ${page}`);

    let strPage = "";
    if (page > 1) strPage = `?page=${page}`;

    loading = true;
    this.setState({ loading });
    const response = await api.get(`/users/${user.login}/starred${strPage}`);

    stars = [...stars, ...response.data];
    page++;

    loading = false;
    this.setState({ stars, page, loading });
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam("user");

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReached={() => this.carregaMaisItens()}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />

        {loading && <Loading />}
      </Container>
    );
  }
}
