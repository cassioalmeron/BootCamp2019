import reducer, { INICIAL_STATE } from "~/store/modules/techs/reducer";
import * as Techs from "~/store/modules/techs/actions";

describe("Techs reducer", () => {
  it("DEFAULT", () => {
    const state = reducer(undefined, {});

    expect(state).toStrictEqual(INICIAL_STATE);
  });

  it("ADD_TECH", () => {
    const state = reducer(INICIAL_STATE, Techs.addTech("Node.js"));

    expect(state).toStrictEqual(["Node.js"]);
  });
});
