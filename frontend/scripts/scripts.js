
const insertRows = () => {
    const rows = [
        ['Sara Brown', '1901-01-01'],
        ['John Smith', '1941-01-01'],
        ['Jack Ma', '1961-01-30'],
        ['Elon Musk', '1999-01-01']
    ];

    rows.forEach(row => {

        // TODO Change as needed
        fetch('/insert', {
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
    let url = '/query';
    let method = 'POST'

    if(query.startsWith('SELECT')) {
        method = 'GET';
        url +=`?query=${query}`;
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('queryResponse').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('Error:', error));

}
window.executeQuery = executeQuery;