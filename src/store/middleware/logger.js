const logger = (store) => (next) => (action) => {
  console.log("Logging"); // TODO: Add logging middleware
  return next(action);
};

export default logger;
