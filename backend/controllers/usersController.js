const { getCollection } = require('../conection');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const collectionName = 'users';

exports.getAll = async (request, reply) => {
    const col = await getCollection(collectionName);
    const data = await col.find().toArray();
    return data;
};

exports.getById = async (request, reply) => {
    const col = await getCollection(collectionName);
    const user = await col.findOne({ _id: new ObjectId(request.params.id) });

    if (user) {
        // Eliminar el campo 'password' del objeto usuario
        delete user.password;
    }

    return user;
};

exports.create = async (request, reply) => {
    const col = await getCollection('users');
    const { username, email, password, ...rest } = request.body;

    // Verificar si el username o email ya existen
    const existingUser = await col.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return reply.code(400).send({ error: 'El nombre de usuario o correo ya está en uso' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username,
        email,
        password: hashedPassword,
        ...rest,
        createdAt: new Date(),
    };

    const result = await col.insertOne(newUser);
    reply.code(201).send({ message: 'Usuario creado', id: result.insertedId });
};

exports.update = async (request, reply) => {
    const col = await getCollection('users');
    const userId = request.params.id;
    const { username, email, ...updateData } = request.body;

    // Verificar si el nuevo username o email ya están en uso por otro usuario
    const existing = await col.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: new ObjectId(userId) }, // Ignora al usuario que se está actualizando
    });

    if (existing) {
        return reply.code(400).send({ error: 'El nombre de usuario o correo ya está en uso' });
    }

    // Si estás actualizando la contraseña también, hasheala
    if (updateData.password) {
        const bcrypt = require('bcrypt');
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await col.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { username, email, ...updateData } }
    );

    if (result.matchedCount === 0) {
        return reply.code(404).send({ error: 'Usuario no encontrado' });
    }

    reply.send({ message: 'Usuario actualizado correctamente' });
};

exports.remove = async (request, reply) => {
    const col = await getCollection(collectionName);
    const result = await col.deleteOne({ _id: new ObjectId(request.params.id) });
    return result;
};
