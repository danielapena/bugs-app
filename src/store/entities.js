import { combineReducers } from "redux";

import projectsReducer from "./slices/projects";
import bugsReducer from "./slices/bugs";
import usersReducer from "./slices/users";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
  users: usersReducer,
});
