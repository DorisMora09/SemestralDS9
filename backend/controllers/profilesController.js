const { getCollection } = require('../conection');
const { ObjectId } = require('mongodb');

const collectionName = 'profiles';

exports.getAll = async (request, reply) => {
    const col = await getCollection(collectionName);
    const data = await col.find().toArray();
    return data;
};

exports.getById = async (request, reply) => {
    const col = await getCollection(collectionName);
    const data = await col.findOne({ _id: new ObjectId(request.params.id) });
    return data;
};

exports.create = async (request, reply) => {
    const col = await getCollection(collectionName);
    const result = await col.insertOne(request.body);
    reply.code(201).send(result);
};

exports.update = async (request, reply) => {
    const col = await getCollection(collectionName);
    const result = await col.updateOne(
        { _id: new ObjectId(request.params.id) },
        { $set: request.body }
    );
    return result;
};

exports.remove = async (request, reply) => {
    const col = await getCollection(collectionName);
    const result = await col.deleteOne({ _id: new ObjectId(request.params.id) });
    return result;
};
