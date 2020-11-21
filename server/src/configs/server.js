import express from 'express';
import env from './env';
import routes from '../routes';

const app = () => {
    let application;
    const server = express();

    const create = () => {
        server.set('port', env.port);
        server.use(express.json());
        server.use(express.urlencoded({ extended: false }));
        routes.init(server);
    };

    const start = () => {
        create();
        const port = server.get('port');
        application = server.listen(port, () => {
            console.log(` server active on port ${port}`);
        });
    };

    const stop = () => {
        application.close(() => {
            console.log('Stopping Oppurtunity Hack server');
            process.exit(0);
        });

        setTimeout(() => {
            console.log('Could not stop gracefully, stopping forcefully');
            process.exit(1);
        }, 5000);
    };

    return {
        start,
        stop,
    };
};

export default app;
