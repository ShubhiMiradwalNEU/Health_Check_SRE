const yaml = require('js-yaml');
const fs = require('fs');
const axios = require('axios');

const file_path = process.argv[2];

function load_config(file_path) {
    try {
        const fileContents = fs.readFileSync(file_path, 'utf8');
        const parsed_data = yaml.load(fileContents);
        return parsed_data;
    } catch (e) {
        console.log(e);
    }
}

const parsed_data = load_config(file_path);
console.log("Parsed Data:", parsed_data);

let testCounter = 0; 
let endpointStats = {}; 

async function check_end_points(parsed_data) {
    console.log(`Running check #${testCounter}`);
    // let total_pass = 0;
    // let total_fail = 0;
    
    const requests = parsed_data.endpoints.map(async element => {
        if (!endpointStats[element.url]) {
            endpointStats[element.url] = { pass: 0, fail: 0 }; // Initialize stats for each endpoint
        }

        const start = Date.now();
        try {
            const config = {
                method: element.method,
                url: element.url,
                headers: element.headers,
                ...(element.body && { data: JSON.parse(element.body) }) 
            };
            const response = await axios(config);
            const end = Date.now();

            if (end - start < 500 && response.status >= 200 && response.status < 300) {
                console.log(`UP — The HTTP response code is ${response.status} and the response latency is ${end- start} ms.`);
                endpointStats[element.url].pass++;
            } else {
                console.log(`DOWN — The endpoint is not UP.`);
                endpointStats[element.url].fail++;
            }
        } catch (error) {
            console.log(`DOWN — The endpoint is not UP. Error: ${error.message}`);
            endpointStats[element.url].fail++;
        }
    });

    await Promise.all(requests);
    testCounter++;
        // Log availability for each endpoint
    for (const [url, stats] of Object.entries(endpointStats)) {
        const total_checks = stats.pass + stats.fail;
        const availability = total_checks > 0 ? (stats.pass / total_checks) * 100 : 0;
        console.log(`${url} has ${availability.toFixed(2)}% availability.`);
        }
}

// Initial execution
check_end_points(parsed_data);

setInterval(() => {
    check_end_points(parsed_data);
}, 15000); 
