import jwt from "jsonwebtoken";
import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";

//register
export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(400).json("Account already exists! Please login to continue..");
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new Users({
        fullName,
        email,
        password: hashedPass,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(401).json({ error: err, message: 'Register failed!' });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedUser = await Users.findOne({ email })
    if (loggedUser) {
      bcrypt.compare(password, loggedUser.password, (err, result) => {
        if (err) {
          res.status(500).json({ error: err, message: 'Internal server error' })
        }
        if (result) {
          //token
          const token = jwt.sign({ _id: loggedUser._id }, "m17");
          res.status(200).json({
            user: loggedUser,
            token,
          });
        }
        else {
          res.status(400).json('Wrong password!')
        }
      });
    } else {
      res.status(404).json("User not found!");
    }
  } catch (err) {
    res.status(401).json({ error: err, message: "Login failed" });
  }
};

//userProfile(Edit)
export const userProfileUpdate = async (req, res) => {
  const { _id } = req.params;
  try {
    const updatedUser = await Users.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    res.status(200).json(updatedUser)

  } catch (err) {
    res.status(401).json({ error: err, message: `Profile Update Failed ` });
  }
};



//get all users
export const getAllUsersWithStat = async (req, res) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 30);
  try {
    const allUsers = await Users.find()
    const newUsersCount = (await Users.find({ registeredAt: { $gte: startDate, $lt: currentDate } })).length
    const userSegmentStat = await Users.aggregate([
      {
        $match: { "birthday": { $exists: true } } // Filter out documents without DateOfBirth
      },
      {
        $project: {
          "dateOfBirth": {
            $dateFromString: {
              dateString: "$birthday",
              format: "%Y-%m-%d" // Specify the format
            }
          }
        }
      },
      {
        $project: {
          "age": {
            $floor: {
              $divide: [
                { $subtract: [new Date(), "$dateOfBirth"] },
                31536000000 // Milliseconds in a year (365 days)
              ]
            }
          }
        }
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [13, 18, 23, 28, 33, 38], // Define your age ranges (adjust as needed)
          default: "Other", // Group any remaining ages
          output: {
            "count": { $sum: 1 }
          }
        }
      },
      {
        $project: {
          _id: 0,
          ageRange: {
            $concat: [
              { $toString: "$_id" },
              " - ",
              { $toString: { $add: ["$_id", 5] } } // Add 6 to get upper bound
            ]
          },
          count: 1
        }
      }
    ]);
    res.status(200).json({ usersAgeRange: userSegmentStat, allUsers, newUsersCount })
  }
  catch (err) {
    res.status(401).json({ error: err, message: `All users access failed ` });

  }
}


export const getUserById = async (req, res) => {
  const { _id } = req.params
  try {
    const selectedUser = await Users.findById({ _id })
    if (selectedUser) {
      res.status(200).json(selectedUser)
    }
    else {
      res.status(404).json('User not found!')
    }
  }
  catch (err) {
    res.status(401).json({ error: err, message: `User  access failed ` });

  }
}


//update user profile picture
export const updateProfilePicture = async (req, res) => {
  // console.log("ggggggggg")
  const { id } = req.params
  const profileImage = req.file.filename
  console.log(profileImage)
  try {
    const updatedUserWithProfilePicture = await Users.findByIdAndUpdate(id, { $set: { profileImage } }, { new: true })
    res.status(200).json(updatedUserWithProfilePicture)
  }
  catch (err) {
    res.status(401).json({ error: err, message: `profile picture updation failed ` });
  }
}


//delete user
export const removeUser = async (req, res) => {
  const { _id } = req.params
  try {
    const deletedUser = await Users.findByIdAndDelete({ _id })
    res.status(200).json(deletedUser)
  }
  catch (err) {
    res.status(401).json({ error: err, message: `User delete failed ` });
  }
}

//get conversion rate of users by years
export const getConversionRate = async (req, res) => {
  try {
    const usersConversionRate = await Users.aggregate([
      {
        $addFields: {
          year: { $year: "$registeredAt" }
        }
      },
      {
        $project: {
          ordersCount: 1,
          year: 1
        }
      },
      {
        $group: {
          _id: '$year',
          total_count: { $sum: 1 },
          total_orders: { $sum: "$ordersCount" }
        }
      },
      {
        $sort: {
          year: -1
        }
      },
      {
        $limit: 3
      }
    ])
    res.status(200).json(usersConversionRate)
  }
  catch (err) {
    res.status(401).json({ error: err, message: `User failed to fetch ` });
  }
}