const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const routerProductos = require('./routes/products.routes')
const routerPaymentIntes = require('./routes/paymentIntes.routes');
const mysql = require('mysql');
const myconn = require('express-myconnection')


// conexion despligue
app.set('port', process.env.PORT || 4000);
const  dbOptions = {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'coffeandpastries',
    port: 3306
}

//middleware
app.use(myconn(mysql, dbOptions, 'single'))

app.use(morgan('dev'));
app.use(cors())
app.use(express.json())
app.use(fileUpload({tempFileDir: '/temp'}))
app.use( express.static(path.join(__dirname, '../public')))
//Global Variables


//Routes

app.use(routerProductos);
app.use(routerPaymentIntes);


//startig server
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
})