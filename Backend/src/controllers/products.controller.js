
const querys = require('../database/querys')
const path = require('path');
const fs = require('fs');
const { get } = require('http');

const productsCtrl = {};


//Obtiene  toda la informacion de los productos almacenados 
productsCtrl.getProducts =  async (req,res) => {  
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        
        conn.query(querys.getAllproducts, (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
 
};

/////////////////////////////////añade un producto junto con su imagen/////////////////////////////////////
productsCtrl.createNewProducts = async (req, res)=>{
    const {name,description,category,price} = req.body;

 
    if(name == null || description == null || category == null || price == null)
    {
        return res.status(400).json({clasificacion: 3, identificacion: 'Api', msg: 'bad Request. llena todo los campos'})
    }

    const image = req.files.agregarImagen
    //console.log(image);
    const tipoImagenValidas = ["image/jpeg","image/jpg", "image/png", "application/octet-stream"];
    
    if(image == null || tipoImagenValidas.indexOf(image.mimetype) == -1 ){
        return res.status(400).json({   clasificacion: 3,identificacion: 'Api',
                                        msg: 'bad Request. Verifique la imagen'})
    }


    let rutaImagen = path.join(__dirname,'../../public/imageProducts/')
        let nombreImagen = image.name;

        let nombreImagenGuiones = nombreImagen.replace(/ /g,"-"); //remplaza todos los espacios en blanco por guiones

    /* fs.writeFile(rutaImagen + nombreImagenGuiones, image.data, function(err){
        if (err) throw err;
    }) */
        image.mv(rutaImagen + nombreImagenGuiones ,function (err){
            
            if(err)
            {
                
                console.log('el error es:' + err);
                return res.json({clasificacion: 3, identificacion: 'Api', msg: 'La imagen no se pudo mover '})
            }
        });
    
        let url = 'http://localhost:4000/imageProducts/' + nombreImagenGuiones;

    req.getConnection((err, conn)=>{
        if(err) return res.json({ clasificacion: 4, indentificacion: 'Api', msg: err})
        
        conn.query(querys.addNewProducts, [name,description,category,price],(err, rows)=>{
            if(err) return res.json({ clasificacion: 3, indentificacion: 'Mysql', msg: err})

            const idInsertado = rows.insertId;
            console.log(idInsertado);
            conn.query(querys.addImageProducts, [idInsertado,nombreImagenGuiones, url],(err, rows)=>{
                if(err) return res.json({ clasificacion: 3, indentificacion: 'Mysql', msg: err})
    
                res.json({clasificacion: 1,identificacion: 'Api', msg: 'Producto agregado junto con la imagen'})
    
            })
         
        })
    
    })  

}

////////////////////////////Muestra la informacion del producto solicitado/////////////////////////////////////
productsCtrl.getProductById = async (req, res)=>{
    const {id } = req.params

    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        
        conn.query(querys.getOnlyOneProduct,[id], (err, rows)=>{
            if(err) return res.send(err)
            console.log(rows);
            res.json(rows)
        })
    })
}

/* //////
productsCtrl.getProductsbyObject = async (req,res)=>{


} */


///////////////////////////////////////Elimina un producto////////////////////////////////////////////////
productsCtrl.deleteProductById = async (req, res)=>{
    const {id } = req.params
    
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        
        conn.query(querys.deleteImageProducto,[id], (err, rows)=>{
            
            if(rows.affectedRows >= 1){
                conn.query(querys.deleteProduct,[id], (err, rows)=>{
                    res.json('se borro el producto y la imagen')
                })   
            }
            else{
                if(err) return res.send(err)
            }
           

        })
    })
}

productsCtrl.updateProductById = async (req, res)=>{
    const {id} = req.params

    const {name,description,category,price,nombreImagenActual,idImagen,editImagen} = req.body;
    console.log(name,description,category,price,nombreImagenActual,idImagen,editImagen)
    let nameImageActualGuiones = nombreImagenActual.replace(/ /g,"-");
    if(name == null || description == null || category == null || price == null)
    {
        return res.status(400).json({msg: 'bad Request. llena todo los campos'})
    }
    let imageNueva;

    if(editImagen == 'si'){
       imageNueva = req.files.agregarImagen
       console.log(imageNueva)
    }
    else{
        imageNueva = null
    }

    if(imageNueva == null || imageNueva == undefined){

        req.getConnection((err, conn)=>{
            if(err) return res.send(err)
            
            conn.query(querys.updateProduct,[name, description, category, price, id], (err, rows)=>{
                if(err) return res.send(err)
                console.log(rows);
                return res.json('only the product was modified')
            })
        })
    }
    else
    {

        //Verificacion de la imagen
        const tipoImagenValidas = ["image/jpeg","image/jpg", "image/png", "image/jfif"];
    
        if(tipoImagenValidas.indexOf(imageNueva.mimetype) == -1 ){
        return res.status(400).json({msg: 'bad Request. Verifique la imagen'})
        }

        //moviendo la imagen a la carpeta public
        let rutaCarpeta = path.join(__dirname,'../../public/imageProducts/')
        let nombreImagenNueva = imageNueva.name;
        
        imageNueva.mv(rutaCarpeta + nombreImagenNueva ,function (err){
            if(err)
            {
                console.log('el error es:' + err);
                return res.json('La imagen no se pudo mover ')
            }
        });
    
        let url = 'http://localhost:4000/imageProducts/' + nombreImagenNueva;
        //Eliminado imagen anterior 

        fs.unlinkSync(rutaCarpeta + nameImageActualGuiones, error =>{
            if(error){
                console.log(error);
                return res.json('no se puedo eliminar la imagen anterior')
            }
        });

        req.getConnection((err, conn)=>{
            if(err) return res.send(err)
            
            conn.query(querys.updateImageProduct,[nombreImagenNueva, url, id, idImagen], (err, rows)=>{
                if(err) return res.send(err)
            })
        })

        req.getConnection((err, conn)=>{
            if(err) return res.send(err)
            
            conn.query(querys.updateProduct,[name, description, category, price, id], (err, rows)=>{
                if(err) return res.send(err)
                
                return res.json('se modifico el producto y la imagen')
            })
        })
    }
}



module.exports = productsCtrl
