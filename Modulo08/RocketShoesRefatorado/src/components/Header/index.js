import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { MdShoppingBasket } from "react-icons/md";
import { Container, Cart } from "./styles";

import logo from "../../assets/images/logo.svg";

export default function Header() {
  const cartSize = useSelector(state => state.cart.length);

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Cia Store" />
      </Link>

      <Cart to="/Cart">
        <div>
          <strong>Meu Carrinho</strong>
          <span>{cartSize} itens</span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
}
