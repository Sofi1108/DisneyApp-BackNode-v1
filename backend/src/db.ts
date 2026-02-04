import sqlite3 from "sqlite3";

// ESTA LÍNEA ES LA CLAVE:
export type Db = sqlite3.Database; 

export function createDb(): Db {
    sqlite3.verbose();
    const filename = "data/disney.sqlite3";
    const db = new sqlite3.Database(filename, (err) => {
        if (!err) {
            db.run("PRAGMA foreign_keys = ON;");
        }
    });
    return db;
}