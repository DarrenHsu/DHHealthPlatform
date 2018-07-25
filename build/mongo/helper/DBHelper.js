"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const q = require("q");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description db 資料存取控制
 */
class DBHelper {
    static openDB(path) {
        global.Promise = q.Promise;
        mongoose.Promise = global.Promise;
        this.connection = mongoose.createConnection(path, { useMongoClient: true });
        this.connection.on('error', console.error.bind(console, 'Connection Error:'));
        this.connection.once('open', function () {
            this.isConnection = true;
            DHLog_1.DHLog.d('DB ' + path + ' Connected!');
        });
    }
    static closeDB() {
        if (this.connection) {
            this.connection.close((err) => {
                this.isConnection = false;
                DHLog_1.DHLog.d('DB Closed!');
            });
        }
    }
}
DBHelper.isConnection = false;
exports.DBHelper = DBHelper;
