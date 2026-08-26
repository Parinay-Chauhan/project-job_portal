import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data || email + password
    // username or email  
    // find the user || User.findOne()
    // password check  || password correct?
    // remove password and refreshToken
    // access and refresh token
    // send cookie

    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        throw new ApiError(400, "Username/email and password are required");
    }

    const query = username ? { username } : { email };

    const user = await User.findOne(query);

    if (!user) {
        throw new ApiError(401, "Invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },

                "User loggedIn successfully"
            )
        )

})

export { registerUser, loginUser }