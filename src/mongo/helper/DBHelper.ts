import mongoose = require("mongoose");

export class DBHelper {
    public static connection: mongoose.Connection;

    public static openDB(path: string) {
        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;
        this.connection = mongoose.createConnection(path);
        this.connection.on("error", console.error.bind(console, "Connection Error:"));
        this.connection.once("open", function() {
          console.log("DB " + path + " Connected!");
        });
    }

    public static closeDB() {
        if (this.connection) {
            this.connection.close((err) => {
                console.log("DB Closed!");
            });
        }
    }
}