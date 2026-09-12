import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // HTMl form se data aayega
app.use(express.static("public")); // file, folder, pdf, images ko server per store kerna
app.use(cookieParser());

// --------- routes -----------------

//  ------------------- import routes ----------------------

import userRouter from "./routes/user.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import jobRouter from "./routes/job.routes.js";

//  --------------- routes declaration --------------------

app.use("/api/v1/users", userRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/recruiters", recruiterRouter);
app.use("/api/v1/jobs", jobRouter);

export { app };
