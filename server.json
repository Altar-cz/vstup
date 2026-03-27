const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Vytvoření složky pro nahrávání, pokud neexistuje
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // Slouží soubory ze složky public

// Endpoint pro příjem fotky
app.post('/upload', (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).send('No image data provided');

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `verify_${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error("Ukládání selhalo:", err);
            return res.status(500).send('Error saving image');
        }
        console.log("Snímek úspěšně uložen:", fileName);
        res.status(200).send('Success');
    });
});

app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
});
