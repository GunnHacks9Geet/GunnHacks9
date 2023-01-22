

/*function transitionToPage(url)
{
    //TODO for AG: save current data somewhere before transitioning?
    document.location.href = url;
}*/


window.onload = () => {
    document.getElementById("account").addEventListener("click", () => {
      //save current data,
      document.location.href = "/account.html";
    });
    document.getElementById("add").addEventListener("click", () => {
      //TODO: save current data
      document.location.href = "/add-task.html";
    });
    document.getElementById("settings").addEventListener("click", () => {
      document.location.href = "/settings.html";
    });
    // Retrieve the assignments from cookies
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('assignmentList');
    let assignments = JSON.parse(myParam)
    console.log(assignments)
    // Sort the assignments by due date
    assignments.sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    // Initialize the schedule and current time
    let schedule = {
      "2022-10-01": [],
      "2022-10-02": [],
      "2022-10-03": []
    };
    let currentTime = "16:30";
    // Allocate time for each assignment
    for (let i = 0; i < assignments.length; i++) {
      let assignment = assignments[i];
      let dueDate = assignment.dueDate;
      let estimatedTime = assignment.estimatedTime;
  
      // Calculate the end time for the assignment
      let endTime = new Date("1970-01-01 " + currentTime);
      endTime.setMinutes(endTime.getMinutes() + estimatedTime * 60);
  
      // Check if the end time is before 12:00am
      if (endTime.getHours() < 24) {
        // Allocate time for the assignment
        schedule[dueDate].push({
          name: assignment.name,
          startTime: currentTime,
          endTime: endTime.toTimeString().slice(0, 5)
        });
  
        // Update the current time
        currentTime = endTime.toTimeString().slice(0, 5);
      } else {
        // Move on to the next day and reset the current time
        currentTime = "16:30";
        i--;
      }
    }
    // Add the tasks to the table
    let table = document.querySelector(".tasks");
    for (let date in schedule) {
      for (let task of schedule[date]) {
        let row = document.createElement("tr");
        let startTime = document.createElement("td");
        startTime.innerHTML = task.startTime + " - " + task.endTime;
        let taskName = document.createElement("td");
        taskName.innerHTML = task.name;
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        row.appendChild(checkbox);
        row.appendChild(startTime);
        row.appendChild(taskName);
        table.appendChild(row);
      }
    }
    // Add event listeners for the buttons
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
  
  