const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const path = require('path');

// This js file is to reset the database


const dbPath = path.resolve(__dirname, 'database.db');
// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the database.');
    }
});
// Create Tables
db.serialize(() => {
    db.run("PRAGMA cipher_compatibility = 4");
    db.run("PRAGMA key = 'mysecret'");
    console.log("create users")
    db.run(
        `CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    passwordhash TEXT NOT NULL,
    googleauth TEXT NOT NULL
    );`
    )
    console.log("create users info")
    db.run(`CREATE TABLE user_info (
        uid TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mobile TEXT,
        email TEXT,
        FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
    );`)
    console.log("create report")
    db.run(`CREATE TABLE report(
        mid INTEGER PRIMARY KEY,
        time TEXT NOT NULL);`)
    console.log("create business")
    db.run(`CREATE TABLE business (
        bid INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        latitude DECIMAL(9, 6) NOT NULL, 
        longitude DECIMAL(9, 6) NOT NULL 
    );`)
    console.log("create service")
    db.run(`CREATE TABLE service (
        sid INTEGER PRIMARY KEY AUTOINCREMENT,
        category INTEGER NOT NULL CHECK (category BETWEEN 0 AND 4),
        bid INTEGER,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        FOREIGN KEY (bid) REFERENCES business(bid) ON DELETE CASCADE
    );`)
    console.log("create orders")
    db.run(`CREATE TABLE orders (
        oid INTEGER PRIMARY KEY AUTOINCREMENT,
        state INTEGER NOT NULL CHECK (state BETWEEN 0 AND 4),
        uid TEXT,
        bid INTEGER,
        sid INTEGER,
        start_time TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
        FOREIGN KEY (bid) REFERENCES business(bid) ON DELETE CASCADE,
        FOREIGN KEY (sid) REFERENCES service(sid) ON DELETE CASCADE
    );`)
    console.log("add default business info")
    db.run(`INSERT INTO business (name, latitude, longitude) VALUES ('The University of Adelaide', -34.920499, 138.606209),
        ('Covid Student Support', -34.930929, 138.613279)`)
    console.log("add default service info")
    db.run(`INSERT INTO service (category, bid, price, description) VALUES
(0, 1, 150.00, 'General house inspection for safety assessment'),
(1, 1, 200.00, 'Electrical system check and urgent repairs'),
(2, 1, 250.00, 'Plumbing inspection and leak resolution'),
(3, 1, 300.00, 'Special service'),
(4, 1, 350.00, 'Package General house inspection + Electrical system check and urgent repairs + Plumbing inspection and leak resolution'),
(0, 2, 99.00, 'Student apartment inspection'),
(3, 2, 350.00, 'Special service'),
(4, 2, 50.00, 'Adelaide uni student only house inspection'),
(4, 2, 60.00, 'Adelaide uni student only house packing, including food');`)
    console.log("finish")
}
)
db.close()