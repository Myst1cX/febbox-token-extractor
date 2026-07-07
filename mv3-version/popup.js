// Support both Firefox (browser.*) and Chrome (chrome.*)
const api = typeof browser !== 'undefined' ? browser : chrome;

const output = document.getElementById('cookieOutput');
const copyBtn = document.getElementById('copyBtn');

document.getElementById('getCookies').addEventListener('click', async () => {
  try {
    const domains = ["febbox.com", "www.febbox.com"];
    let allCookies = [];

    for (const domain of domains) {
      const cookies = await api.cookies.getAll({ domain });
      allCookies = allCookies.concat(cookies);
    }

    // Check if we found the "ui" cookie
    const uiCookie = allCookies.find(c => c.name === "ui");

    if (!uiCookie || !uiCookie.value.includes("ey")) {
      output.value = "Token not found, make sure you are logged in and reload.";
      return;
    }

    output.value = uiCookie.value;
    output.select();

  } catch (err) {
    console.error("Error fetching cookies:", err);
    output.value = "Error: " + err.message;
  }
});

copyBtn.addEventListener('click', () => {
  if (!output.value || output.value.startsWith('Token not found') || output.value.startsWith('Error:')) return;
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  });
});
