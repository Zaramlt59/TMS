"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocked = isLocked;
exports.registerFailure = registerFailure;
exports.clearFailures = clearFailures;
const attempts = new Map();
const MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 5);
const WINDOW_MS = Number(process.env.LOGIN_WINDOW_MS || 15 * 60 * 1000);
const LOCK_MS = Number(process.env.LOGIN_LOCK_MS || 15 * 60 * 1000);
function keyFor(username, ip) {
    const u = (username || '').toLowerCase().trim();
    return `${u}|${ip || ''}`;
}
function isLocked(username, ip) {
    const key = keyFor(username, ip);
    const now = Date.now();
    const state = attempts.get(key);
    if (!state)
        return { locked: false, msRemaining: 0 };
    // Reset window if expired
    if (now - state.firstAt > WINDOW_MS) {
        attempts.delete(key);
        return { locked: false, msRemaining: 0 };
    }
    if (state.lockUntil && now < state.lockUntil) {
        return { locked: true, msRemaining: state.lockUntil - now };
    }
    return { locked: false, msRemaining: 0 };
}
function registerFailure(username, ip) {
    const key = keyFor(username, ip);
    const now = Date.now();
    let state = attempts.get(key);
    if (!state) {
        state = { count: 1, firstAt: now };
        attempts.set(key, state);
    }
    else {
        // Reset window if expired
        if (now - state.firstAt > WINDOW_MS) {
            state.count = 1;
            state.firstAt = now;
            state.lockUntil = undefined;
        }
        else {
            state.count += 1;
        }
    }
    if (state.count >= MAX_ATTEMPTS) {
        state.lockUntil = now + LOCK_MS;
        return { locked: true, msRemaining: LOCK_MS };
    }
    return { locked: false, msRemaining: 0 };
}
function clearFailures(username, ip) {
    const key = keyFor(username, ip);
    attempts.delete(key);
}
//# sourceMappingURL=loginLockout.js.map