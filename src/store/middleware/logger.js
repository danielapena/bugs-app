const logger = (store) => (next) => (action) => {
  console.log("Logging"); // TODO: Add logging middleware
  next(action);
};

export default logger;
