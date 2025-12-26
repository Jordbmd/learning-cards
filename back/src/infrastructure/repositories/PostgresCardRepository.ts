import { ICardRepository } from '../../domain/repositories/ICardRepository.js';
import Card from '../../domain/entities/Card.js';
import pool from '../database/pool.js';

export class PostgresCardRepository implements ICardRepository {
  async save(card: Card): Promise<void> {
    const query = `
      INSERT INTO cards (id, question, answer, category, tags, created_at, last_reviewed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) 
      DO UPDATE SET 
        question = EXCLUDED.question,
        answer = EXCLUDED.answer,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        last_reviewed_at = EXCLUDED.last_reviewed_at
    `;

    const values = [
      card.getId(),
      card.getQuestion(),
      card.getAnswer(),
      card.getCategory(),
      card.getTags(),
      card.getCreatedAt(),
      card.getLastReviewedAt(),
    ];

    await pool.query(query, values);
  }

  async findById(id: string): Promise<Card | null> {
    const query = 'SELECT * FROM cards WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToCard(result.rows[0]);
  }

  async findAll(filters?: { category?: number; tags?: string[]; fromDate?: Date; toDate?: Date }): Promise<Card[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.category) {
      conditions.push(`category = $${paramCount}`);
      values.push(filters.category);
      paramCount++;
    }

    if (filters?.tags && filters.tags.length > 0) {
      conditions.push(`tags && $${paramCount}`);
      values.push(filters.tags);
      paramCount++;
    }

    if (filters?.fromDate) {
      conditions.push(`created_at >= $${paramCount}`);
      values.push(filters.fromDate);
      paramCount++;
    }

    if (filters?.toDate) {
      conditions.push(`created_at <= $${paramCount}`);
      values.push(filters.toDate);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM cards ${whereClause} ORDER BY created_at DESC`;
    
    const result = await pool.query(query, values);

    return result.rows.map(row => this.mapRowToCard(row));
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM cards WHERE id = $1';
    await pool.query(query, [id]);
  }

  private mapRowToCard(row: any): Card {
    return new Card({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      tags: row.tags || [],
      createdAt: new Date(row.created_at),
      lastReviewedAt: row.last_reviewed_at ? new Date(row.last_reviewed_at) : null,
    });
  }
}
