const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  city: "",
  country: "",
  postalCode: "",
  about: "",
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DATA":
      return action.payload;
    case "RESET":
      return null;
  }
  return state;
};

export default userReducer;
