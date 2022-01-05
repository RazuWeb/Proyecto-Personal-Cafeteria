const queries = {
    getAllproducts: 'SELECT  pro.idProducto, pro.nombreProducto, pro.descripcion, pro.categoria, pro.precio, imP.idImagen, imP.nombreImagen, imP.urlImagen FROM productos pro INNER JOIN imageProductos imP ON pro.idProducto  = imP.idProducto',
    addNewProducts: 'INSERT INTO productos (nombreProducto, descripcion, categoria, precio) Values (?, ?, ?, ?)',
    addImageProducts: 'INSERT INTO imageProductos (idProducto, nombreImagen, urlImagen) Values (?, ?, ?)',
    getOnlyOneProduct: 'SELECT  pro.idProducto, pro.nombreProducto, pro.descripcion, pro.categoria, pro.precio, imP.idImagen, imP.nombreImagen, imP.urlImagen FROM productos pro INNER JOIN imageProductos imP ON pro.idProducto  = imP.idProducto Where pro.idProducto = ?',
    deleteProduct: 'Delete from productos where idProducto = ?',
    deleteImageProducto: 'Delete from imageProductos where idProducto = ?',
    updateProduct: 'UPDATE productos SET nombreProducto = ?, descripcion = ?, categoria = ?, precio = ? WHERE idProducto = ?',
    updateImageProduct: 'UPDATE imageProductos SET nombreImagen = ?, urlImagen = ? WHERE idProducto = ? AND idImagen = ?'
}

module.exports = queries