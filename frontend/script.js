// ✅ LIVE BACKEND URL (Render)
const API_URL = "https://task-manager-backend.onrender.com/tasks";

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

      if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks available</p>";
        return;
      }

      tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
          <div>
            <strong>${task.title}</strong><br/>
            <small>${task.description || ""}</small><br/>
            <small>Status: ${task.status}</small>
          </div>
          <button onclick="updateStatus(${task.id})">Next</button>
        `;

        taskList.appendChild(div);
      });
    })
    .catch(err => {
      loadingText.style.display = "none";
      errorText.textContent = "Backend not reachable. Please try again later.";
      console.error(err);
    });
}

addTaskBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

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
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to add task");
      }
      return res.json();
    })
    .then(() => {
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      fetchTasks();
    })
    .catch(err => {
      errorText.textContent = "Failed to add task";
      console.error(err);
    });
});

function updateStatus(id) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      return res.json();
    })
    .then(() => fetchTasks())
    .catch(err => {
      errorText.textContent = "Failed to update task status";
      console.error(err);
    });
}

// Initial load
fetchTasks();
