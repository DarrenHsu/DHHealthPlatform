"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DHLog {
    static d(message) {
        console.log(' <DHlog> ' + message + ' ');
    }
    static ld(message) {
        console.log(' <DHlog LINE> ' + message + ' ');
    }
}
exports.DHLog = DHLog;
