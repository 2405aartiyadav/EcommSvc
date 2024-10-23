const bcrypt = require("bcrypt");
const { Router } = require("express");
const AuthRouter = Router({ strict: true });
const User = require("../model/UserModel.js");
const UserAuth = require("../model/UserAuth.js");
const jwt = require("../utility/JwtToken.js");
const uploadeProfileImage = require("../cloudinary/cloudinary.js");

AuthRouter.get("/Authtest", (req, res) => {
  res.send("test authrouter");
});

//signup
AuthRouter.post("/signup", async (req, res) => {
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
    } else {
      try {
        const userObj = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
        });
        let obj = await userObj.save();
        console.log(obj);

        if (obj) {
          bcrypt.hash(password, 10, async (err, hash) => {
            const authObj = new UserAuth({
              email: email,
              username: username,
              password: hash,
            });
            try {
              let obj = await authObj.save();
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
    }
  } else {
    res.status(400).send("Please send valid user details");
  }
});

//login
AuthRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserAuth.findOne({ username });

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
          status: false,
          message: "Invalid username or password",
          token: "",
        };
        res.status(401).send(resObj);
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

//verify token
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



//update user detail
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

//user detail
AuthRouter.post("/user-detail", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne(
    { username: username },
    { _id: 0, password: 0, __v: 0 }
  );
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(400).send({ message: "User not found" });
  }
});

AuthRouter.post("/check-email-to-reset-password", async (req, res) => {
  const { email } = req.body;
  if (Object.keys(req.body).toString().includes("email")) {
    const checkUser = await UserAuth.findOne({
      email: email,
    });
    console.log(`${checkUser}checkUser`);
    if (checkUser) {
      if (checkUser.isSecurityQuestionSet) {
        res.status(200).send({
          securityQuestion1: checkUser.securityQuestion1,
          securityQuestion2: checkUser.securityQuestion2,
        });
      } else {
        res
          .status(200)
          .send(
            "Security questions are not set,Please contact to your administrator"
          );
      }
    } else {
      res.status(400).send("Email does not exist");
    }
  } else {
    res.status(400).send("Please send valid user details.");
  }
});

AuthRouter.post("/verify-security-answer", async (req, res) => {
  if (
    Object.keys(req.body).toString().includes("email") &&
    Object.keys(req.body).toString().includes("securityQuestion1") &&
    Object.keys(req.body).toString().includes("securityQuestion2") &&
    Object.keys(req.body).toString().includes("securityAns1") &&
    Object.keys(req.body).toString().includes("securityAns2")
  ) {
    const {
      email,
      securityQuestion1,
      securityQuestion2,
      securityAns1,
      securityAns2,
    } = req.body;
    const checkUser = await UserAuth.findOne({
      email: email,
      securityQuestion1: securityQuestion1,
      securityQuestion2: securityQuestion2,
      securityAns1: securityAns1,
      securityAns2: securityAns2,
    });
    console.log(checkUser);
    if (checkUser) {
      res.status(200).send("Please reset your password");
    } else {
      res.status(400).send("User verification failed");
    }
  } else {
    res.status(400).send("Plase enter valid data");
  }
});

AuthRouter.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    // const updatePaswd = new UserAuth({
    //   email: email,
    //   password: hash,
    // });
    try {
      const updatePassword = await UserAuth.updateOne(
        { email: email },
        { $set: { password: hash } }
      );

      console.log(updatePassword);
      res.status(200).send("Password updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
      mnv;
    }
  });
});
module.exports = { AuthRouter };

//upload Profile
AuthRouter.post("/upload-profile",async(req,res)=>{
  try {
    if(
      Object.keys(req.body).length!=0 && Object.keys(req.body).toString().includes('email')&& Object.keys(req.body).toString().includes('profileImg')&& Object.keys(req.body).toString().includes('firstName')
    ){
      const{email,profileImg,firstName}=req.body;
      let obj=await User.find({email:email});
      if(obj && obj.length>0){
        let upload=await uploadeProfileImage(profileImg,
          "DevSpace/EcommReact/UserDetail",
          firstName
        )
        try {
          let profileUpload = new User({
            name: firstName,
            imgUrl: obj.url,
          });
          profileUpload.save();
          res.send("Profile photo uploaded");
        } catch (error) {
          console.log(error);
          res.status(500).send("something went wrong");
        }
      }
      else{
        res.status(500).send("User does not exist")
      }
    }
    
  } catch (error) {
    res.status(500).send("something went wrong")
    
  }

})

//update checkout detail

AuthRouter.post("/update-check-out-detail", async (req, res) => {
  if (Object.keys(req.body.length > 0)) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      address,
      country,
      state,
      city,
      zipCode,
    } = req.body;

    const checkUser = await User.findOne({ email: email });
    if (!email) {
      return res.status(404).send("Something went wrong");
    } else {
      const updateDetailOfUser = await User.updateMany(
        { email },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            address: address,
            country: country,
            state: state,
            city: city,
            zipCode: zipCode,
          }
        }
      );

      if (updateDetailOfUser.modifiedCount === 0) {
        return res.status(200).send("User detail already updated.");
      } else {
        res.status(200).send("User details updated.");
      }
    }
  }
});