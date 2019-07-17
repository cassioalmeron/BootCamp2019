import React, { Component } from "react";

import TechItem from "./TechItem";

class TechList extends Component {
  // static defaultProps = {
  //   newTech: "Inicial"
  // }

  state = {
    newTech: "",
    techs: []
  };

  // Métodos de Ciclio de Vida:
  // executado assim que o componente aparece em tela
  componentDidMount() {
    const techs = localStorage.getItem("techs");

    if (techs) this.setState({ techs: JSON.parse(techs) });

    //localStorage.setItem("techs", JSON.stringify(this.state.techs));
  }

  // executado sempre que houver alterações nas props ou estado
  // prevProps: propriedades antigas
  // prevState: estado antigas
  componentDidUpdate(prevProps, prevState) {
    if (prevState.techs !== this.state.techs)
      localStorage.setItem("techs", JSON.stringify(this.state.techs));
    // console.log("x");
  }

  // executado quando o componente deixa de existir
  componentWillUnmount() {}

  // tem que ser arrow funtion, para que tenha acesso ao this
  handleInputChange = e => {
    //isso não funciona, porque o state é imutável
    //this.state.newTeck = e.target.value
    this.setState({ newTech: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      techs: [...this.state.techs, this.state.newTech],
      newTeck: ""
    });
  };

  handleDelete = tech => {
    this.setState({ techs: this.state.techs.filter(x => x !== tech) });
  };

  render() {
    return (
      // <> Fragment Tag, não será gerado no Html final
      <form onSubmit={this.handleSubmit}>
        <ul>
          {this.state.techs.map(tech => (
            <TechItem
              key={tech}
              tech={tech}
              onDelete={() => this.handleDelete(tech)}
            />
          ))}
        </ul>

        <input
          type="text"
          onChange={this.handleInputChange}
          value={this.state.newTech}
        />

        <button type="submit">Enviar</button>
      </form>
    );
  }
}

export default TechList;
