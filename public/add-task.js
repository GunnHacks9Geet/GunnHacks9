window.onload = () => {
    document.getElementById("add-task-btn").addEventListener("click", () => {
        let addedTaskName, addedTaskType, startTime, endTime;
        addedTaskName = document.getElementById("taskName").value;
        addedTaskType = document.getElementById("taskType").value;
        //TODO: load the html content from account.js into the DROPDOWN MENU here.
        if(startTime.value)
        {
            startTime = document.getElementById("startTime").value;
            endTime = document.getElementById("endTime").value;
        }
        let addedTaskData = [addedTaskName, addedTaskType, startTime, endTime];
        document.location.href = "./tasks.html";

        //this means that this code has to set the data to the previous data with a semicolon and a new array
        //which means we have to ORIGINALLY initialize the array to something, maybe an empty string.
        localStorage.setItem("taskData", localStorage.getItem("taskData") + ";" + addedTaskData);
        //when parsing through it, we need to make it into an array then SORT the array based on time
    });
}