document.addEventListener("DOMContentLoaded", ()=>{
    let applicationID = document.getElementById("applicationID").value

    document.getElementById("cancelBtn").addEventListener("click", async(e)=>{
        document.getElementById("cancelBtn").setAttribute("disabled", "disabled")
        e.preventDefault()
        let body = {
            id: applicationID,
            status: "canceled"
        }
        let response = await fetch(`/admin/applications/${applicationID}/status`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        let res = await response.json()
        if(res.status === "success"){
            window.location.reload()
        }else{
            window.AlertMsg(res.msg)
            document.getElementById("cancelBtn").removeAttribute("disabled")
        }
    })
})