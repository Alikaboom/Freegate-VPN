const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployUserWorker(orderId, uuid) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const workerName = "freegate-node-" + orderId.toLowerCase();

    try {
        console.log("[Cloudflare] Starting deployment for " + workerName + "...");

        // 1. Get the account's registered workers.dev subdomain
        const subRes = await fetch("https://api.cloudflare.com/client/v4/accounts/" + accountId + "/workers/subdomain", {
            headers: { 'Authorization': "Bearer " + apiToken }
        });
        const subData = await subRes.json();
        const userSubdomain = subData.result.subdomain;

        // 2. Prepare the worker script and metadata
        let rawWorkerCode = fs.readFileSync(path.join(__dirname, '../assets/bpb-worker.js'), 'utf8');
        const embedSettings = {
            accID: accountId,
            accEmail: "admin@freegatevpn.com",
            apiToken: apiToken,
            vlUUID: uuid,
            trPass: uuid,
            securePath: uuid,
            proxyIpMode: "RoundRobin",
            proxyIPs: ["104.21.94.80"],
            prefixes: [],
            panelPass: uuid
        };
        const workerCode = `const EMBEDED_SETTINGS = ${JSON.stringify(embedSettings)};\n` + rawWorkerCode;
        
        const boundary = '----CloudflareBoundary' + Date.now();
        const metadata = {
            main_module: 'worker.js',
            compatibility_date: '2023-12-01',
            compatibility_flags: ['nodejs_compat']
        };

        let body = "--" + boundary + "\r\n";
        body += "Content-Disposition: form-data; name=\"metadata\"\r\n";
        body += "Content-Type: application/json\r\n\r\n";
        body += JSON.stringify(metadata) + "\r\n";

        body += "--" + boundary + "\r\n";
        body += "Content-Disposition: form-data; name=\"worker.js\"; filename=\"worker.js\"\r\n";
        body += "Content-Type: application/javascript+module\r\n\r\n";
        body += workerCode + "\r\n";
        body += "--" + boundary + "--\r\n";

        // 3. Upload the worker
        const uploadRes = await fetch("https://api.cloudflare.com/client/v4/accounts/" + accountId + "/workers/scripts/" + workerName, {
            method: 'PUT',
            headers: {
                'Authorization': "Bearer " + apiToken,
                'Content-Type': "multipart/form-data; boundary=" + boundary
            },
            body: body
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            throw new Error("Worker upload failed: " + err);
        }

        // 4. Enable the subdomain route for this specific worker
        const enableRes = await fetch("https://api.cloudflare.com/client/v4/accounts/" + accountId + "/workers/scripts/" + workerName + "/subdomain", {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enabled: true })
        });

        if (!enableRes.ok) {
            const err = await enableRes.text();
            throw new Error("Failed to enable subdomain: " + err);
        }

        const finalUrl = workerName + "." + userSubdomain + ".workers.dev";
        console.log("[Cloudflare] Successfully deployed to " + finalUrl);
        
        return finalUrl;

    } catch (error) {
        console.error("[Cloudflare] Deployment Error: " + error.message);
        throw error;
    }
}

module.exports = { deployUserWorker };
