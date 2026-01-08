// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require ('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// initilize Express app
const app = express ();
// helps app to read JSON
app.use(express.json());

// starts live server
app.listen(port, () => {
    console.log('Server running on port', port);
});


// Example Route: Get all popmarts
app.get('/allpopmarts', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.popmarts');
        res.json(rows);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ message: 'Server error for allpopmarts'})
    }
});

// Example Route: Create a new popmart
app.post('/addpopmart', async (req, res) => {
    const { popmart_name, artist_name, popmart_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO popmarts (popmart_name, artist_name, popmart_pic) VALUES (?, ?, ?)', [popmart_name, artist_name, popmart_pic]);
        res.status(201).json({ message: 'Popmart '+ popmart_name+' added successfully'});
    } catch (err) {
        console.error (err);
        res.status (500).json({ message: 'Server error - could not add popmart '+ popmart_name});
    }
});

// Example Route: Edit a new popmart
app.put('/popmarts/:id', async (req, res) => {
    const { id } = req.params;
    const { popmart_name, artist_name, popmart_pic } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            `UPDATE popmarts 
             SET popmart_name = ?, artist_name = ?, popmart_pic = ?
             WHERE id = ?`,
            [popmart_name, artist_name, popmart_pic, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Popmart not found' });
        }

        res.json({ message: 'Popmart updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update popmart' });
    }
});

// Example Route: Delete an existing popmart
app.delete('/popmarts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM popmarts WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Popmart not found' });
        }

        res.json({ message: 'Popmart deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete popmart' });
    }
});    