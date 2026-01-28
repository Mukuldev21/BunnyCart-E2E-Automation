const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../src/tests/smart-report.html');

try {
    if (fs.existsSync(reportPath)) {
        let content = fs.readFileSync(reportPath, 'utf8');

        // Replace title
        content = content.replace('StageWright Local', 'BunnyCart E2E Automation');

        // Replace subtitle
        content = content.replace('Get your test stage right.', 'QA/Staging');

        fs.writeFileSync(reportPath, content);
        console.log('✅ Report customized successfully: BunnyCart E2E Automation');
    } else {
        console.log('⚠️ Report file not found at:', reportPath);
    }
} catch (error) {
    console.error('❌ Error customizing report:', error);
    process.exit(1);
}
