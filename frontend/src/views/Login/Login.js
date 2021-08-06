import React, { useState, useEffect, useRef } from "react";
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
  loginPage: {
    padding: "20px 10px",
  },
  registerAsk: {
    paddingLeft: "7px",
  },
  registerLink: {
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

const Login = ({ history }) => {
  const classes = useStyles();

  const [userInfo, setUserInfo] = useState({});
  /*loading states go below, (when the user is logged in there will be loading inside the global state, so every loading action inside the website will be depends on that loading)*/
  const [serverWait, setServerWait] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [toastFinished, setToastFinished] = useState(true);
  const dispatch = useDispatch();
  const globalState = useSelector((state) => state);
  /*changeHandler, when the username or password input changes I will set the userInfo state which is the object to send to the server*/
  const changeHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  };

  const submitHandler = async () => {
    setServerWait(true);
    setToastFinished(false);
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
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

      toast.success(parsedResponse.msg);
      setTimeout(() => {
        setToastFinished(true);
      }, 3500);
      history.push("/");
    } catch (err) {
      toast.error(err, {
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
    <div className={classes.loginPage}>
      {checkingToken ? (
        <img src="loading.gif" class={classes.bigLoader} />
      ) : (
        <GridContainer justify="center">
          <GridItem xs={12} sm={9} md={5}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Login</h4>
                <p className={classes.cardCategoryWhite}>Join and Enjoy</p>
              </CardHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (toastFinished) submitHandler();
                }}
              >
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        labelText="Username"
                        id="username"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => changeHandler(e),
                          required: true,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "password",
                          onChange: (e) => changeHandler(e),
                          required: true,
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
                    Login
                  </Button>
                </CardFooter>
              </form>

              <h4 className={classes.registerAsk}>
                Don't Have an Account?{" "}
                <span className={classes.registerLink}>
                  <Link to="/register">Register</Link>
                </span>
              </h4>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </div>
  );
};

export default Login;
