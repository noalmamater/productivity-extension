let counts = {
    finalizados: 0,
    aprovados: 0,
    reprovados: 0
};

// Load saved values from Chrome storage
chrome.storage.sync.get(['finalizados', 'aprovados', 'reprovados'], (result) => {
    counts.finalizados = result.finalizados || 0;
    counts.aprovados = result.aprovados || 0;
    counts.reprovados = result.reprovados || 0;
    updateUI();
});

// Function to update the UI with current counts
function updateUI() {
    document.getElementById('finalizados-count').innerText = counts.finalizados;
    document.getElementById('aprovados-count').innerText = counts.aprovados;
    document.getElementById('reprovados-count').innerText = counts.reprovados;

    const aprovadosPercent = counts.finalizados ? (counts.aprovados / counts.finalizados) * 100 : 0;
    const reprovadosPercent = counts.finalizados ? (counts.reprovados / counts.finalizados) * 100 : 0;

    document.getElementById('aprovados-percent').innerText = `${aprovadosPercent.toFixed(2)}%`;
    document.getElementById('reprovados-percent').innerText = `${reprovadosPercent.toFixed(2)}%`;
}

// Function to change the counter
function changeCount(type, value) {
    counts[type] += value;
    if (counts[type] < 0) counts[type] = 0;

    // Save updated values to Chrome storage
    chrome.storage.sync.set({
        finalizados: counts.finalizados,
        aprovados: counts.aprovados,
        reprovados: counts.reprovados
    });

    updateUI();
}

// Attach event listeners to buttons for counters
document.getElementById('finalizados-increase').addEventListener('click', () => changeCount('finalizados', 1));
document.getElementById('finalizados-decrease').addEventListener('click', () => changeCount('finalizados', -1));

document.getElementById('aprovados-increase').addEventListener('click', () => changeCount('aprovados', 1));
document.getElementById('aprovados-decrease').addEventListener('click', () => changeCount('aprovados', -1));

document.getElementById('reprovados-increase').addEventListener('click', () => changeCount('reprovados', 1));
document.getElementById('reprovados-decrease').addEventListener('click', () => changeCount('reprovados', -1));

// Add event listener for the reset button
document.getElementById('reset-counters').addEventListener('click', resetCounters);

function resetCounters() {
    counts.finalizados = 0;
    counts.aprovados = 0;
    counts.reprovados = 0;

    // Save reset values to Chrome storage
    chrome.storage.sync.set({
        finalizados: 0,
        aprovados: 0,
        reprovados: 0
    });

    updateUI();
}

// Tab switching logic
document.getElementById('tab-counters').addEventListener('click', () => {
    switchTab('counters-content', 'tab-counters');
});
document.getElementById('tab-time-calculator').addEventListener('click', () => {
    switchTab('time-calculator-content', 'tab-time-calculator');
});

function switchTab(contentId, tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(contentId).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Function to calculate time difference
document.getElementById('calculate-time').addEventListener('click', () => {
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        let diffMs = end - start; // Difference in milliseconds

        // Handle if the end time is earlier than the start time (crossing midnight)
        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
        }

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('time-result').innerText = `Time Difference: ${diffHours} hours and ${diffMinutes} minutes`;
    } else {
        document.getElementById('time-result').innerText = 'Please enter both start and end times.';
    }
});

