const querys = require('../database/querys')
const mysql2 = require('../database/mysql2')


module.exports = async function getItemById(id){
    let precio = 0

    return new Promise(function(resolve,reject){
        mysql2.query(querys.getOnlyOneProduct,[id], (err, rows)=>{
            if(rows === undefined){
                reject(new Error("Error rows is undefinide"))
            } 
            else{
                resolve(rows[0]);
            }
        })
    })
/* 

    

     mysql2.query(querys.getOnlyOneProduct,[id], (err, rows)=>{
        if(err) return;

         return  callback(rows[0].idProducto)
    }) */
    /* const resultado =  await mysql2.query(querys.getOnlyOneProduct,[id])
    return resultado[0] */
    
}