///////////////////////////////////OBTENER TODOS LOS PRODUCTOS/////////////////////////////////////////
const table = document.querySelector('.tableProducts'),
template = document.getElementById('templateProducts').content,
fragment = document.createDocumentFragment();

const getAll = async ()=>{
    
    try {
        let res = await axios.get('http://localhost:4000/products'),
        json = await res.data
        console.log(json);

        json.forEach(el =>{
            template.querySelector(".id").textContent = el.idProducto
            template.querySelector(".nombre").textContent = el.nombreProducto
            template.querySelector(".descripcion").textContent = el.descripcion
            template.querySelector(".categoria").textContent = el.categoria
            template.querySelector(".precio").textContent = el.precio
            template.querySelector(".imgProduct").src = el.urlImagen
            template.querySelector(".btnEditar").dataset.idProducto = el.idProducto
            template.querySelector(".btnEditar").dataset.nombre = el.nombreProducto
            template.querySelector(".btnEditar").dataset.descripcion = el.descripcion
            template.querySelector(".btnEditar").dataset.categoria = el.categoria
            template.querySelector(".btnEditar").dataset.precio = el.precio
            template.querySelector(".btnEditar").dataset.idImagen = el.idImagen
            template.querySelector(".btnEditar").dataset.nombreImagenActual = el.nombreImagen
            template.querySelector(".btnEditar").dataset.srcImagen = el.urlImagen
            template.querySelector(".btnEliminar").dataset.idProducto  = el.idProducto

            let clone = document.importNode(template, true);
            fragment.appendChild(clone);
        })

        table.querySelector("tbody").appendChild(fragment);


    } catch (error) {

        console.log(error);
        let message = error.statusText || "ocurrio un error" 
        table.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`)
    }
}


const btnMenu = document.querySelector('.imgBtnMenu');
const navbarMenu =document.querySelector('.containerNavbar');

btnMenu.addEventListener('click',(e)=>{
    navbarMenu.classList.toggle('activar');
});


////////////////////////////////////////// AGREGAR PRODUCTOS //////////////////////////////////
const formAgregarProducto = document.querySelector('#formAgregarProducto');

const btnAgregar = document.querySelector('#btnAgregar')

btnAgregar.addEventListener('click', async (e)=>{
    e.preventDefault()
    let dataProducto = new FormData(formAgregarProducto)
    dataProducto.delete('id')

    if(dataProducto.get('name') == '' || dataProducto.get('descripcion') == '' || dataProducto.get('category') == '' || dataProducto.get('price') == '' ) 
    {
        alertify.error('Llene todo los campos');
        return
    }

    


    if(formAgregarProducto.id.value == ''){
        //CREATE - POST
        
        console.log(dataProducto.get('agregarImagen'));
        if(!dataProducto.get('agregarImagen').size == 0)
        {
            const tipoImagenValidas = ["image/jpeg","image/jpg", "image/png", "application/octet-stream"];
            if(tipoImagenValidas.indexOf(dataProducto.get('agregarImagen').type) == -1){
                alertify.error('Solo admitimos formatos jgep/jpg/png/octet-stream');
                return
            }
            
        }
        else{
            alertify.error('Selecciona una imagen');
            return
        }


        try {
            let res = await axios.post('http://localhost:4000/createProducts', dataProducto)
            let json = await res.data;
            console.log(json);
            
       

        } catch (err) {
            //console.log(err);
            let message = err.statusText || "ocurrio un error"
            formAgregarProducto.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }
    }
    else{
///////////////////////////////////////////////MODIFICAR PRODUCTO///////////////////////////////////////////////////
////////UPDATE - PUT
        try {

            


            imagenUpdate = dataProducto.get('agregarImagen')
            if(imagenUpdate.size == 0){
                dataProducto.append('editImagen','no')
                
            }
            else{
                dataProducto.append('editImagen','si')
               
            }
           
            let res = await axios.put(`http://localhost:4000/UpdateProducts/ ${formAgregarProducto.id.value}` , dataProducto)
            json = await res.data;
            console.log(json);
            location.reload()
         } catch (err) {
             //console.log(err);
             let message = err.statusText || "ocurrio un error"
             formAgregarProducto.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
         }

    }
})




