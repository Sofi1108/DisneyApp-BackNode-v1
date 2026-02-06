import { Router, Request, Response } from "express";
import type { Db } from "../db.js";

export function createMovieRouter(db: Db) {
  const r = Router();

  // 1. Obtener todas las películas
  r.get("/", (_req: Request, res: Response) => {
    db.all("SELECT * FROM PELICULA", [], (err: any, rows: any[]) => {
      if (err) {
        res.status(500).json({ ok: false, error: "database_error" });
        return;
      }
      res.json({ ok: true, movies: rows });
    });
  });

  // 2. BUSCADOR
  r.get("/search/q", (req: Request, res: Response) => {
    const query = req.query.query;

    if (!query) {
      res.json({ ok: true, movies: [] });
      return;
    }

    const sql = `
      SELECT p.*, c.nombreCat 
      FROM PELICULA p
      JOIN CATEGORIA c ON p.categoria_id = c.id
      WHERE p.titulo LIKE ? 
      OR c.nombreCat LIKE ?
    `;

    const searchTerm = `%${query}%`;

    db.all(sql, [searchTerm, searchTerm], (err: any, rows: any[]) => {
      if (err) {
        res.status(500).json({ ok: false, error: "database_error" });
        return;
      }
      res.json({ ok: true, movies: rows });
    });
  });

  // 3. RUTA DINÁMICA
  r.get("/:categoryName", (req: Request, res: Response) => {
    const { categoryName } = req.params;

    const sql = `
      SELECT p.* FROM PELICULA p
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
