document.addEventListener('DOMContentLoaded', ()=>{
    const saveBtn = document.getElementById('save')
    const application = document.getElementById('applicationID')
    const name = document.getElementById('name')
    const date = document.getElementById('date')
    const desc = document.getElementById('desc')

    saveBtn.addEventListener('click', async(e)=>{
        e.preventDefault()
        let send = window.checkReq()
        if(send){
            saveBtn.setAttribute("disabled", "disabled")
            let data = {
                application: application.value,
                name: name.value,
                date: date.value,
                desc: desc.value
            }
            let response = await fetch("/admin/schedule/create",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            let res = await response.json()
            if(res.status){
                setTimeout(() => {
                    window.location.href = "/personal/schedule"
                }, 500)
            }else{
                saveBtn.removeAttribute("disabled")
                window.AlertMsg(res.msg)
            }
        }
    })
})