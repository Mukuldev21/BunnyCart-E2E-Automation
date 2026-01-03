/**
 * Simple Logger utility for colorful console output.
 * Uses standard ANSI escape codes for colors.
 */
export class Logger {
    private static readonly RED = '\x1b[31m';
    private static readonly GREEN = '\x1b[32m';
    private static readonly YELLOW = '\x1b[33m';
    private static readonly CYAN = '\x1b[36m';
    private static readonly RESET = '\x1b[0m';

    /**
     * Log a specific test step (Cyan)
     */
    static step(message: string) {
        console.log(`${this.CYAN}[STEP] ${message}${this.RESET}`);
    }

    /**
     * Log general information (Standard/White)
     */
    static info(message: string) {
        console.log(`[INFO] ${message}`);
    }

    /**
     * Log a successful action (Green)
     */
    static success(message: string) {
        console.log(`${this.GREEN}[SUCCESS] ${message}${this.RESET}`);
    }

    /**
     * Log a warning (Yellow)
     */
    static warn(message: string) {
        console.log(`${this.YELLOW}[WARN] ${message}${this.RESET}`);
    }

    /**
     * Log an error (Red)
     */
    static error(message: string) {
        console.log(`${this.RED}[ERROR] ${message}${this.RESET}`);
    }
}
