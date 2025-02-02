import { defineConfig } from 'drizzle-kit'
import "dotenv/config"

// via connection params
export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.POSTGRES_HOST || "pgdb",
        port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
        user: process.env.POSTGRES_USER || "gaz",
        password: process.env.POSTGRES_PASSWORD || "cybergaz",
        database: process.env.POSTGRES_DB || "cybergaz",
    },
    schema: ["./src/models/*"]
})
