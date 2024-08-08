import { NextResponse } from 'next/server';
import pool from '@/app/libs/mysql';

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = 'select * from players';
    const [rows] = await db.execute(query);

    console.log({ rows });
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
