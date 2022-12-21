let btnDeleteAll = document.getElementById('deleteAllProducts')
btnDeleteAll.addEventListener('click',(event)=>{
    event.preventDefault()
    console.log(btnDeleteAll.value)
    fetch(`/api/carts/emptyCart/${btnDeleteAll.value}`,{
        method:'DELETE'
    }).then((result)=>{
        if(result.status==200){
            console.log('la respuesta es de un 200 ok')
            window.location.href = "/cart"
        }else {
            Toastify({
                text: "It couldn't delete",
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
})
let btnShop = document.getElementById('shopBtn')
btnShop.addEventListener('click',(event)=>{
    event.preventDefault
    fetch(`/api/purchases/${btnShop.value}`,{
        method:'POST',
        body:JSON.stringify({}),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(result => result.json())
    .then(data => {
        let purchaseId = data.payload.id
        window.location.href = `/resume/purchase/${purchaseId}`
    })
    .catch(function(error){
        Toastify({
            text: "purchase error",
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
    })
})