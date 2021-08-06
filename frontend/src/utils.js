export const checkStoredToken = async () => {
  const tokenToCheck = localStorage.getItem("token");
  if (tokenToCheck) {
    try {
      const response = await fetch(
        "https://serverclient-auth-assignment.herokuapp.com/check-token",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenToCheck }),
        }
      );
      const { valid, data } = await response.json();
      return { valid, data };
    } catch (err) {
      return { valid: false };
    }
  } else return { valid: false };
};
