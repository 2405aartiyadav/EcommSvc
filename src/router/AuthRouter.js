const bcrypt = require("bcrypt");
const { Router } = require("express");
const AuthRouter = Router({ strict: true });
const User = require("../model/UserModel.js");
const jwt = require("../utility/JwtToken.js");

AuthRouter.get("/Authtest", (req, res) => {
  res.send("test authrouter");
});

AuthRouter.post("/signup", async (req, res) => {
  try {
    if (
      Object.keys(req.body).length != 0 &&
      Object.keys(req.body).toString().includes("firstName") &&
      Object.keys(req.body).toString().includes("lastName") &&
      Object.keys(req.body).toString().includes("email") &&
      Object.keys(req.body).toString().includes("username") &&
      Object.keys(req.body).toString().includes("password")
    ) {
      const { email, username, password, firstName, lastName } = req.body;

      // console.log(name+""+email+" "+password+" ");
      const existingUser = await User.findOne({ email, username });
      console.log("existingUser-" + existingUser);
      if (existingUser) {
        return res.status(400).send("User already exists");
      }

      bcrypt.hash(password, 10, async (err, hash) => {
        const userObj = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: hash,
        });

        try {
          let obj = await userObj.save();
          console.log(obj);
          res.status(201).send("User has been created");
        } catch (error) {
          res.status(500).send(error.message);
        }
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AuthRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        let resObj = {
          status: true,
          message: "Logged in successfully",
          token: jwt.generateToken(user),
        };
        res.status(200).send(resObj);
      } else {
        let = resObj = {
          status: falses,
          message: "Invalid username or password",
          token: "",
        };
        res.status(401).send(reqObj);
      }
    } else {
      let resObj = {
        status: false,
        message: "Please enter valid username password",
        token: "",
      };
      res.status(400).send(resObj);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AuthRouter.get("/verify-token", (req, res) => {
  let { token } = req.headers;
  try {
    jwt.verifyToken(token);
    res.status(200).send("Authenticated");
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized");
  }
});

AuthRouter.post("/update-user-detail", async (req, res) => {
  console.log(req.body);
  if (Object.keys(req.body).length > 0) {
    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      gender,
      dob,
      newPasswd,
      address,
      country,
      state,
      city,
      zipCode,
    } = req.body;

    const existingUser = await User.findOne({
      email: email,
      username: username,
    });
    console.log("existingUser-" + existingUser);

    if (!existingUser) {
      return res.status(404).send("User not found");
    } else {
      bcrypt.hash(newPasswd, 10, async (err, hash) => {
        const updateDetailOfUser = await User.updateMany(
          { email, username },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              username: username,
              email: email,
              phoneNumber: phoneNumber,
              gender: gender,
              dob: dob,
              password: hash,
              address: address,
              country: country,
              state: state,
              city: city,
              zipCode: zipCode,
            },
          }
        );
        if (updateDetailOfUser.modifiedCount === 0) {
          return res.status(200).send("User detail already updated.");
        } else {
          res.status(200).send("User details updated.");
        }
      });
    }
  } else {
    res.status(400).send("Please send valid user details.");
  }
});
module.exports = { AuthRouter };
