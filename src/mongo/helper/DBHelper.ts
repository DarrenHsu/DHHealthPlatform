import * as q from "q";
import mongoose = require("mongoose");
import { DHLog } from "../../util/DHLog";

export class DBHelper {

    public static connection: mongoose.Connection;
    public static isConnection: boolean = false;

    public static openDB(path: string) {
        global.Promise = q.Promise;
        mongoose.Promise = global.Promise;
        this.connection = mongoose.createConnection(path,  { useMongoClient: true });
        this.connection.on("error", console.error.bind(console, "Connection Error:"));
        this.connection.once("open", function() {
            this.isConnection = true;
            DHLog.d("DB " + path + " Connected!");
        });
    }

    public static closeDB() {
        if (this.connection) {
            this.connection.close((err) => {
                this.isConnection = false;
                DHLog.d("DB Closed!");
            });
        }
    }
}