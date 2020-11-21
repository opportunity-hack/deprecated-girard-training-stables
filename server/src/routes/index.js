import apiRoutes from './api';

const init = server => {
  server.get('/', (req, res, next) => {
    console.log(`Request received for ${req.originalUrl}`);
    res.status(200).json({ 'status': 'online' });
    return next();
  });
 
  server.use('/api', apiRoutes);
};


const routes = {
  init,
};

export default routes;
