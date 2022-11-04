
let btnList = document.querySelectorAll('.addToCart')
btnList.forEach((btn) => {
    btn.addEventListener('click',(evt)=>{
        evt.preventDefault()
        const data = {pid:`${btn.value}`, quantity:1}
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
            }
        })

    })
});