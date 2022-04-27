import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";

const slice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    projectsRequested: (projects, action) => {
      projects.loading = true;
    },
    projectRequestedFailed: (projects, action) => {
      projects.loading = false;
    },
    projectAdded: (projects, action) => {
      projects.push(action.payload);
    },
  },
});

export const { projectAdded, projectsRequested, projectRequestedFailed } =
  slice.actions;
export default slice.reducer;

export function addProject(name) {
  apiCallBegan({
    url: `/projects`,
    method: "POST",
    data: { name: name },
    onStart: projectsRequested.type,
    onSuccess: projectAdded.type,
    onError: projectRequestedFailed.type,
  });
}
