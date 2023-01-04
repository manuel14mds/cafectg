const formImg = document.getElementById('profileForm')
formImg.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let form_data = new FormData(formImg)
    const btnSubmit = document.getElementById('btnUpdateImage')
    fetch(`/api/sessions/user/${btnSubmit.value}/image`,{
        method:"PUT",
        body:form_data
    }).then(()=>window.location.href = "/account")
})




const form = document.getElementById('updateUserForm')
form.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    const data = new FormData(form)
    let obj = {}
    data.forEach((value,key)=>obj[key]=value)
    if(obj.code.trim() == '' || obj.tel.trim() ==''){
        delete obj.code
        delete obj.tel
    }else{
        obj.phone = `+${obj.code}${obj.tel}`
        delete obj.code
        delete obj.tel
    }
    let info ={}
    Object.entries(obj).forEach(([key, value]) => {
        if(value.trim()!=''){
            info[key]=value
        }
    })

    if(Object.keys(info).length === 0){
        window.location.href = "/account"
    }else{
        const btnSubmit = document.getElementById('btnUpdateImage')
        fetch(`api/sessions/userUpdate/${btnSubmit.value}`,{
            method:'PUT',
            body:JSON.stringify(info),
            headers:{
                "Content-Type":"application/json"
            }
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
                window.location.href = "/account"
            }else if(result.status==404){
                Toastify({
                    text: "User not found",
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
                    text: "couln't update User",
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