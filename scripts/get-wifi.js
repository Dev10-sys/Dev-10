const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getWifiSSID() {
  try {
    const stdout = execSync("netsh wlan show interfaces").toString();
    const match = stdout.match(/^\s+SSID\s+:\s+(.+)$/m);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (e) {
    // If not on windows or fails
  }
  return "Local WiFi";
}

const ssid = getWifiSSID();
const outputPath = path.join(__dirname, "..", "public", "local-wifi.json");

fs.writeFileSync(outputPath, JSON.stringify({ ssid }));
console.log(`Saved WiFi SSID "${ssid}" to ${outputPath}`);
