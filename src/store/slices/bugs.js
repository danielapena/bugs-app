import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";

import { apiCallBegan } from "../api";

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestedFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
    bugAssigned: (bugs, action) => {
      const bugIndex = bugs.list.findIndex(
        (bug) => bug.id === action.payload.id
      );
      bugs.list[bugIndex].userId = action.payload.userId;
    },
  },
});

const {
  bugAdded,
  bugResolved,
  bugAssigned,
  bugsReceived,
  bugsRequested,
  bugsRequestedFailed,
} = slice.actions;

export default slice.reducer;

// Action creators
const url = "/bugs";

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestedFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "POST",
    data: bug,
    onStart: bugsRequested.type,
    onSuccess: bugAdded.type,
    onError: bugsRequestedFailed.type,
  });

export const resolveBug = (bug) =>
  apiCallBegan({
    url: `${url}/${bug.id}`,
    method: "PATCH",
    data: { resolved: true },
    onStart: bugsRequested.type,
    onSuccess: bugResolved.type,
    onError: bugsRequestedFailed.type,
  });

export const assignBug = (bug) =>
  apiCallBegan({
    url: `${url}/${bug.bugId}`,
    method: "PATCH",
    data: { userId: bug.userId },
    onStart: bugsRequested.type,
    onSuccess: bugAssigned.type,
    onError: bugsRequestedFailed.type,
  });

// Selectors
export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );

export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.list.filter((bug) => !bug.resolved)
);
