const form = document.getElementById('loginForm')
form.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/sessions/loginadmin',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then((result)=>{
        console.log(result.status)
        if(result.status==400){
            Toastify({
                text: "Invalid Credentials",
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
            window.location.href = "/"
        }else if(result.status==500){
            Toastify({
                text: "Couldn't login",
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
