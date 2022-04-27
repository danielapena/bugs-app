const errorHandler = (store) => (next) => (action) => {
  const { type, payload } = action;
  if (type === "error") {
    console.log(`Toastify: ${payload.message}`); // TODO: Add toasty message
  } else {
    return next(action);
  }
};

export default errorHandler;
