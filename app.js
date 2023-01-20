// @ts-nocheck
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require('cors')
const cron = require('node-cron');

const DBconnection = require("./Database/DBconnection")
const { authRouter, userRouter, productRouter, commentRouter, adminRouter } = require("./modules/index.router");
const HttpError = require("./util/HttpError");
const reportOfToday = require("./modules/product/controller/createdTodayReport");


const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/profile-img", express.static(path.join(__dirname, "./upload/profileImages")))
app.use("/api/cover-img", express.static(path.join(__dirname, "./upload/coverImages")))
app.use("/api/product-img", express.static(path.join(__dirname, "./upload/productImages")))
app.use("/api/reports", express.static(path.join(__dirname, "./upload/PDF_reports")))
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/comments", commentRouter)
app.use("/api/admin", adminRouter)


app.use((request, response, next) => {
    next(new HttpError(404, "Not found result"))
});

app.use((customError, request, response, next) => {
    if (request.file?.path) {//if there is file uploaded during this request delete it becaue this request cause error
        fs.unlink(request.file.path, (error) => {
            if (error) {
                console.log("Error occurred during file delete: " + error)
            } else {
                console.log("uploaded file " + request.file.filename + " is deleted")
            }
        })
    }

    if (request.files) {//if there are files uploaded during this request delete them becaue this request cause error
        for (let index = 0; index < request.files.length; index++) {
            if (request.files[index].path) {
                fs.unlink(request.files[index].path, (error) => {
                    if (error) {
                        console.log("Error occurred during file " + request.files[index].filename + "  delete: ")
                        console.log(error)
                    } else {
                        console.log("uploaded file " + request.files[index].filename + " is deleted")
                    }
                })
            }
        }
    }

    response.status(customError.statusCode || 400)
        .json({ message: customError.message || "Invalid Operation" });
});


DBconnection.then(() => {
    console.log("Succeed to connect to Database.")
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server is Up and Runnging on Port ${process.env.PORT}..... `)
    })
    cron.schedule('00 59 23 * * *', () => {
        reportOfToday()
    });
    const io = initSocketIO(server);
    socketIOHandler(io)
}).catch(error => {
    console.log("Database Problem: Unable to connect to MongoDB database....")
    console.log("Error in details: " + error)
})