// @ts-nocheck
const path = require("path");
const os = require("os");
const fs = require("fs");

const productModel = require("../../../Database/model/Product");
const createPDFReport = require("../../../Services/createPDF_file");
const sendEmail = require("../../../Services/SendEmail");
const HttpError = require("../../../util/HttpError");


const reportOfToday = async () => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        let foundProducts = await productModel.find({ $and: [{ createdAt: { $gte: startOfDay } }, { createdAt: { $lte: endOfDay } }] })
            .select("_id title description price createdBy")
            .populate([
                { path: "createdBy", select: "_id firstName lastName profilePicture" }
            ]);

        const today = new Date();
        const fileName = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_report.pdf`;
        const pathToAttachment = path.join(__dirname, `../../../upload/PDF_reports/${fileName}`);
        createPDFReport(foundProducts, pathToAttachment, () => {
            const message = `<div>
            <p><strong>This is Daily Report of products that is added today.</strong></p>
            </div>`
            attachment = fs.readFileSync(pathToAttachment).toString("base64");
            sendEmail("ibrahimElazb2010@gmail.com",
                `Report Of ${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`,
                message,
                [{
                    content: attachment,
                    filename: `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}-report.pdf`,
                    type: "application/pdf",
                    disposition: "attachment"
                }])
            console.log("daily report is created and sent to admin email...")
        });

    } catch (error) {
        console.log("Error Occured during creating daily report: ")
        console.log(error)
    }
}

module.exports = reportOfToday;