window.onload = () => {
    //onload, we need to load all the tasks from localStorage
    let fullTaskData = localStorage.get("taskData");
    let arrays = fullTaskData.split(";"); //this is the 2d array --> array of arrays

    let fixedTimeTasks = [arrays.length];
    let fixedTimeTaskLength = 0; //independent counter that will keep track of what portion of the array is being used.

    let flexibleTimeTasks = [arrays.length];
    let flexibleTimeTaskLength = 0;

    let i = 0;
    while(i < arrays.length)
    {
        if(arrays[i][2]) //if the array entries have start times/end times --> meaning that it is fixed.
        {
            fixedTimeTasks[fixedTimeTaskLength] = arrays[i];
            fixedTimeTaskLength++;
        } else {
            flexibleTimeTasks[flexibleTimeTaskLength] = arrays[i];
            flexibleTimeTaskLength++;
        }
    }
    //the above block adds all the fixed arrays into a fixedTask array, all the flexible arrays into a flexibleTask arrays.

    //below are both high priority
    //TODO: insert the fixed arrays into the table --> doesnt need to be sorted
    //TODO: O(n^2) --> for each task, iterate through the existing table to add it into the table

    document.getElementById("account").addEventListener("click", () => {
        document.location.href = "./account.html";
    });
    document.getElementById("add").addEventListener("click", () => {
        document.location.href = "./add-task.html";
    });
    document.getElementById("settings").addEventListener("click", () => {
        document.location.href = "./settings.html";
    });
} 
