//1 - Invocamos a express
const express = require('express')
const app = express();

const expressSession = require('express-session');

//2 - Seteamos urlendcoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 - Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4 - El directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');

//6 - Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - Var. de session
const session = require ('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));

//Llama router
app.use('/', require('./router/router'));

//8 - Invocamos al modulo de conexion de la DB
const connection = require('./config/db');

//9 - Estableciendo las rutas 
app.get('/login', (req, res) => {
    res.render('login', {msg: 'Esto es un mensaje desde NODE'});
})
// Middleware para almacenar la información de autenticación del usuario en la sesión.
// Configure the session middleware.
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/create', (req, res) => {
    // Verifica si el usuario está autenticado.
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
        }
    
        // Renderiza la plantilla.
        res.render('create');
    });
    
    app.use((req, res, next) => {
        res.locals.req = req;
        next();
    });

app.get('/tabla', (req, res) => {
    // Verifica si el usuario está autenticado.
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
        }
    
        // Renderiza la plantilla.
        res.render('tabla');
    });
    
    app.use((req, res, next) => {
        res.locals.req = req;
        next();
    });

app.get('/register', (req, res) => {
    res.render('register', {msg: 'Esto es un mensaje desde NODE'});
})

//10 - Registracion
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);

connection.query('INSERT INTO users (username, name, email, rol, password) VALUES (?, ?, ?, ?, ?)',
        [username, name, email, rol, passwordHash],
        async (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    // Error de duplicado: username o email ya registrados
                    let errorMessage = 'El nombre de usuario o el email ya están registrados.';
                    if (error.sqlMessage.includes('username')) {
                        errorMessage = 'El nombre de usuario ya está registrado.';
                    } else if (error.sqlMessage.includes('email')) {
                        errorMessage = 'El email ya está registrado.';
                    }
                    res.render('register', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: errorMessage,
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    });
                } else {
                    console.log(error);
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
            } else {
                res.render('register', {
                    alert: true,
                    alertTitle: "Registro Exitoso",
                    alertMessage: "Registro exitoso.",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        });
});

//11 Autentication
app.post('/auth', async (req, res) => {
    const username = req.body.username;
    const pass = req.body.pass;
    
    if (username && pass) {
        connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (error, results) => {
            if (error) {
                console.log(error);
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Ocurrió un error en la autenticación",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].password))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    req.session.loggedin = true;
                    req.session.name = results[0].name;
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión Exitosa",
                        alertMessage: "¡Login Correcto!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
            }
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingrese un usuario y/o contraseña!",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});
//Modificacion de usuario
app.post('/edit/:id_cliente', async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    
    const id_cliente = req.params.id_cliente;
    const { nombre, apellido, tel, direccion } = req.body;
    
    // Realiza la actualización en la base de datos (debes implementar esta parte)
    const success = await updateUser(id_cliente, nombre, apellido, tel, direccion);
    
    if (success) {
        res.redirect('/tabla-autenticada'); // Redirige a la lista de usuarios o a donde desees
    } else {
        res.status(500).send('Error al actualizar el usuario');
    }
});

//Ruta de pagina para editar
app.get('/edit/:id_cliente', async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    const id_cliente = req.params.id_cliente;
    const user = await getUserById(id_cliente); // Debes implementar esta función

    if (!user) {
        res.status(404).send('Usuario no encontrado');
        return;
    }

    res.render('edit', { user });
});

// Definir la función para obtener un usuario por su ID
const getUserById = (id, callback) => {
    connection.query('SELECT * FROM clientes WHERE id_clientes = ?', [id], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0]);
            } else {
                callback({ message: 'cliente no encontrado' }, null);
            }
        }
    });
};

// Ruta para la edición de un usuario
app.get('/edit/:id', (req, res) => {
    const id_cliente = req.params.id;

    // Utiliza la función getUserById para obtener el usuario por su ID
    getUserById(id_cliente, (error, user) => {
        if (error) {
            // Maneja el error, por ejemplo, redirige a una página de error o muestra un mensaje
            console.error(error);
            res.redirect('/error'); // Puedes crear una página de error específica
        } else {
            // Valida los datos enviados por el usuario
            const errors = expressValidator.validate(req.body, userSchema);

            if (errors.length > 0) {
                // Si hay errores, redirige a la página de edición con los errores
                res.render('edit', { user, errors });
            } else {
                // Renderiza la página de edición con los datos del usuario
                res.render('edit', { user });
            }
        }
    });
});
// Ruta para eliminar un usuario
app.get('/delete/:id', (req, res) => {
    const userId = req.params.id;

    // Elimina el usuario de la base de datos
    connection.query('DELETE FROM clientes WHERE id_cliente = ?', [userId], (error, results) => {
        if (error) {
            // Maneja el error, por ejemplo, redirige a una página de error o muestra un mensaje
            console.error(error);
            res.status(500).send('Error al eliminar el cliente');
        } else {
            // Redirige a la lista de usuarios
            res.redirect('/tabla-autenticada');
        }
    });
});
// Ruta para la vista de la tabla 
app.get('/tabla-autenticada', async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    const query = 'SELECT * FROM clientes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            // Manejar el error aquí
        } else {
            res.render('tabla', { users: results });
        }
    });
});

//12 - Auth pages
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
    res.end();
});





//13 - Logout
app.get('/logout', (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

//Ejecuta nodejs
app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})

console.log(__dirname);
