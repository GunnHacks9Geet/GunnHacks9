window.onload = () => {
    document.getElementById("add-task-btn").addEventListener("click", () => {
        let addedTaskName, addedTaskType, startTime, endTime;
        addedTaskName = document.getElementById("taskName").value;
        addedTaskType = document.getElementById("taskType").value;
        if(startTime.value)
        {
            startTime = document.getElementById("startTime").value;
            endTime = document.getElementById("endTime").value;
        }
        let addedTaskData = [addedTaskName, addedTaskType, startTime, endTime];
        //localStorage.setItem("addedTaskData", JSON.stringify(addedTaskData)); //We should have an array of task types in local storage
        //if any of them have start/ending times, then we should add
        //JSON.stringify turns it into a string; in the reverse direction, we use parse.
        //i.e. JSON.parse(localStorage.getItem(...))
        document.location.href = "./tasks.html";
    });
}