import app from './src/configs/server';

const appInstance = app();

appInstance.start();

const stopApplication = () => {
    appInstance.stop();
}

process.on('SIGTERM', stopApplication);
process.on('SIGINT', stopApplication);
process.on('SIGQUIT', stopApplication);
