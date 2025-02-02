import express from 'express';
import { db } from "./config/database"
import cors from 'cors';
import { gadgets, users } from './models/models.ts';
import authRoutes from './routes/auth';
import gadgetRoutes from './routes/gadgets';
import unprotectedRoutes from './routes/unprotected';
import { setupSwaggerDocs } from './config/swagger.ts';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));


// defining apis
app.use('/auth', authRoutes);
app.use('/api', gadgetRoutes)
app.use('/unprotected/api', unprotectedRoutes)

// Swagger setup
setupSwaggerDocs(app, Number(PORT));

const initiateServer = async () => {
    try {

        // printing table's initial state
        console.table(await db.select().from(users))

        app.listen(PORT, () => {
            console.log(`[SERVER] Server Running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("[SERVER] Error Starting The Server:", error);
    }
};

initiateServer();
