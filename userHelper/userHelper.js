const { pool } = require('../config/db'); // Asegúrate de proporcionar la ruta correcta

// Obtener usuario por nombre de usuario
const getUserByUsername = async (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [results, _] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            resolve(results[0]);
        } catch (error) {
            reject(error);
        }
    });
};

// Obtener usuario por ID
const getUserById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [results, _] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
            if (results.length > 0) {
                resolve(results[0]);
            } else {
                reject({ error: 'Cliente no encontrado' });
            }
        } catch (error) {
            reject({ error: 'Error al obtener el cliente', details: error });
        }
    });
};

// Actualizar usuario por ID
const updateUser = async (id, nombre, apellido, tel, direccion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [results, _] = await pool.query(
                'UPDATE clientes SET nombre = ?, apellido = ?, tel = ?, direccion = ? WHERE id_cliente = ?',
                [nombre, apellido, tel, direccion, id]
            );
            resolve(results);
        } catch (error) {
            reject({ error: 'Error al actualizar el cliente', details: error });
        }
    });
};

module.exports = {
    getUserByUsername,
    getUserById,
    updateUser
};