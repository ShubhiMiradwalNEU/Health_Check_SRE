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
let domainStats = {}; 

async function check_end_points(parsed_data) {
    console.log(`Running check #${testCounter}`);

    const requests = parsed_data.endpoints.map(async element => {
        const domain = new URL(element.url).hostname;

        if (!domainStats[domain]) {
            domainStats[domain] = { pass: 0, fail: 0 }; 
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
                console.log(`UP — The HTTP response code is ${response.status} and the response latency is ${end - start} ms.`);
                domainStats[domain].pass++;
            } else {
                console.log(`DOWN — The endpoint is not UP.`);
                domainStats[domain].fail++;
            }
        } catch (error) {
            console.log(`DOWN — The endpoint is not UP. Error: ${error.message}`);
            domainStats[domain].fail++;
        }
    });

    await Promise.all(requests);
    testCounter++;

    // Log availability for each domain
    for (const [domain, stats] of Object.entries(domainStats)) {
        const total_checks = stats.pass + stats.fail;
        const availability = total_checks > 0 ? (stats.pass / total_checks) * 100 : 0;
        console.log(`${domain} has ${availability.toFixed(0)}% availability.`);
    }
}

// Initial execution
check_end_points(parsed_data);

// Schedule subsequent executions every 15 seconds
setInterval(() => {
    check_end_points(parsed_data);
}, 15000);
