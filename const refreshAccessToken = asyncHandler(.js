const refreshAccessToken = asyncHandler(async (req, res) => {

    const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    
    const incomingRefreshToken = typeof rawRefreshToken === "string"
        ? rawRefreshToken.replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim()
        : ""

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    console.log("Incoming Refresh Token:", incomingRefreshToken)

    if (incomingRefreshToken.split(".").length !== 3) {
        throw new ApiError(401, "Malformed refresh token")
    }

    try {

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
