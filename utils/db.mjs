import * as pg from 'pg'
const { Pool } = pg.default

const connectionPool = new Pool({
    connectionString:
        "postgresql://postgres:TheYami0152@localhost:5432/personal-blog"
})

export default connectionPool