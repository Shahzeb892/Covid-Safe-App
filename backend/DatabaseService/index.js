const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const path = require('path');

// Database class for database operations
class DatabaseService {
    constructor(systemManagement) {
        this.database = null
        this.management = systemManagement
    }
    // Load the database from the path
    init() {
        let dbpath = path.resolve(__dirname, 'database.db');
        this.database = new sqlite3.Database(dbpath, (error) => {
            if (error) {
                console.log("Error opening database")
            }
        })
        this.database.run(`PRAGMA key = 'mysecret'`, (err) => {
            if (err) {
                console.error('Failed to set encryption key:', err.message);
                return;
            }
            console.log('Encryption key applied successfully');
        });
    }
    // Execute a SQL query with parameters
    async execute(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.database.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            });
        });
    }
    // Execute a SQL query with parameters
    async match(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.database.all(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            });
        });
    }
}

module.exports = DatabaseService;