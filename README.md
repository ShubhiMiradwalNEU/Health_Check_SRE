# Endpoint Health Checker

This Node.js application monitors the availability and performance of various endpoints defined in a YAML configuration file. The tool periodically sends HTTP requests to each endpoint and tracks their availability, logging results to the console and a log file.

## Features

- **Load Configuration from YAML:** Reads endpoints from a user-provided YAML file.
- **Periodic Health Checks:** Automatically performs health checks every 15 seconds.
- **Availability Tracking:** Tracks and logs the availability percentage of each endpoint's domain.
- **Latency Monitoring:** Monitors the response time (latency) for each request.
- **Logging:** Outputs results to both the console and a file (`availability_log.txt`).

## Prerequisites

- Node.js (v12 or later)
- npm (Node Package Manager)

## Installation

1. Clone this repository:
   ```bash
   git clone git@github.com:ShubhiMiradwalNEU/Health_Check_SRE.git

2. Navigate to the project directory:
   cd Health_Check_SRE

3. Install the necessary dependencies:
   npm install

4. Usage
    Prepare the YAML Configuration File

    1. Create a YAML configuration file defining the endpoints you want to monitor. Below is an example configuration:
        endpoints:
           - name: fetch index page
             url: https://fetch.com/
             method: GET
             headers:
               user-agent: fetch-synthetic-monitor

           - name: fetch careers page
             url: https://fetch.com/careers
             method: GET
             headers:
               user-agent: fetch-synthetic-monitor

           - name: fetch some fake post endpoint
             url: https://fetch.com/some/post/endpoint
             method: POST
             headers:
               content-type: application/json
               user-agent: fetch-synthetic-monitor
             body: '{"foo":"bar"}'

           - name: fetch rewards index page
             url: https://www.fetchrewards.com/
             method: GET

        

    2. Run the Application

    Run the application by providing the path to your YAML configuration file as an argument:
    node index.js path/to/your/config.yml

    3. View the Output
   
    Console Output: The application logs each request's status and latency in real-time.
    Log File: Availability percentages are periodically logged in availability_log.txt.

    4. Stop the Application
   
    To stop the application, press CTRL+C in your terminal.

    5. Contact
   
    For any questions or suggestions, please contact [miradwal.s@northeastern.edu].



