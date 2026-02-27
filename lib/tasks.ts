import { sql } from './db';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Status,
  Priority,
} from '@/types';

export async function getAllTasks(filters?: {
  status?: Status;
  priority?: Priority;
  search?: string;
}): Promise<Task[]> {
  let query = `SELECT * FROM tasks WHERE 1=1`;
  const params: unknown[] = [];
  let idx = 1;

  if (filters?.status) {
    query += ` AND status = $${idx++}`;
    params.push(filters.status);
  }
  if (filters?.priority) {
    query += ` AND priority = $${idx++}`;
    params.push(filters.priority);
  }
  if (filters?.search) {
    query += ` AND (title ILIKE $${idx} OR description ILIKE $${idx})`;
    params.push(`%${filters.search}%`);
    idx++;
  }

  query += ` ORDER BY created_at DESC`;

  const rows = await sql(query, params);
  return rows as Task[];
}

export async function getTaskById(id: string): Promise<Task | null> {
  const rows = await sql(`SELECT * FROM tasks WHERE id = $1`, [id]);
  return (rows[0] as Task) ?? null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const {
    title,
    description = null,
    status = 'TODO',
    priority = 'MEDIUM',
  } = input;
  const rows = await sql(
    `INSERT INTO tasks (title, description, status, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, status, priority]
  );
  return rows[0] as Task;
}

export async function updateTask({
  id,
  ...input
}: UpdateTaskInput): Promise<Task | null> {
  const fields = Object.entries(input).filter(([, v]) => v !== undefined);
  if (fields.length === 0) return getTaskById(id);

  const setClause = fields.map(([k], i) => `${k} = $${i + 2}`).join(', ');
  const values = fields.map(([, v]) => v);

  const rows = await sql(
    `UPDATE tasks SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return (rows[0] as Task) ?? null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const rows = await sql(`DELETE FROM tasks WHERE id = $1 RETURNING id`, [id]);
  return rows.length > 0;
}
