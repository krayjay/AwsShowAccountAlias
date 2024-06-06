// ==UserScript==
// @name     DisplayAWSAccountAlias
// @version  1
// @grant    none
// @match https://*.console.aws.amazon.com/*
// ==/UserScript==

window.addEventListener('load', function() {

function extractAWSData() {
    const metaTag = document.querySelector('meta[name="awsc-session-data"]');
    if (metaTag) {
        const content = metaTag.getAttribute('content');
        const accountIdMatch = content.match(/"accountId":"(\d+)"/);
        const accountAliasMatch = content.match(/"accountAlias":"([^"]+)"/);  // "

        if (accountIdMatch && accountAliasMatch) {
            console.log('Account ID found:', accountIdMatch[1]);
            console.log('Extracted account alias:', accountAliasMatch[1]);
            return { accountId: accountIdMatch[1], accountAlias: accountAliasMatch[1] };
        } else {
            console.log('Data not complete, retrying...');
            //setTimeout(modifyMenuBar, 200);
            return null;
        }
    } else {
        console.log('Meta tag not found, retrying...');
        setTimeout(extractAWSData, 2000);
        return null;
    }
}

// Inserts our AccountID and Alias into top menu of page
function modifyMenuBar() {
    const awsData = extractAWSData();
    if (awsData) {
        console.log('AWS Data found:', awsData);

        function checkAndModifyAdminLabel() {

            // You may want to adjust the targeting of this querySelector to match your own environment if it differs
            const adminSpan = document.querySelector('span[title*="AWSReservedSSO_"]');
            if (adminSpan) {
                console.log('Admin label found:', adminSpan.textContent);
                const textParts = adminSpan.textContent.split('/');
                adminSpan.setAttribute('style', 'margin-top:15px !important;height:auto !important;');
                adminSpan.textContent = textParts[0].trim();
                adminSpan.innerHTML += `<br><span style='display:contents;color:orange;font-weight:bold;'>${awsData.accountAlias} (${awsData.accountId})</span>`;
            } else {
                console.log('Admin label not found, retrying...');
                setTimeout(checkAndModifyAdminLabel, 2000);
            }
        }
        checkAndModifyAdminLabel();

    }
}

// Start the extraction process
modifyMenuBar();

});
