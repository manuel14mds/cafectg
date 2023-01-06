
const formImg = document.getElementById('PimageForm')
formImg.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    console.log('entra evento prod data form')
    if(document.getElementById('formFileSm').value==''){
        console.log('el input de imagen está vacio')
        window.location.href = "/products"
    }else{
        console.log('el imput de imagen si trae una imagen')
        const btnSubmit = document.getElementById('btnUpdateImage')
        let form_data = new FormData(formImg)
        fetch(`/api/products/${btnSubmit.value}/image`,{
            method:"PUT",
            body:form_data
        }).then((result)=>{
            if(result.status==401){
                Toastify({
                    text: "unauthorized",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#f55f5f",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }else if(result.status==200){
                window.location.href = "/products"
            }else{
                Toastify({
                    text: "couln't update product",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#f55f5f",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }
        })
    }
})
const formProdData = document.getElementById('PdataForm')
formProdData.addEventListener('submit',(evt)=>{
    console.log('entra evento prod data form')
    evt.preventDefault()
    const btnSubmit = document.getElementById('btnUpdateImage')
    const data = new FormData(formProdData)
    let obj = {}
    data.forEach((value,key)=>obj[key]=value)

    console.log('objeto armado con todos los campos: ', obj)

    let info ={}
    Object.entries(obj).forEach(([key, value]) => {
        if(value.trim()!=''){
            info[key]=value
        }
    })

    console.log('objeto armado con los campos ya validados: ', info)

    if(Object.keys(info).length === 0){
        window.location.href = "/products"
    }else{
        console.log('se hace peticion a: '+`/api/products/${btnSubmit.value}`)
        fetch(`/api/products/${btnSubmit.value}`,{
            method:'PUT',
            body:JSON.stringify(info),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((result)=>{
            console.log('el statusre sultado de la peticion es: '+result.status)
            if(result.status==401){
                Toastify({
                    text: "unauthorized",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#f55f5f",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }else if(result.status==200){
                window.location.href = "/products"
            }else if(result.status==404){
                Toastify({
                    text: "Product not found",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#f55f5f",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }else{
                Toastify({
                    text: "couln't update product",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#f55f5f",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }
        })
    }

})