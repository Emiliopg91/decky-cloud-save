import { Backend } from "./backend";

export class Logger {

    private static prefix: string = "[DCS]";

    private static isDebugEnabled = false;
    private static isInfoEnabled = true;
    private static isWarnEnabled = true;

    public static async initialize() {
        const level: string = await Backend.backend_call<{}, string>("get_log_level", {});

        if (level == "DEBUG")
            Logger.isDebugEnabled = true;
        if (level == "DEBUG" || level == "INFO")
            Logger.isInfoEnabled = true;
        if (level == "DEBUG" || level == "INFO" || level == "WARN")
            Logger.isWarnEnabled = true;

        Logger.log("INFO", "Logger initialized at level '" + level + "'");
    }

    private static log(lvl: "DEBUG" | "INFO" | "WARN" | "ERROR", ...args: any) {
        Backend.backend_call<{ level: string, msg: string }, void>("log", { level: lvl, msg: "" + args });
        console.log(Logger.prefix + "[" + lvl + "]", ...args);
    }

    public static debug(...args: any) {
        if (Logger.isDebugEnabled)
            Logger.log("DEBUG", ...args);
    }

    public static info(...args: any) {
        if (Logger.isInfoEnabled)
            Logger.log("INFO", ...args);
    }

    public static warn(...args: any) {
        if (Logger.isWarnEnabled)
            Logger.log("WARN", ...args);
    }

    public static error(...args: any) {
        Logger.log("ERROR", ...args);
    }
}