const axios = require('axios');
const path = require('path');

const zoneId = process.env.CLOUDFLARE_HUB_ZONE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

async function createTransformRule() {
  try {
    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_late_transform/entrypoint`;
    
    // Cloudflare rulesets require getting the existing ruleset first, but if it doesn't exist, we can create it.
    // Actually, it's safer to just create a single ruleset for the zone if we know what we are doing.
    // Let's use the rulesets API.
    
    console.log("Fetching existing ruleset for http_request_late_transform...");
    let existingRuleset;
    try {
      const res = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_late_transform/entrypoint`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      existingRuleset = res.data.result;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        console.log("Ruleset doesn't exist yet, we will create it.");
      } else {
        throw e;
      }
    }

    const newRule = {
      description: "Enmascarar dominios para Firebase (Copaguia Zero-Touch)",
      expression: 'not (http.host eq "directoriopaisa.com")',
      action: "rewrite",
      action_parameters: {
        headers: {
          "Host": {
            operation: "set",
            value: "directoriopaisa.com"
          }
        }
      }
    };

    let payload;
    if (existingRuleset) {
      // Append rule
      const rules = existingRuleset.rules || [];
      // Remove old rule if exists to avoid duplicates
      const filteredRules = rules.filter(r => r.description !== newRule.description);
      filteredRules.push(newRule);
      
      payload = { rules: filteredRules };
      
      console.log("Updating existing ruleset...");
      const updateRes = await axios.put(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${existingRuleset.id}`, payload, {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' }
      });
      console.log("Ruleset updated successfully:", updateRes.data.success);
    } else {
      payload = {
        name: "default",
        description: "Transform Rules for Firebase",
        phase: "http_request_late_transform",
        rules: [newRule]
      };
      
      console.log("Creating new ruleset...");
      const createRes = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`, payload, {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' }
      });
      console.log("Ruleset created successfully:", createRes.data.success);
    }

  } catch (error) {
    console.error("Error creating Transform Rule:");
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

createTransformRule();
