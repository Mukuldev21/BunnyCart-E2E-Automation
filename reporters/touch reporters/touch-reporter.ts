import { Reporter, TestCase, TestResult, FullResult, FullConfig } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import { generateHtml } from './template';

class TouchReporter implements Reporter {
    private testResults: any[] = [];
    private envInfo: any = {};

    onBegin(config: FullConfig) {
        this.envInfo = {
            Project: "BunnyCart E2E tests",
            Browser: config.projects[0]?.name || "Chromium",
            Platform: process.platform === 'win32' ? 'Windows' : 'macOS',
            Version: "1.0.0"
        };
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const screenshots: any[] = [];
        for (const attachment of result.attachments) {
            if (attachment.path && fs.existsSync(attachment.path) && attachment.contentType.startsWith('image/')) {
                const base64 = `data:${attachment.contentType};base64,${fs.readFileSync(attachment.path).toString('base64')}`;
                screenshots.push({ name: attachment.name, base64 });
            }
        }

        const steps = result.steps.map(step => ({
            title: step.title,
            duration: step.duration,
            error: step.error?.message || null
        }));

        this.testResults.push({
            id: test.id,
            title: test.title,
            file: path.basename(test.location.file),
            status: result.status,
            duration: result.duration,
            error: result.error?.stack || result.error?.message || null,
            screenshots,
            flaky: result.retry > 0,
            steps: steps
        });
    }

    async onEnd(result: FullResult) {
        const totalDuration = this.testResults.reduce((acc, r) => acc + r.duration, 0);
        const stats = {
            total: this.testResults.length,
            passed: this.testResults.filter(r => r.status === 'passed').length,
            failed: this.testResults.filter(r => r.status === 'failed').length,
            flaky: this.testResults.filter(r => r.flaky).length,
            skipped: this.testResults.filter(r => r.status === 'skipped').length,
            duration: totalDuration,
            avgDuration: this.testResults.length > 0 ? Math.round(totalDuration / this.testResults.length) : 0
        };

        const html = generateHtml({ stats, tests: this.testResults, env: this.envInfo });
        fs.writeFileSync('touch-summary.html', html);
        console.log('\n🚀 Dashboard: touch-summary.html');
    }
}
export default TouchReporter;