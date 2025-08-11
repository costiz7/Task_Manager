document.getElementById('task-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const inTitle = document.getElementById('title');
    const inDescription = document.getElementById('description');
    const inDeadline = document.getElementById('deadline');

    const title = inTitle.value.trim();
    const description = inDescription.value.trim();
    const deadline = inDeadline.value;

    if (!title) {
        alert('Scrieti un titlu pentru task!');
        return;
    }

    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline })
    });

    if (response.ok) {
        const updatedList = await fetch('http://localhost:3000/tasks');
        const tasks = await updatedList.json();
        document.getElementById('tasks').innerHTML = '';
        tasks.forEach(adaugaTaskInDOM);
    }

    this.reset();
});

document.getElementById('tasks').addEventListener('click', async function (e) {
    const taskWrapper = e.target.closest('.task-item');
    const taskId = taskWrapper?.dataset.id;

    if (e.target.classList.contains('delete-btn')) {
        await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'DELETE'
        });
        taskWrapper.remove();
        return;
    }

    const li = e.target.closest('li');
    if (li && taskId) {
        const completed = li.classList.contains('completed') ? 0 : 1;

        await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        li.classList.toggle('completed');
    }
});

function adaugaTaskInDOM(task) {
    const taskWrapper = document.createElement('div');
    taskWrapper.className = 'task-item';
    taskWrapper.dataset.id = task.ID;

    const li = document.createElement('li');
    li.innerHTML = `<strong>${task.TITLE}</strong>
                    ${task.DESCRIPTION ? `<p>${task.DESCRIPTION}</p>` : ''}
                    <small>Deadline: ${task.DEADLINE ? task.DEADLINE.substring(0, 10) : 'nu este setat'}</small>`;

    if (task.COMPLETED === 1) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✖';

    taskWrapper.appendChild(li);
    taskWrapper.appendChild(deleteBtn);
    document.getElementById('tasks').appendChild(taskWrapper);
}

//incarcare in pagina din API
window.addEventListener('load', async function () {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();

    tasks.forEach(task => {
        adaugaTaskInDOM(task);
    });
});

document.getElementById('filter-all').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    document.getElementById('tasks').innerHTML = '';
    tasks.forEach(adaugaTaskInDOM);
});

document.getElementById('filter-completed').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    const completed = tasks.filter(t => t.COMPLETED === 1);
    document.getElementById('tasks').innerHTML = '';
    completed.forEach(adaugaTaskInDOM);
});

document.getElementById('filter-active').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    const active = tasks.filter(t => t.COMPLETED === 0);
    document.getElementById('tasks').innerHTML = '';
    active.forEach(adaugaTaskInDOM);
});