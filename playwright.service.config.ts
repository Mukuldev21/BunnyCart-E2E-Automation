import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });



export default defineConfig({
    testDir: './src/tests',
    timeout: 60000,
    retries: 0,
    reporter: [
        ['list'],
        ['html'],
        ['./reporters/touch reporters/touch-reporter.ts'],
    ],
    workers: 1, // Free tier limit
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        baseURL: process.env.BASE_URL,
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'LambdaTest: Chrome',
            use: {
                browserName: 'chromium',
                // @ts-ignore
                connectOptions: {
                    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                        JSON.stringify({
                            browserName: 'Chrome',
                            browserVersion: 'latest',
                            'LT:Options': {
                                platform: 'Windows 10',
                                build: `BunnyCart E2E Build - ${new Date().toLocaleString()}`,
                                name: 'BunnyCart Test',
                                user: process.env.LT_USERNAME,
                                accessKey: process.env.LT_ACCESS_KEY,
                                network: true,
                                video: true,
                                console: true,
                            },
                        })
                    )}`,
                },
            },
        },
    ],
});
