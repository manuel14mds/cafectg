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
        fetch('/api/sessions/userUpdate',{
            method:'PUT',
            body:JSON.stringify(info),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(()=>window.location.href = "/account")
    }

})