const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- HELPER PENTRU LOGGING ---
const logAction = (action, assetName, empName = null) => {
    db.run(`INSERT INTO history (action, asset_name, employee_name) VALUES (?, ?, ?)`, 
        [action, assetName, empName], 
        (err) => { if(err) console.error("Log Error:", err.message); }
    );
};

// --- RUTE ISTORIC ---
app.get('/api/history', (req, res) => {
    db.all("SELECT * FROM history ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- RUTE ANGAJATI ---
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', (req, res) => {
    const { name, email, department } = req.body;
    db.run(`INSERT INTO employees (name, email, department) VALUES (?,?,?)`, [name, email, department], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Angajat adaugat!" });
    });
});

app.put('/api/employees/:id', (req, res) => {
    const { name, email, department } = req.body;
    db.run(`UPDATE employees SET name = ?, email = ?, department = ? WHERE id = ?`, [name, email, department, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Angajat actualizat!" });
    });
});

app.delete('/api/employees/:id', (req, res) => {
    db.run(`DELETE FROM employees WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Angajat sters!" });
    });
});

// --- RUTE ACTIVE ---
app.get('/api/assets', (req, res) => {
    const sql = `SELECT assets.*, employees.name as holder_name, employees.department FROM assets LEFT JOIN employees ON assets.assigned_to = employees.id`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/assets', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    db.run(`INSERT INTO assets (name, type, brand, serial_number, purchase_date, status) VALUES (?,?,?,?,?,'Available')`, 
    [name, type, brand, serial_number, purchase_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // LOG:
        logAction("ADAUGARE", name, "-");
        res.json({ id: this.lastID, message: "Creat!" });
    });
});

app.put('/api/assets/:id', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    db.run(`UPDATE assets SET name = ?, type = ?, brand = ?, serial_number = ?, purchase_date = ? WHERE id = ?`, 
    [name, type, brand, serial_number, purchase_date, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Actualizat!" });
    });
});

app.delete('/api/assets/:id', (req, res) => {
    // Intai luam numele ca sa stim ce stergem (pentru log)
    db.get("SELECT name FROM assets WHERE id = ?", [req.params.id], (err, row) => {
        if(row) {
            db.run(`DELETE FROM assets WHERE id = ?`, req.params.id, function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logAction("STERGERE", row.name, "-"); // LOG
                res.json({ message: "Sters!" });
            });
        }
    });
});

// --- ALOCARE / RETURNARE (AICI E MEZUL ISTORICULUI) ---

app.post('/api/assets/assign', (req, res) => {
    const { assetId, employeeId } = req.body;
    
    // 1. Aflam numele la amandoi pentru log
    db.get("SELECT name FROM assets WHERE id = ?", [assetId], (err, asset) => {
        db.get("SELECT name FROM employees WHERE id = ?", [employeeId], (err, emp) => {
            
            // 2. Facem update-ul
            db.run(`UPDATE assets SET status = 'Assigned', assigned_to = ? WHERE id = ?`, [employeeId, assetId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                
                // 3. LOG:
                if (asset && emp) logAction("ALOCARE", asset.name, emp.name);
                
                res.json({ message: "Alocat!" });
            });
        });
    });
});

app.post('/api/assets/release', (req, res) => {
    const { assetId } = req.body;
    
    // 1. Aflam detaliile inainte sa le stergem legatura
    const sqlGet = `SELECT assets.name as asset_name, employees.name as emp_name 
                    FROM assets JOIN employees ON assets.assigned_to = employees.id 
                    WHERE assets.id = ?`;

    db.get(sqlGet, [assetId], (err, row) => {
        // 2. Facem update-ul (eliberarea)
        db.run(`UPDATE assets SET status = 'Available', assigned_to = NULL WHERE id = ?`, [assetId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // 3. LOG:
            if(row) logAction("RETURNARE", row.asset_name, row.emp_name);
            
            res.json({ message: "Returnat!" });
        });
    });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));