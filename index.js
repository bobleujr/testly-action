const core = require('@actions/core');
const fs = require('fs');
const axios = require('axios');

const main = async() => {
    const runId = process.env.GITHUB_RUN_ID;
    const repository = process.env.GITHUB_REPOSITORY;
    const apiKey = core.getInput('api_key', { required: true });
    const file = core.getInput('file', { required: true });
    const data = fs.readFileSync(file, 'utf8')

    const body = JSON.stringify({
        "api_key": apiKey,
        "repository": repository.replace("/", "-"),
        "run": `${runId}`,
        "junit": data
    });

    axios.post('https://us-east1-testly-github.cloudfunctions.net/push_junit', body, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}

// Call the main function to run the action
main();