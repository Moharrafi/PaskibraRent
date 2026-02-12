
const https = require('https');

const initialUrl = 'https://maps.app.goo.gl/MSqJ8Jn1waV95Z6B7';

function followRedirect(url) {
    https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const loc = res.headers.location;

            const placeMatch = loc.match(/\/place\/([^/]+)\//);
            if (placeMatch) {
                console.log('ADDRESS_FOUND:', decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')));
            }

            const coordsMatch = loc.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (coordsMatch) {
                console.log('COORDS_FOUND:', coordsMatch[1], coordsMatch[2]);
            }

            followRedirect(loc);
        } else {
            console.log('Final URL reached');
        }
    }).on('error', (e) => {
        console.error(e);
    });
}

followRedirect(initialUrl);
