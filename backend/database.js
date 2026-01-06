const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Numele fisierului bazei de date
const dbPath = path.resolve(__dirname, 'it_assets.db');

// Conectarea la baza de date
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Eroare la conectarea la baza de date:', err.message);
    } else {
        console.log('Conectat la baza de date SQLite.');
    }
});

// Initializarea tabelelor
db.serialize(() => {
    // Tabelul ANGAJATI
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        department TEXT NOT NULL
    )`);

    // Tabelul ACTIVE (Echipamente)
    db.run(`CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        brand TEXT,
        serial_number TEXT UNIQUE,
        purchase_date DATE,
        status TEXT DEFAULT 'Available',
        assigned_to INTEGER,
        FOREIGN KEY (assigned_to) REFERENCES employees (id)
    )`);
    
    // Inserare date de test (doar daca e gol)
    db.get("SELECT count(*) as count FROM employees", (err, row) => {
        if (row && row.count === 0) {
            console.log("Inserare date de test...");
            const stmt = db.prepare("INSERT INTO employees (name, email, department) VALUES (?, ?, ?)");
            stmt.run("Ion Popescu", "ion@firma.com", "IT");
            stmt.run("Maria Ionescu", "maria@firma.com", "HR");
            stmt.finalize();
        }
    });
});

module.exports = db;