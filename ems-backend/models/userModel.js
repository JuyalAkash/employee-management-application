import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      min: 10,
      max: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      min: 10,
      max: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      min: 10,
      max: 50,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 6 characters long"],
      // select: false, // Do not return password in queries by default
    },
    roles: {
      type: String,
      enum: ["admin", "manager", "employee"], // Define roles
      default: "employee", // Default role is user
    },
    tokens: [{ refreshToken: { type: String, required: true } }], // Store refresh tokens
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile-picture.png", // Default profile picture URL
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined; // Remove confirmPassword from the document
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Method to get user details without password
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password; // Remove password from the output
  delete userObject.confirmPassword; // Remove confirmPassword from the output
  return userObject;
};

// Define schema level methods to generate access token for the user
userSchema.methods.generateAccessToken = async function () {
  try {
    const user = this;
    const accessToken = jwt.sign(
      {
        userInfo: {
          _id: user._id,
          fullName: `${user.firstName} ${user.lastName}`,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    return accessToken;
  } catch (error) {
    console.error(error.message);
    return;
  }
};

// Define schema level methods to generate refresh token for the user
userSchema.methods.generateRefreshToken = async function () {
  try {
    const user = this;
    const refreshToken = jwt.sign(
      {
        userInfo: {
          _id: user._id,
          fullName: `${user.firstName} ${user.lastName}`,
          roles: user.roles,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
    // Store the refresh token in the user's tokens array
    user.tokens.push({ refreshToken: refreshToken });
    user.save(); // Save the user document with the new refresh token
    return refreshToken;
  } catch (error) {
    console.error(error.message);
    return;
  }
};

// Create the user model
const User = mongoose.model("User", userSchema);

// Export the user model
export default User;
