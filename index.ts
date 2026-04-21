import {rawExecuteQuery} from "@datocms/cda-client";
import {randomUUID} from "node:crypto";

const query = `
    query MyQuery {
      exampleModel {
        title
      }
    }
`;

(async () => {
    const uuid = randomUUID();
    const randomInt = Math.floor(Math.random() * 100);
    const referer = `https://www.example${randomInt}.com/${uuid}/test?uuid=${uuid}&staticParam=test`; // Query strings are seemingly stripped by us?
    await rawExecuteQuery(query, {
        token: process.env.DATOCMS_API_TOKEN, // From https://cda-query-referer.admin.datocms.com/project_settings/access_tokens/398768/edit
        referer: referer, // This works
        fetchFn: (url: RequestInfo | URL, init: RequestInit) => {
            console.log(`init.referrer: ${init.referrer}`); // This seems like a useless param? Maybe a mis-typing?
            console.log("Actual HTTP headers:", {...init.headers, Authorization: 'redacted'});
            return fetch(url, init);
        },
    });
})()