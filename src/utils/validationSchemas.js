export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3-20 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: true,
  },
};

export const getUsersValidationSchema = {
  filter: {
    isString: { errorMessage: "filter must be a string" },
    nonEmpty: { errorMessage: "filter cannot be empty" },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "filter must be a string between 3-10 characters",
    },
  },
};
