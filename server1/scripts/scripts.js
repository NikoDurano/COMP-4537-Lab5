import {messages} from '../locals/en.js';

document.getElementById('insertRowTitle').innerText = messages.insertRowsText;
document.getElementById('insertRowButton').innerText = messages.insertRowsText;
document.getElementById('executeQueryTitle').innerText = messages.executeSQLQueryText;
document.getElementById('executeQueryButton').innerText = messages.submitQueryText;

const insertRows = () => {
    const rows = [
        ['Sara Brown', '1901-01-01'],
        ['John Smith', '1941-01-01'],
        ['Jack Ma', '1961-01-30'],
        ['Elon Musk', '1999-01-01']
    ];

    rows.forEach(row => {
        // TODO Change as needed
        fetch('http://localhost:8080/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: row[0],
                birthdate: row[1]
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('insertResponse').innerText += JSON.stringify(data) + '\n';
        })
        .catch(error => console.error('Error:', error));
    });
}
window.insertRows = insertRows;

const executeQuery = () => {
    const query = document.getElementById('sqlQuery').value.trim();

    // TODO Change as needed
    let url = 'http://localhost:8080/query';
    let method = 'POST';
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
    };

    if (query.toUpperCase().startsWith('SELECT')) {
        // Use GET for SELECT queries
        method = 'GET';
        url += `?query=${encodeURIComponent(query)}`;
        
        // GET requests CANNOT have a body, so remove it
        options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            document.getElementById('queryResponse').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error:', error));

}
window.executeQuery = executeQuery;