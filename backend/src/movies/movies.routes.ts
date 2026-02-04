import { Router, Request, Response } from "express";
import type { Db } from "../db.js";

export function createMovieRouter(db: Db) {
  const r = Router();

  // 1. Obtener todas las películas
  r.get("/", (_req: Request, res: Response) => {
    db.all(
      "SELECT * FROM PELICULA ORDER BY titulo ASC",
      [],
      (err: any, rows: any[]) => {
        // Usamos any para evitar conflictos de tipos
        if (err) {
          res.status(500).json({ ok: false, error: "database_error" });
          return;
        }
        res.json({ ok: true, movies: rows });
      },
    );
  });

  // 2. RUTA DINÁMICA
  r.get("/:categoryName", (req: Request, res: Response) => {
    const { categoryName } = req.params;

    const sql = `
      SELECT p.titulo 
      FROM PELICULA p
      JOIN CATEGORIA c ON p.categoria_id = c.id
      WHERE c.nombreCat = ?
    `;

    db.all(sql, [categoryName], (err: any, rows: any[]) => {
      if (err) {
        res.status(500).json({ ok: false, error: "database_error" });
        return;
      }
      res.json({ ok: true, category: categoryName, movies: rows });
    });
  });

  return r;
}
