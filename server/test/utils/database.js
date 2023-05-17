import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

let mongoDB = null;

const connect = async() => {
    mongoDB = await MongoMemoryServer.create();
    const uri = mongoDB.getUri();
    await mongoose.connect(uri);
}

const drop = async() => {
    if (mongoDB) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoDB.stop();
    }
}

const dropCollections = async() => {
    if (mongoDB) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
}

module.exports = { connect: connect, drop: drop, dropCollections: dropCollections }
