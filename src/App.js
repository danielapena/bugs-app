import { Provider } from "react-redux";
import "./App.css";

import configureStore from "./store/configureStore";

import { BugsList } from "./components/BugsList";
import { NewBug } from "./components/NewBug";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <h1>Unresolved bugs</h1>
      <BugsList />
      <NewBug />
    </Provider>
  );
}

export default App;
