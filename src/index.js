import dotenv from 'dotenv'
import connectDB from '../src/db/index.js'
import { app } from './app.js'

// require('dotenv').config({
//     path: './.env'
// })

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server is running on port at ${process.env.PORT}`);

        })
    })
    .catch((error) => {
        console.log(`MondoDB connection fail !!!`, error);

    })