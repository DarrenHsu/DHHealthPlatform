"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class DBHelper {
    static openDB(path) {
        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;
        this.connection = mongoose.createConnection(path);
        this.connection.on("error", console.error.bind(console, "Connection Error:"));
        this.connection.once("open", function () {
            console.log("DB " + path + " Connected!");
        });
    }
    static closeDB() {
        if (this.connection) {
            this.connection.close((err) => {
                console.log("DB Closed!");
            });
        }
    }
}
exports.DBHelper = DBHelper;
