const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); 
const app = express();

app.use(bodyParser.json());

// Serve the HTML UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Payout and Save to JSON Database
app.post('/transfer', (req, res) => {
    const { cardNumber, amount, name } = req.body;
    
    if (cardNumber && cardNumber.length === 16) {
        const transaction = {
            id: "TXID" + Math.floor(Math.random() * 1000000),
            user: name,
            card: "**** **** **** " + cardNumber.slice(-4),
            amount: amount + " SAR",
            date: new Date().toLocaleString()
        };

        // Saving to transactions.json
        fs.appendFileSync('transactions.json', JSON.stringify(transaction) + "\n");

        res.json({
            status: "Success",
            message: "Transfer of " + amount + " SAR was successful!",
            transaction_id: transaction.id
        });
    } else {
        res.status(400).json({ status: "Error", message: "Invalid Card Number!" });
    }
});

// Admin Route to see all saved transactions
app.get('/admin', (req, res) => {
    if (!fs.existsSync('transactions.json')) {
        return res.send("No transactions found yet.");
    }
    const data = fs.readFileSync('transactions.json', 'utf8');
    res.send("<h3>Transaction History:</h3><pre>" + data + "</pre>");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running at http://localhost:" + PORT);
});
