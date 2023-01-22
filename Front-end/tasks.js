window.onload = () => {
    document.getElementById("account").addEventListener("click", () => {
        //save current data,
        document.location.href = "./account.html";
    });
    document.getElementById("add").addEventListener("click", () => {
        //TODO: save current data
        document.location.href = "./add-task.html";
    });
    document.getElementById("settings").addEventListener("click", () => {
        document.location.href = "./settings.html";
    });
}

/*function transitionToPage(url)
{
    //TODO for AG: save current data somewhere before transitioning?
    document.location.href = url;
}*/