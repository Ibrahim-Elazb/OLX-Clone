const fs = require('fs');
const path = require("path");
const PDFDocument = require('pdfkit');

function createPDFReport(prductsList, path, callBackHandler) {
    try {
        let doc = new PDFDocument({ margin: 50 });

        generateHeader(doc);
        generateMainInformation(doc);
        generateNewProductsTable(doc, prductsList);
        generateFooter(doc);
        const writeStream = fs.createWriteStream(path)
        doc.end();
        doc.pipe(writeStream);
        writeStream.on("finish", callBackHandler)
    } catch (error) {
        console.log("Error Occured during creating daily report: ")
        console.log(error)
    }
}

function generateHeader(doc) {
    const logoPath = path.join(__dirname, "../assets/logo.jpg")
    doc.image(logoPath, 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Olex-Clone.', 110, 57)
        .fontSize(10)
        .text('Online Service', 200, 65, { align: 'right' })
        .text('Find what you want in affordable price', 200, 80, { align: 'right' })
        .moveDown();
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}


function generateMainInformation(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Report", 50, 160, { align: 'center' });

    generateHr(doc, 185);

    const mainInformationTop = 200;

    doc
        .fontSize(10)
        .text("This is the Daily Report of New Products", 50, mainInformationTop)
        .font("Helvetica-Bold")
        .text("Date:", 50, mainInformationTop + 15)
        .text(formatDate(new Date()), 150, mainInformationTop + 15)
        .moveDown();

    generateHr(doc, 252);
}

function generateNewProductsTable(doc, prductsList) {
    let i,
        productsListTableTop = 330;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        productsListTableTop,
        "Title",
        "Price",
        "Created By",
        "Description"
    );
    generateHr(doc, productsListTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < prductsList.length; i++) {
        const item = prductsList[i];
        const position = productsListTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.title,
            item.price,
            item.createdBy.firstName + " " + item.createdBy.lastName,
            item.description
        );
    }
}

function generateTableRow(doc, yPosition, title, price, createdBy, description) {
    doc.fontSize(8)
        .text(title, 50, yPosition, { width: 130, height: 30, ellipsis: true })
        .text(price, 200, yPosition, { width: 30 })
        .text(createdBy, 250, yPosition, { width: 100 })
        .text(description, 370, yPosition, { height: 30, ellipsis: true });
}

function generateFooter(doc) {
    doc.fontSize(
        10,
    ).text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        700,
        { align: 'center', width: 500 },
    );
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}


module.exports = createPDFReport;

