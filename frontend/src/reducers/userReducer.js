const initialState = null;
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DATA":
      return action.payload;
    case "CLEAR":
      return null;
    case "LOADING":
      return { ...state, loading: action.payload };
  }
  return state;
};

export default userReducer;
