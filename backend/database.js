const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'it_assets.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Eroare DB:', err.message);
    else console.log('Conectat la baza de date SQLite.');
});

db.serialize(() => {
    // Tabel ANGAJATI
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        department TEXT NOT NULL
    )`);

    // Tabel ACTIVE
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

    // --- ISTORIC (AUDIT)  ---
    db.run(`CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        asset_name TEXT NOT NULL,
        asset_serial TEXT,         -- NOU: Salvam si Serial Number
        employee_name TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;