import axios from "axios";
import * as actions from "../api";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { method, url, data, onSuccess, onError, onStart } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
      const response = await axios.request({
        baseURL: process.env.REACT_APP_API_ENDPOINT,
        url,
        method,
        data,
      });

      dispatch({ type: actions.apiCallSuccess.type, payload: response.data });

      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      dispatch(actions.apiCallFailed(error.message));

      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
