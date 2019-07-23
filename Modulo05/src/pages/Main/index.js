import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

import api from "../../services/api";

import { Container } from "../../components/Container";
import { Form, SubmitButton, List } from "./styles";

export default class Main extends Component {
  state = {
    newRepo: "",
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem("repositories");

    if (repositories) this.setState({ repositories: JSON.parse(repositories) });
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories)
      localStorage.setItem("repositories", JSON.stringify(repositories));
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
    //console.log(this.state.newRepo);
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    var response = await api.get(`/repos/${this.state.newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...this.state.repositories, data],
      newRepo: "",
    });

    this.setState({ loading: false });

    //console.log(this.state.repositories);
  };

  render() {
    const { newRepo, loading, repositories } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
