import express from 'express';
import cors from 'cors';
import { appRouter } from './routes';
import { EnvironmentVariableReader } from '../env-reader/environment-variable-reader';
import { Response, Request } from './typedefs';
import { logging } from './middleware/logging';

const envReader = new EnvironmentVariableReader();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logging());

// Routes
app.use('/api/v1', appRouter);

// Root response
app.get('/', (req: Request, res: Response) => {
    res.json({ apiVersions: [{ version: 'v1', root: '/api/v1' }] });
});

export const startApiServer = async () => {
    const port = envReader.readOrElseGet({
        variableName: 'PORT',
        orElse: () => '8080',
    });

    app.listen(port, () => {
        console.log(`API is now listening on port ${port} 🚀`);
    }).on('error', (err) => {
        console.log(`Failed to start API: ${err}`);
    });
};
