const express = require('express');
const app = express();
const expressSession = require('express-session');  // Agrega esta línea
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const { pool } = require('./config/db');
const { promisify } = require('util');
const { getUserByUsername, getUserById, updateUser } = require('./userHelper/userHelper');


// Promisify la conexión para usar promesas
const query = promisify(pool.query).bind(pool);

// Configuración de sesiones
app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Configuración de plantillas EJS
app.set('view engine', 'ejs');

// Middleware para verificar la autenticación
const isAuthenticated = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
};

// Middleware para pasar datos a las vistas
app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

// Configuración de archivos estáticos
app.use('/resources', express.static('public'));

// Parseo de datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas de autenticación
app.get('/login', (req, res) => {
    res.render('login', { msg: 'Esto es un mensaje desde NODE' });
});


app.post('/auth', async (req, res) => {
    const username = req.body.username;
    const password = req.body.pass;

    try {
        // Buscar al usuario por nombre de usuario en la base de datos
        const user = await getUserByUsername(username);

        if (!user) {
            res.render('login', { msg: 'Usuario no encontrado' });
            return;
        }

        // Comparar la contraseña ingresada con la almacenada
        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (passwordMatch) {
            // Establecer la sesión si las credenciales son correctas
            req.session.loggedin = true;
            req.session.name = user.name;
            res.redirect('/');
        } else {
            res.render('login', { msg: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la autenticación');
    }
});

// Rutas de gestión de usuarios
app.get('/create', isAuthenticated, (req, res) => {
    res.render('create');
});
// Rutas de gestión de usuarios
app.post('/create', isAuthenticated, async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    const { nombre, apellido, telefono, direccion } = req.body;

    try {
        // Inserta un nuevo cliente en la base de datos
        const [results, _] = await pool.query(
            'INSERT INTO clientes (nombre, apellido, tel, direccion) VALUES (?, ?, ?, ?)',
            [nombre, apellido, telefono, direccion]
        );

        res.redirect('/tabla'); // Redirige a la lista de usuarios o a donde desees
    } catch (error) {
        console.error('Error al agregar el cliente:', error);
        res.status(500).send('Error al agregar el cliente volver a http://localhost:3000');
    }
});
app.get('/register', (req, res) => {
    res.render('register', { msg: 'Esto es un mensaje desde NODE' });
});

app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const name = req.body.name;
        const email = req.body.email;
        const pass = req.body.pass;
        let passwordHash = await bcryptjs.hash(pass, 8);

        const [results, _] = await pool.query('INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)',
            [username, name, email, passwordHash]);

        res.render('register', {
            alert: true,
            alertTitle: "Registro Exitoso",
            alertMessage: "Registro exitoso.",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1500,
            ruta: ''
        });
    } catch (error) {
        console.error(error);
        res.render('register', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error al registrar el usuario.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: ''
        });
    }
});


app.get('/edit/:id_cliente', isAuthenticated, async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    try {
        const id_cliente = req.params.id_cliente;
        const user = await getUserById(id_cliente);
        res.render('edit', { user });
    } catch (error) {
        console.error(error);
        res.status(404).send('Usuario no encontrado');
    }
});

app.post('/edit/:id_cliente', isAuthenticated, async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    try {
        const id_cliente = req.params.id_cliente;
        const { nombre, apellido, tel, direccion } = req.body;

        // Realiza la actualización en la base de datos
        await updateUser(id_cliente, nombre, apellido, tel, direccion);

        res.redirect('/tabla'); // Redirige a la lista de usuarios o a donde desees
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el usuario');
    }
});

app.get('/delete/:id', isAuthenticated, async (req, res) => {
    const userId = req.params.id;

    try {
        // Elimina el usuario de la base de datos
        const [results, _] = await query('DELETE FROM clientes WHERE id_cliente = ?', [userId]);
        console.log('Usuario eliminado:', results);

        // Redirige a la lista de usuarios
        res.redirect('/tabla');
    } catch (error) {
        // Maneja el error, por ejemplo, redirige a una página de error o muestra un mensaje
        console.error('Error al eliminar el cliente:', error);
        res.status(500).send('Error al eliminar el cliente');
    }
});
// Rutas de gestión de usuarios
app.get('/tabla', isAuthenticated, async (req, res) => {
    try {
        const [results, _] = await pool.query('SELECT * FROM clientes');

        console.log('Resultados de la consulta:', results);

        // Renderiza la vista 'tabla' y pasa las variables 'login' y 'name' al contexto
        res.render('tabla', { users: results, login: req.session.loggedin, name: req.session.name });
    } catch (error) {
        console.error('Error al obtener datos de la tabla clientes:', error);
        res.status(500).send('Error al obtener datos de la tabla clientes');
    }
});

// Ruta de inicio
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirige al login después de cerrar la sesión
    });
});
// Configuración del servidor y escucha
app.listen(3000, (error) => {
    if (error) {
        console.error('Error al iniciar el servidor:', error);
    } else {
        console.log('SERVER RUNNING IN http://localhost:3000');
    }
});

console.log(__dirname);
