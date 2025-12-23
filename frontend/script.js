const API_URL = "http://localhost:5000/tasks";

const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

function fetchTasks() {
  loadingText.style.display = "block";
  errorText.textContent = "";

  fetch(API_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return res.json();
    })
    .then(tasks => {
      taskList.innerHTML = "";
      loadingText.style.display = "none";

      tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
          <div>
            <strong>${task.title}</strong><br/>
            <small>${task.description}</small><br/>
            <small>Status: ${task.status}</small>
          </div>
          <button onclick="updateStatus(${task.id})">Next</button>
        `;

        taskList.appendChild(div);
      });
    })
    .catch(err => {
      loadingText.style.display = "none";
      errorText.textContent = err.message;
    });
}


addTaskBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (!title) {
    alert("Title is required");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      fetchTasks();
    });
});

function updateStatus(id) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT"
  })
    .then(res => res.json())
    .then(() => fetchTasks());
}

fetchTasks();
