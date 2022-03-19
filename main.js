const btn = document.querySelector(".btnInput");
const textArea = document.querySelector("#taskText");
const taskContainer = document.querySelector(".todoList__task-container");

window.addEventListener("load", () => {
  // validar la entrada del texto
  validateTask = () => {
    let newText = textArea.value;
    if (newText < 1) {
      alert("Primero debe introducir una tarea");
    } else {
      addNewTask(newText);
    }
  };

  // sincronizamos las tareas nuevas o eliminadas al local storage
  sincronizationTasksLS = (newTask) => {
    let [...temp] = newTask.childNodes;
    let temp1 = [];
    for (let i = 1; i < temp.length; i++) {
      temp1.push(temp[i].outerHTML);
    }
    return localStorage.setItem("tasks", temp1);
  };

  // agregar el texto dentro del html y validar si se repite
  addNewTask = (newText) => {
    // vamos a crear el elemento "li"
    const task_li = document.createElement("li");
    task_li.classList.add("typeList");

    const task_el = document.createElement("div");
    task_el.classList.add("todoList__task");
    task_li.appendChild(task_el);

    // checkbox
    const checkContainer = document.createElement("div");
    checkContainer.classList.add("todoList__checkContainer");
    task_el.appendChild(checkContainer);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("todoList__checkbox");
    checkContainer.appendChild(checkBox);

    // para que el text area me devolviera el value en el outerHTML
    // tuve que setear el innerText como el: el.innerText = el.value
    const task_text = document.createElement("textarea");
    task_text.innerText = newText;
    task_text.classList.add("taskContent", "contentEditable");
    task_el.appendChild(task_text);

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btnContainer");
    task_el.appendChild(btnContainer);

    const removeBtn = document.createElement("button");
    removeBtn.type = "submit";
    removeBtn.innerText = "Delete";
    removeBtn.classList.add("btn", "removeBtn");
    btnContainer.append(removeBtn);

    const editBtn = document.createElement("button");
    editBtn.type = "submit";
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    btnContainer.append(editBtn);
    taskContainer.appendChild(task_li);
    textArea.value = "";

    sincronizationTasksLS(taskContainer);

    editBtn.addEventListener("click", () => {
      if (editBtn.innerText == "Edit" && checkBox.checked === false) {
        task_text.classList.toggle("contentEditable", false);
        task_text.focus();
        editBtn.innerText = "Save";
      } else {
        if (task_text.value == "") {
          alert("No podés dejar una tarea vacía");
          task_text.focus();
        } else {
          task_text.innerText = task_text.value;
          sincronizationTasksLS(taskContainer);
          task_text.classList.add("contentEditable");
          editBtn.innerText = "Edit";
        }
      }
    });
    removeBtn.addEventListener("click", () => {
      taskContainer.removeChild(task_li);
      sincronizationTasksLS(taskContainer);
    });

    checkBox.addEventListener("change", () => {
      if (checkBox.checked) {
        task_text.classList.add("contentEditable", "lineThrough");
      } else {
        task_text.classList.remove("contentEditable", "lineThrough");
      }
    });
  };

  btn.addEventListener("click", validateTask);
  let oldTasks = localStorage.getItem("tasks");
  if (oldTasks != "") {
    let oldTasksArray = oldTasks.split(",");
    oldTasksArray.map((item) => {
      let fragment = document.createRange().createContextualFragment(item);
      let text = fragment.childNodes[0].childNodes[0].childNodes[1].innerText;
      addNewTask(text);
    });
  }
});
