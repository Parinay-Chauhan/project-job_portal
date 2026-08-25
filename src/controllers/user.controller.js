import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"


const registerUser = asyncHandler(async (req, res) => {

    // +++++++++++++ Data Validation +++++++++++++

    const { username, email, password, fullName } = req.body;

    // Check if all required fields are provided and not empty

    if ([username, email, password].some((field) => !field?.trim()
    )) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if the user already exists in the database

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],

    })
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create a new user in the database ( MongoDB will handle password hashing if you have set up pre-save middleware in the User model)

    const user = await User.create({
        fullName,
        email,
        password,
        username,
    })

    // Fetch the newly created user from the database and exclude the password field from the response     

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")

    }

    // Send a success response with the created user data (excluding the password) and a success message

    res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})


export { registerUser }