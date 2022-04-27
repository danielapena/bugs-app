import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  addBug,
  resolveBug,
  loadBugs,
  getUnresolvedBugs,
} from "../slices/bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  let store;
  let fakeAxios;

  beforeEach(() => {
    store = configureStore();
    fakeAxios = new MockAdapter(axios);
  });

  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("should add the bug to the store if it is saved to the server", async () => {
    // arrange
    const bug = { description: "a" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    // act
    await store.dispatch(addBug(bug));

    // assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the bug to the store if it not saved to the server", async () => {
    // arrange
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    // act
    await store.dispatch(addBug(bug));

    // assert
    expect(bugsSlice().list).toHaveLength(0);
  });

  it("should mark the bug as resolved if saved to the server", async () => {
    //arrange
    const bug = { description: "a" };
    const bugSaved = { ...bug, id: 1, resolved: false };
    const bugResolved = { ...bugSaved, resolved: true };
    fakeAxios.onPost("/bugs").reply(200, bugSaved);
    fakeAxios.onPatch("/bugs/1").reply(200, bugResolved);

    //act
    await store.dispatch(addBug(bug));
    await store.dispatch(resolveBug(bugSaved));

    //assert
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark the bug as resolved if not saved to the server", async () => {
    //arrange
    const bug = { description: "a" };
    const bugSaved = { ...bug, id: 1, resolved: false };
    fakeAxios.onPost("/bugs").reply(200, bugSaved);
    fakeAxios.onPatch("/bugs/1").reply(500);

    //act
    await store.dispatch(addBug(bug));
    await store.dispatch(resolveBug(bugSaved));

    //assert
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  it("should load bugs if the server request is successful", async () => {
    fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

    await store.dispatch(loadBugs());

    expect(bugsSlice().list).toHaveLength(1);
  });

  describe("selectors", () => {
    it("should get unresolved bugs", async () => {
      const state = createState();
      state.entities.bugs.list = [{ id: 1 }, { id: 2, resolved: true }];

      const result = getUnresolvedBugs(state);

      expect(result).toHaveLength(1);
    });
  });
});
