const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", () => {
  const task = input.value.trim();
  if (task === "") {
    alert("Enter a task!");
    return;
  }

  // Create list item
  const li = document.createElement("li");

  // Inserting the Text and Button
  li.innerHTML = `
    <a class="taskText">${task}</a>
    <span>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </span>
  `;

  // Append to task and recent added to the Top 
  taskList.prepend(li);
  input.value = "";

  // Function Added to Delete the Task
  const deleteBtn = li.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  // Function Added to Edit the Task
  const editBtn = li.querySelector(".editBtn");
  editBtn.addEventListener("click", () => {
    const taskSpan = li.querySelector(".taskText");
    const newTask = prompt("Edit your task", taskSpan.textContent.trim());
    if (newTask) {
      taskSpan.textContent = newTask;
    }
  });


  // Mark as Done Feature Added
  let taskDone = li.querySelector(".taskText");
  taskDone.addEventListener("click", () => {
    const isCompleted = taskDone.dataset.completed === "true";
    taskDone.style.textDecoration = isCompleted ? "" : "line-through";
    taskDone.style.backgroundColor = isCompleted ? "" : "green";
    taskDone.style.color = isCompleted ? "" : "white";
    taskDone.style.padding = isCompleted ? "" : "0px 12px";

    taskDone.dataset.completed = !isCompleted;
  });
});



