
const https = require('https');

const url = 'https://maps.app.goo.gl/9MfYMGdwxtCCgoUT6';

https.get(url, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers.location);
}).on('error', (e) => {
    console.error(e);
});
