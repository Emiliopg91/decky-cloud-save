import { Backend } from "./backend";

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export class Logger {

    private static prefix: string = "[DCS]";
    private static currentLevel = LogLevel.INFO;

    public static async initialize() {
        const level: string = await Backend.backend_call<{}, string>("get_log_level", {});
        this.currentLevel = LogLevel[level as keyof typeof LogLevel];
        Logger.log(LogLevel.INFO, "Logger initialized at level '" + LogLevel[this.currentLevel] + "'");
    }

    private static log(lvl: LogLevel, ...args: any) {
        if (Logger.isLevelEnabled(lvl)) {
            Backend.backend_call<{ level: string, msg: string }, void>("log", { level: LogLevel[lvl], msg: "" + args });
            console.log(Logger.prefix + "[" + LogLevel[lvl] + "]", ...args);
        }
    }
    private static isLevelEnabled(lvl: LogLevel): boolean {
        return this.currentLevel <= lvl;
    }

    public static debug(...args: any) {
        Logger.log(LogLevel.DEBUG, ...args);
    }

    public static info(...args: any) {
        Logger.log(LogLevel.INFO, ...args);
    }

    public static warn(...args: any) {
        Logger.log(LogLevel.WARN, ...args);
    }

    public static error(...args: any) {
        Logger.log(LogLevel.ERROR, ...args);
    }
}