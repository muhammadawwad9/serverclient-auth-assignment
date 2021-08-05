import React, { useState } from "react";
import { toast } from "react-toastify";

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

import avatar from "assets/img/faces/marc.jpg";

/*I want to access the global state in order to show the user information in the fields, and its possible ton update info.*/
import { useSelector, useDispatch } from "react-redux";

const styles = {
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

export default function UserProfile() {
  const classes = useStyles();

  const dispatch = useDispatch();
  /*I want to retrieve the current user info from the global state so the user can have placeholder values for the current info before updating. I will use the curent information as the default values inside the defaultFields state below*/
  const {
    username,
    firstName,
    lastName,
    email,
    city,
    country,
    postalCode,
    about,
    loading,
  } = useSelector((state) => state);

  const [defaultFields, setDefaultFields] = useState({
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    city: city,
    country: country,
    postalCode: postalCode,
    about: about,
  });
  const [toastFinished, setToastFinished] = useState(true);

  //updateHandler
  const updateHandler = async () => {
    setToastFinished(false);

    dispatch({ type: "LOADING", payload: true });
    try {
      const response = await fetch("http://localhost:4000/update-profile", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(defaultFields),
      });
      const parsedResponse = await response.json();
      dispatch({ type: "LOADING", payload: false });

      if (parsedResponse.updatedUser) {
        toast.success(parsedResponse.msg);
        setTimeout(() => setToastFinished(true), 3500);
      } else {
        toast.error("Something Went Wrong!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => setToastFinished(true), 3500);

        return;
      }
    } catch (err) {
      setToastFinished(true);

      alert("something went wrong!");
    }
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (toastFinished) updateHandler();
              }}
            >
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
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
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: defaultFields.username,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            username: e.target.value,
                          }),
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
                        value: defaultFields.email,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            email: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: defaultFields.firstName,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            firstName: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: defaultFields.lastName,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            lastName: e.target.value,
                          }),
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
                        value: defaultFields.city,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            city: e.target.value,
                          }),
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
                        value: defaultFields.country,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            country: e.target.value,
                          }),
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
                        value: defaultFields.postalCode,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            postalCode: e.target.value,
                          }),
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
                        value: defaultFields.about,
                        onChange: (e) =>
                          setDefaultFields({
                            ...defaultFields,
                            about: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              {loading ? (
                <img src="/loading-dots.gif" className={classes.serverLoader} />
              ) : null}
              <CardFooter>
                <Button color="primary" type="submit" disabled={!toastFinished}>
                  Update Profile
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