/////////////////////////////////////////////////////////Modal ////////////////////////////////////////
let cerrar = document.querySelectorAll(".close")[0];
let abrir = document.querySelectorAll("#btnAgregarProducto")[0]
let modal = document.querySelectorAll(".modalPersonal")[0];
let modalC = document.querySelectorAll("#modalContainer")[0];
let btnSalir = document.querySelector('#btnSalir');
let cerrarPreviewImage = document.querySelector('#btnCerrarPreviewImage');

let containerPreviewImagen = document.querySelector('#containerPreviewImage');
let btnPreviewImage = document.querySelector('#btnPreviewImage')


/* abrir.addEventListener('click', function(e){
    e.preventDefault();
    modalC.style.opacity = "1";
    modalC.style.visibility = "visible";
    modal.classList.toggle("modalPersonalClose")
}); */

function abrirModal(){
    modalC.style.opacity = "1";
    modalC.style.visibility = "visible";
    modal.classList.toggle("modalPersonalClose")
}

cerrar.addEventListener('click', cerrarModal)

btnSalir.addEventListener('click', cerrarModal)

/////////////////////////////////////////////PREVIZUALIZAR IMAGEN//////////////////////////////////////////////
const inputImagen = document.querySelector('#agregarImagen');

inputImagen.addEventListener('change', function(){
    const imagenPreview = document.querySelector('#containerPreviewImage .body img')

    const imagenTempUrl = URL.createObjectURL(inputImagen.files[0])
    console.log(imagenTempUrl); 
    imagenPreview.src = imagenTempUrl
})

btnPreviewImage.addEventListener('click',function(){
    containerPreviewImagen.classList.toggle("PreviewImageClose") 
    
})

cerrarPreviewImage.addEventListener('click',function(){
    containerPreviewImagen.classList.add("PreviewImageClose") 
});




function cerrarModal(){
    modal.classList.toggle("modalPersonalClose");
    formAgregarProducto.reset()
    let categorias = formAgregarProducto.category
    categorias.selectedIndex = 0;
    const imagenPreview = document.querySelector('#containerPreviewImage .body img')
    imagenPreview.src = ''
    setTimeout(function(){
        modalC.style.opacity ="0";
        modalC.style.visibility ="hidden";
    },900)
}


/////////////////////////////////////////////EVENTOS CLICK//////////////////////////////////////////////
document.addEventListener("click", async e=>{
    if(e.target.matches(".btnEditar")){
        abrirModal();
        const imagenPreview = document.querySelector('#containerPreviewImage .body img')
        imagenPreview.src = e.target.dataset.srcImagen
        formAgregarProducto.id.value = e.target.dataset.idProducto
        formAgregarProducto.idImagen.value = e.target.dataset.idImagen
        formAgregarProducto.name.value = e.target.dataset.nombre
        formAgregarProducto.description.value = e.target.dataset.descripcion
        formAgregarProducto.nombreImagenActual.value = e.target.dataset.nombreImagenActual
        const optionsLength = formAgregarProducto.category.options.length;
        for(let i = 0; i < optionsLength; i++)
        {
            
            if(formAgregarProducto.category.options[i].value == e.target.dataset.categoria)
            {
                formAgregarProducto.category.options[i].setAttribute('selected',true);
            } 
        }
        formAgregarProducto.price.value = e.target.dataset.precio
    }
    if(e.target.matches(".btnEliminar")){
///////////////////////////////////////////////// ELIMINAR PRODUCTOS /////////7/////////////////////////////////
        //let isDelete = confirm(`Estas seguro de eliminar el producto con el id: ${e.target.dataset.idProducto}?`);
        
        //alertify.confirm('Eliminar', 'Desea Eliminar El producto?', function(){ console.log('eliminado'); });
        alertify.confirm('Eliminar Producto', `Estas seguro de eliminar el producto con el id: ${e.target.dataset.idProducto}?`, 
        async function(){  
            try {

                let res = await axios.delete(`http://localhost:4000/products/${e.target.dataset.idProducto}`)
                json = await res.data;
                location.reload();
            } catch (err) {
                let message = err.statusText || "ocurrio un error"
                alert(`${err.status}: ${message}`)
            }   
        }
        , function(){ console.log('no elminado');});
        return
    }
    if(e.target.matches("#btnAgregarProducto")){
    
        //formAgregarProducto.category.options[0].setAttribute('selected',true);
        abrirModal();
    }

})



document.addEventListener("DOMContentLoaded", getAll);