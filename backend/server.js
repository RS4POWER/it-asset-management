const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- HELPER LOGGING ACTUALIZAT ---
// Acum primim si assetSerial
const logAction = (action, assetName, assetSerial, empName = null) => {
    db.run(`INSERT INTO history (action, asset_name, asset_serial, employee_name) VALUES (?, ?, ?, ?)`, 
        [action, assetName, assetSerial, empName], 
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

// --- RUTE ANGAJATI (Ramase la fel) ---
app.get('/api/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => { if (err) return res.status(500).json(err); res.json(rows); });
});
app.post('/api/employees', (req, res) => {
    const { name, email, department } = req.body;
    db.run(`INSERT INTO employees (name, email, department) VALUES (?,?,?)`, [name, email, department], function(err) {
        if (err) return res.status(500).json(err); res.json({ id: this.lastID, message: "OK" });
    });
});
app.put('/api/employees/:id', (req, res) => {
    const { name, email, department } = req.body;
    db.run(`UPDATE employees SET name=?, email=?, department=? WHERE id=?`, [name, email, department, req.params.id], (err) => {
        if (err) return res.status(500).json(err); res.json({ message: "Updated" });
    });
});
app.delete('/api/employees/:id', (req, res) => {
    db.run(`DELETE FROM employees WHERE id=?`, req.params.id, (err) => {
        if (err) return res.status(500).json(err); res.json({ message: "Deleted" });
    });
});

// --- RUTE ACTIVE (Aici am modificat logarea) ---
app.get('/api/assets', (req, res) => {
    const sql = `SELECT assets.*, employees.name as holder_name, employees.department FROM assets LEFT JOIN employees ON assets.assigned_to = employees.id`;
    db.all(sql, [], (err, rows) => { if (err) return res.status(500).json(err); res.json(rows); });
});

app.post('/api/assets', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    db.run(`INSERT INTO assets (name, type, brand, serial_number, purchase_date, status) VALUES (?,?,?,?,?,'Available')`, 
    [name, type, brand, serial_number, purchase_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // LOG: Trimitem si serialul
        logAction("ADAUGARE", name, serial_number, "-");
        res.json({ id: this.lastID, message: "Creat!" });
    });
});

app.put('/api/assets/:id', (req, res) => {
    const { name, type, brand, serial_number, purchase_date } = req.body;
    db.run(`UPDATE assets SET name=?, type=?, brand=?, serial_number=?, purchase_date=? WHERE id=?`, 
    [name, type, brand, serial_number, purchase_date, req.params.id], (err) => {
        if (err) return res.status(500).json(err); res.json({ message: "Actualizat!" });
    });
});

app.delete('/api/assets/:id', (req, res) => {
    // Selectam intai serialul ca sa il punem in log
    db.get("SELECT name, serial_number FROM assets WHERE id = ?", [req.params.id], (err, row) => {
        if(row) {
            db.run(`DELETE FROM assets WHERE id = ?`, req.params.id, function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logAction("STERGERE", row.name, row.serial_number, "-"); // LOG
                res.json({ message: "Sters!" });
            });
        }
    });
});

// --- ALOCARE / RETURNARE ---

app.post('/api/assets/assign', (req, res) => {
    const { assetId, employeeId } = req.body;
    
    // Luam numele si serialul
    db.get("SELECT name, serial_number FROM assets WHERE id = ?", [assetId], (err, asset) => {
        db.get("SELECT name FROM employees WHERE id = ?", [employeeId], (err, emp) => {
            db.run(`UPDATE assets SET status = 'Assigned', assigned_to = ? WHERE id = ?`, [employeeId, assetId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                
                // LOG
                if (asset && emp) logAction("ALOCARE", asset.name, asset.serial_number, emp.name);
                res.json({ message: "Alocat!" });
            });
        });
    });
});

app.post('/api/assets/release', (req, res) => {
    const { assetId } = req.body;
    
    const sqlGet = `SELECT assets.name as asset_name, assets.serial_number, employees.name as emp_name 
                    FROM assets JOIN employees ON assets.assigned_to = employees.id 
                    WHERE assets.id = ?`;

    db.get(sqlGet, [assetId], (err, row) => {
        db.run(`UPDATE assets SET status = 'Available', assigned_to = NULL WHERE id = ?`, [assetId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // LOG
            if(row) logAction("RETURNARE", row.asset_name, row.serial_number, row.emp_name);
            res.json({ message: "Returnat!" });
        });
    });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));