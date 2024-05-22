// Fetch the filter list from the provided URL
fetch('https://raw.githubusercontent.com/piperun/iploggerfilter/master/filterlist')
  .then(response => response.text())
  .then(data => {
    const filterList = data.split('\n').filter(line => line.trim() !== '' && !line.startsWith('!'));
    chrome.runtime.onInstalled.addListener(() => {
      const rules = filterList.map((url, index) => ({
        id: index + 1,
        priority: 1,
        action: {
          type: "redirect",
          "redirect": {
            "extensionPath": "/block.html"
          }
        },
        condition: {
          urlFilter: `||${url}^`,
          resourceTypes: ["main_frame", "sub_frame"]
        }
      }));
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({ length: filterList.length }, (_, index) => index + 1),
        addRules: rules
      });
    });
  })
  .catch(error => console.error('Failed to fetch filter list:', error));
