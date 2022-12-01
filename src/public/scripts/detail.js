let btnAdd = document.getElementById('addToCard')
btnAdd.addEventListener('click',(event)=>{
    event.preventDefault()
    const data = {pid:`${btnAdd.value}`, quantity:1}
    fetch(`/api/carts/addToCart`,{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"application/json"
        }
    }).then((result)=>{
        if(result.status==401){
            Toastify({
                text: "login first",
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
            Toastify({
                text: "product added to cart",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
        }else{
            console.log('algo salio mal')
        }
    })
})