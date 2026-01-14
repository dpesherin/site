window.AlertMsg = (msg) => {
    let alert = document.createElement("div");
    alert.classList.add("alert");
    let span = document.createElement("span");
    span.classList.add("alert-msg");
    span.innerText = msg;
    alert.append(span);
    document.querySelector("body").append(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
};

window.checkReq = () => {
    let list = document.querySelectorAll(".req");
    let send = true;
    list.forEach((item) => {
        if (!item.value) {
            send = false;
            item.classList.add("wrong");
        }
    });
    return send;
};
window.getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const markActiveLink = ()=>{
    let cand = document.querySelector(`a.menu-item-link[href="${window.location.pathname}"]`)
    if(cand){
        cand.classList.add("active")
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    markActiveLink()
})