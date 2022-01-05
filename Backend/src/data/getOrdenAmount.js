const querys = require('../database/querys');
const getItemById = require('./getItemById');

module.exports = getOrdenAmount = async items =>{
    let amount = 0
    let respuesta ;
    let intemDB;
    for(i= 0; i< items.length; i++){
        const item = items[i].idObject;
         itemDB = await getItemById(item.id) 
        console.log(itemDB);
    }
    return itemDB
    

}