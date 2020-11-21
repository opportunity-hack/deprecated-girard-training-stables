import dotenv from 'dotenv';

dotenv.config();
const configs = {
  port: process.env.PORT || 3000,
  databaseURI: process.env.DATABASE_URI || 'mongodb+srv://thapasya.murali@gmail.com:slyth3ri@n@bot-cluster-1.dluym.mongodb.net/opphack?retryWrites=true&w=majority',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8000',
};

export default Object.freeze(configs);