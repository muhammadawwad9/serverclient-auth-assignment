import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";

//importing functions from utils
import { checkStoredToken } from "../../utils";

const styles = {
  registerPage: {
    padding: "20px 10px",
  },
  loginAsk: {
    paddingLeft: "7px",
  },
  loginLink: {
    color: "#ab47bc",
  },
  bigLoader: {
    width: "200px",
    height: "200px",
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
  },
  serverLoader: {
    width: "75px",
    height: "75px",
    paddingLeft: "20px",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

const Register = ({ history }) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [about, setAbout] = useState("");
  const [checkingToken, setCheckingToken] = useState(true);
  const [serverWait, setServerWait] = useState(false);
  /*I don't want to show multiply toasts when clicking enter so fast several times! so I will allow another toast after 5s*/
  const [toastFinished, setToastFinished] = useState(true);
  const dispatch = useDispatch();
  //capitalizeStr
  const capitalizeStr = (str) => {
    return str[0].toUpperCase() + str.toLowerCase().slice(1);
  };
  //submitHandler()
  const submitHandler = async () => {
    setToastFinished(false);
    setServerWait(true);
    try {
      const userInfo = {
        username,
        firstName,
        lastName,
        email,
        password,
        city,
        country,
        postalCode,
        about,
      };
      //I want to capitalize some info from the object
      userInfo.firstName = capitalizeStr(userInfo.firstName);
      userInfo.lastName = capitalizeStr(userInfo.lastName);
      userInfo.city = capitalizeStr(userInfo.city);
      userInfo.country = capitalizeStr(userInfo.country);

      const response = await fetch(
        "https://serverclient-auth-assignment.herokuapp.com/register",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        }
      );
      const parsedResponse = await response.json();
      setServerWait(false);
      if (parsedResponse.err) {
        toast.error(parsedResponse.err, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          setToastFinished(true);
        }, 3500);
        return;
      }

      const { token } = parsedResponse;
      localStorage.setItem("token", token);
      dispatch({ type: "USER_DATA", payload: parsedResponse.data });
      history.push("/");
      toast.success(parsedResponse.msg);
      setTimeout(() => {
        setToastFinished(true);
      }, 3500);
    } catch (err) {
      setToastFinished(true);
      return toast.error(err, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  //I want to check if there is a stored token, if yes I want to make sure it is real!
  useEffect(() => {
    //self invoked function that
    (async function() {
      const { valid, data } = await checkStoredToken();
      if (valid) {
        dispatch({ type: "USER_DATA", payload: data });
        history.push("/");
      } else setCheckingToken(false);
    })();
  }, []);

  return (
    <div className={classes.registerPage}>
      {checkingToken ? (
        <img src="loading.gif" className={classes.bigLoader} />
      ) : (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Create an Account</h4>
                <p className={classes.cardCategoryWhite}>
                  Fill Up Your Details Below
                </p>
              </CardHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (toastFinished) submitHandler();
                }}
              >
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Company (disabled)"
                        id="company-disabled"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Username"
                        id="username"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setUsername(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Email address"
                        id="email-address"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setEmail(e.target.value),
                          type: "email",
                          required: true,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="First Name"
                        id="first-name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setFirstName(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Last Name"
                        id="last-name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setLastName(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Create Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "password",
                          onChange: (e) => setPassword(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="City"
                        id="city"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setCity(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Country"
                        id="country"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setCountry(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Postal Code"
                        id="postal-code"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => setPostalCode(e.target.value),
                          required: true,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <InputLabel style={{ color: "#AAAAAA" }}>
                        About me
                      </InputLabel>
                      <CustomInput
                        labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                        id="about-me"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 5,
                          onChange: (e) => setAbout(e.target.value),
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                {serverWait ? (
                  <img
                    src="loading-dots.gif"
                    className={classes.serverLoader}
                  />
                ) : null}

                <CardFooter>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={!toastFinished}
                  >
                    Register
                  </Button>
                </CardFooter>
              </form>
              <h4 className={classes.loginAsk}>
                Have an account?
                <span className={classes.loginLink}>
                  <Link to="/login"> Login</Link>
                </span>
              </h4>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </div>
  );
};

export default Register;
