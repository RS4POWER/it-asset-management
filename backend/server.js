const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Ne lasa sa primim date in format JSON de la Frontend

// --- RUTE PENTRU ANGAJATI (EMPLOYEES) ---

// 1. Obtine toti angajatii
app.get('/api/employees', (req, res) => {
    const sql = "SELECT * FROM employees";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- RUTE PENTRU ACTIVE (ASSETS) ---

// 2. Obtine toate activele (cu detalii despre cine le detine)
app.get('/api/assets', (req, res) => {
    const sql = `
        SELECT assets.*, employees.name as holder_name, employees.department 
        FROM assets 
        LEFT JOIN employees ON assets.assigned_to = employees.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. Adauga un activ nou (CREATE)
app.post('/api/assets', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    const sql = `INSERT INTO assets (name, type, brand, serial_number, purchase_date, status) VALUES (?,?,?,?,?, 'Available')`;
    
    db.run(sql, [name, type, brand, serial_number, purchase_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Activ adaugat cu succes!" });
    });
});

// 4. Actualizeaza un activ (UPDATE)
app.put('/api/assets/:id', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    const sql = `UPDATE assets SET name = ?, type = ?, brand = ?, serial_number = ?, purchase_date = ? WHERE id = ?`;
    
    db.run(sql, [name, type, brand, serial_number, purchase_date, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Activ actualizat!" });
    });
});

// 5. Sterge un activ (DELETE)
app.delete('/api/assets/:id', (req, res) => {
    const sql = `DELETE FROM assets WHERE id = ?`;
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Activ sters!" });
    });
});

// --- RUTE SPECIALE: ALOCARE / ELIBERARE (ASSIGNMENT) ---

// 6. Aloca un activ unui angajat
app.post('/api/assets/assign', (req, res) => {
    const { assetId, employeeId } = req.body;
    
    // Logic: Schimbam statusul in 'Assigned' si setam ID-ul angajatului
    const sql = `UPDATE assets SET status = 'Assigned', assigned_to = ? WHERE id = ?`;
    
    db.run(sql, [employeeId, assetId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Activ alocat cu succes!" });
    });
});

// 7. Elibereaza un activ (Returnare)
app.post('/api/assets/release', (req, res) => {
    const { assetId } = req.body;
    
    // Logic: Schimbam statusul inapoi in 'Available' si stergem proprietarul (NULL)
    const sql = `UPDATE assets SET status = 'Available', assigned_to = NULL WHERE id = ?`;
    
    db.run(sql, [assetId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Activ returnat in stoc!" });
    });
});

// Pornire server
app.listen(PORT, () => {
    console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});