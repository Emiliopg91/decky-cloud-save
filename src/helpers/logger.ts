import { backend_call } from "./backend";

const prefix: string = "[DCS]";

let isDebugEnabled = false;
let isInfoEnabled = true;
let isWarnEnabled = true;

export async function initialize() {
    const level: string = await backend_call<{}, string>("get_log_level", {});

    if (level == "DEBUG")
        isDebugEnabled = true;
    if (level == "DEBUG" || level == "INFO")
        isInfoEnabled = true;
    if (level == "DEBUG" || level == "INFO" || level == "WARN")
        isWarnEnabled = true;

    log("INFO", "Logger initialized at level '" + level + "'");
}

function log(lvl: string, ...args: any) {
    backend_call<{ level: string, msg: string }, void>("log", { level: lvl, msg: "" + args });
    console.log(prefix + "[" + lvl + "]", ...args);
}

export function debug(...args: any) {
    if (isDebugEnabled)
        log("DEBUG", ...args);
}

export function info(...args: any) {
    if (isInfoEnabled)
        log("INFO", ...args);
}

export function warn(...args: any) {
    if (isWarnEnabled)
        log("WARN", ...args);
}

export function error(...args: any) {
    log("ERROR", ...args);
}