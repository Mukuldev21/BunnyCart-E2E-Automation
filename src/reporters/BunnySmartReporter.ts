import SmartReporter from 'playwright-smart-reporter';
import { FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export default class BunnySmartReporter extends SmartReporter {
    async onEnd(result: FullResult) {
        // 1. Let the original reporter generate the file
        await super.onEnd(result);

        // 2. Customize the generated report
        // Default path used by playwright-smart-reporter is src/tests/smart-report.html
        // If we want to be robust, we could try to read options, but standard usage here relies on default.
        const reportPath = path.join(process.cwd(), 'src', 'tests', 'smart-report.html');

        console.log(`[BunnySmartReporter] Customizing report at: ${reportPath}`);

        try {
            if (fs.existsSync(reportPath)) {
                let content = fs.readFileSync(reportPath, 'utf8');

                // Customization Logic
                const originalTitle = 'StageWright Local';
                const newTitle = 'BunnyCart E2E Automation';

                const originalSubtitle = 'Get your test stage right.';
                const newSubtitle = 'QA/Staging';

                if (content.includes(originalTitle)) {
                    content = content.replace(originalTitle, newTitle);
                    content = content.replace(originalSubtitle, newSubtitle);

                    fs.writeFileSync(reportPath, content);
                    console.log('✅ [BunnySmartReporter] Report title and subtitle updated successfully.');
                } else {
                    console.log('ℹ️ [BunnySmartReporter] Report already customized or text not found.');
                }

            } else {
                console.warn(`⚠️ [BunnySmartReporter] Report file not found at expected path: ${reportPath}`);
            }
        } catch (error) {
            console.error('❌ [BunnySmartReporter] Error customizing report:', error);
        }
    }
}
