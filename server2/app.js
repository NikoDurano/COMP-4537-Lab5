
const http = require('http');
const mysql = require('mysql');
const url = require('url');
const messages = require ('./locals/en.js');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '',   
    database: 'lab5' 
});


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS patient (
            patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            dateOfBirth DATE
        );
    `;
    
    db.query(createTableSQL, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table ensured: patient');
        }
    });
});

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (pathname === '/insert' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);
            const sql = 'INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)';
            db.query(sql, [data.name, data.birthdate], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: messages.databaseErrorText , details: err }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: messages.rowInsertedText, id: result.insertId }));
            });
        });

    } else if (pathname === '/query') {
        if (req.method === 'GET') {
            const sqlQuery = parsedUrl.query.query;

            if (!sqlQuery.startsWith('SELECT')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: messages.onlySelectQueriesAllowedText }));
                return;
            }

            db.query(sqlQuery, (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: messages.databaseErrorText, details: err }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            });

        } else if (req.method === 'POST') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const { query } = JSON.parse(body);

                if (!query.startsWith('INSERT')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: messages.onlyInsertQueriesAllowedText }));
                    return;
                }

                db.query(query, (err, result) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: messages.databaseErrorText, details: err }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: messages.queryExecutedText, affectedRows: result.affectedRows }));
                });
            });
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: messages.notFoundText }));
    }
});

// Start the server
server.listen(8080, () => {
    console.log('Server running on port:8080');
});