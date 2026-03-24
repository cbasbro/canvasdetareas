let tasks = JSON.parse(localStorage.getItem('myPlannerData')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    renderTasks();
});

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date-display').innerText = new Date().toLocaleDateString('es-ES', options);
}

function addTask() {
    const name = document.getElementById('taskInput').value;
    const category = document.getElementById('categoryInput').value;
    const date = document.getElementById('dateInput').value;

    if (!name || !date) return alert("Completa nombre y fecha.");

    tasks.push({
        id: Date.now(),
        name: name,
        category: category,
        date: date,
        note: ""
    });

    saveAndRender();
    document.getElementById('taskInput').value = '';
}

function updateNote(id, text) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index].note = text;
        localStorage.setItem('myPlannerData', JSON.stringify(tasks));
    }
}

function renderTasks() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    container.innerHTML = '';

    const sorted = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(t => {
        const dateObj = new Date(t.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="item-date">${formattedDate}</div>
            <div class="item-card">
                <button onclick="deleteTask(${t.id})" class="btn-delete no-print">Eliminar</button>
                <small style="color:var(--accent); font-weight:800; text-transform:uppercase; font-size:0.6rem; letter-spacing:0.5px;">${t.category}</small>
                <h3>${t.name}</h3>
                
                <div class="note-area">
                    ${t.note ? `<div class="note-display">${t.note}</div>` : ''}
                    <textarea class="note-input no-print" placeholder="Añadir/Editar nota..." 
                        onchange="updateNote(${t.id}, this.value)" rows="2">${t.note}</textarea>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function saveAndRender() {
    localStorage.setItem('myPlannerData', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    if(confirm("¿Eliminar tarea?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }
}

function clearAll() {
    if(confirm("¿Borrar todo el canvas?")) { tasks = []; saveAndRender(); }
}

function downloadPDF() {
    const element = document.getElementById('canvas-print');
    const opt = {
        margin: 0,
        filename: 'Hoja_de_Ruta.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            width: 800
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}