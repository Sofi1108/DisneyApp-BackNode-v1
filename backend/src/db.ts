import sqlite3 from "sqlite3";

export type Db = sqlite3.Database;

export function createDb() {
    sqlite3.verbose();


    // Reutilizable: lo centralizamos aquí
    const filename = "data/disney.sqlite3";
    return new sqlite3.Database(filename);
}

