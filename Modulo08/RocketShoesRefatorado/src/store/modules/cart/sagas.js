import { call, select, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import api from "../../../services/api";
import history from "../../../services/history";
import { formatPrice } from "../../../util/format";
import { addToCartSuccess, updateAmountSuccess } from "./actions";

function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);
  const stockAmount = stock.data.amount;
  //console.tron.log(stockAmount);
  const currentAmount = productExists ? productExists.amount : 0;
  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error("Quantidade solicitada fora do estoque");
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
    history.push("/cart");
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  console.tron.log(amount);
  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error("Quantidade solicitada fora do estoque");
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

// takeLatest: útil para evitar quando o usuário clica varias vezes muito rápido.
// enquanto uma requisição não terminar, só será considerada a útima
// evitando por exemplo, adicionar o mesmo item 2x indevidamente
export default all([
  takeLatest("@cart/ADD_REQUEST", addToCart),
  takeLatest("@cart/UPDATE_AMOUNT_REQUEST", updateAmount),
]);
