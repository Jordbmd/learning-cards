import { ICardRepository, CardFilters } from '../../domain/repositories/ICardRepository.js';
import Card from '../../domain/entities/Card.js';
import { Category, getCategoryOrder } from '../../domain/entities/Category.js';
import pool from '../database/pool.js';

export class PostgresCardRepository implements ICardRepository {
  async save(card: Card): Promise<void> {
    const query = `
      INSERT INTO cards (id, question, answer, category, tag, created_at, last_reviewed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) 
      DO UPDATE SET 
        question = EXCLUDED.question,
        answer = EXCLUDED.answer,
        category = EXCLUDED.category,
        tag = EXCLUDED.tag,
        last_reviewed_at = EXCLUDED.last_reviewed_at
    `;

    const values = [
      card.getId(),
      card.getQuestion(),
      card.getAnswer(),
      getCategoryOrder(card.getCategory()),
      card.getTag() || null,
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

  async findAll(filters?: CardFilters): Promise<Card[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.category) {
      conditions.push(`category = $${paramCount}`);
      values.push(getCategoryOrder(filters.category));
      paramCount++;
    }

    if (filters?.tag) {
      conditions.push(`tag = $${paramCount}`);
      values.push(filters.tag);
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
    const categoryMap: { [key: number]: Category } = {
      1: Category.FIRST,
      2: Category.SECOND,
      3: Category.THIRD,
      4: Category.FOURTH,
      5: Category.FIFTH,
      6: Category.SIXTH,
      7: Category.SEVENTH,
      8: Category.DONE,
    };

    const category = categoryMap[row.category];
    if (!category) {
      throw new Error(`Invalid category value in database: ${row.category}`);
    }

    return new Card({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: category,
      tag: row.tag || undefined,
      createdAt: new Date(row.created_at),
      lastReviewedAt: row.last_reviewed_at ? new Date(row.last_reviewed_at) : null,
    });
  }
}
