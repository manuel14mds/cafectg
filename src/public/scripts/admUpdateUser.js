
const formImg = document.getElementById('UimageForm')
formImg.addEventListener('submit',(evt)=>{
    evt.preventDefault()

    if(document.getElementById('formFileSm').value==''){
        window.location.href = "/users"
    }else{

        const btnSubmit = document.getElementById('btnUpdateImage')
        let form_data = new FormData(formImg)
        fetch(`/api/sessions/user/${btnSubmit.value}/image`,{
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
                window.location.href = "/users"
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

const formUserData = document.getElementById('UdataForm')
formUserData.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    const btnSubmit = document.getElementById('btnUpdateImage')
    const data = new FormData(formUserData)
    let obj = {}
    data.forEach((value,key)=>obj[key]=value)
    let info ={}
    Object.entries(obj).forEach(([key, value]) => {
        if(value.trim()!=''){
            info[key]=value
        }
    })

    if(Object.keys(info).length === 0){
        window.location.href = "/users"
    }else{

        fetch(`/api/sessions/userUpdate/${btnSubmit.value}`,{
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
                window.location.href = "/users"
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