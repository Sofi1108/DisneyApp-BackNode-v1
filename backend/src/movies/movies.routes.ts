import { Router } from "express";
import type { Db } from "../db.js";

export function createMovieRouter(db: Db) {
const r = Router();

// GET /api/movies/:=category
r.get("/", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE ORDER BY title ASC",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/accion
r.get("/accion", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Acción'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/animacion
r.get("/animacion", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Animación'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/cienciaFiccion
r.get("/cienciaFiccion", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Ciencia Ficción'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/fantasia
r.get("/fantasia", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Fantasía'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/clasico
r.get("/clasico", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Clásico'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/comedia
r.get("/comedia", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Comedia'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/terror
r.get("/terror", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Terror'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/musical
r.get("/musical", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Musical'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/thriller
r.get("/thriller", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Thriller'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});

// GET /api/movies/aventura
r.get("/aventura", (_req, res) => {
db.all(
"SELECT DISTINCT title FROM MOVIE WHERE category = 'Aventura'",
[],
(err, rows) => {
if (err) {
res.status(500).json({ ok: false, error: "database_error" });
return;
}
res.json({ ok: true, movies: rows });
}
);
});


return r;
}
/*
// pseudocódigo interno de sqlite3
function all(sql, params, callback) {
ejecutarSQL(sql, params, (error, result) => {
callback(error, result);
});
}

*/