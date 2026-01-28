const { exec } = require('child_process');
const path = require('path');

// Open the report
const reportPath = path.join(__dirname, '../src/tests/smart-report.html');
console.log(`📂 Opening report: ${reportPath}`);

const startCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';

exec(`${startCommand} "${reportPath}"`, (err) => {
    if (err) {
        console.error('❌ Failed to open report:', err);
    } else {
        console.log('✅ Report opened successfully.');
    }
});
