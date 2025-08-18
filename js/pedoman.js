document.addEventListener('DOMContentLoaded', function() {
    // Main tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Policy tab functionality
    const policyTabs = document.querySelectorAll('.policy-tab');
    const policyPanes = document.querySelectorAll('.policy-pane');

    policyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            policyTabs.forEach(t => t.classList.remove('active'));
            policyPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const policyId = tab.getAttribute('data-policy');
            document.getElementById(policyId).classList.add('active');
        });
    });

    // Instrumen tab functionality
    const instrumenTabs = document.querySelectorAll('.instrumen-tab');
    const instrumenPanes = document.querySelectorAll('.instrumen-pane');

    instrumenTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            instrumenTabs.forEach(t => t.classList.remove('active'));
            instrumenPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const instrumenId = tab.getAttribute('data-instrumen');
            document.getElementById(instrumenId).classList.add('active');
        });
    });

    // Initialize calendar
    initializeCalendar();
});

function initializeCalendar() {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthEl = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    // Sample events data
    const events = {
        "2023-8-15": "Pembinaan Dinas Kesehatan",
        "2023-8-22": "Pembinaan Dinas Pendidikan",
        "2023-8-29": "Evaluasi Triwulan"
    };
    
    function renderCalendar() {
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set current month and year
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Create day headers
        for (let i = 0; i < 7; i++) {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = dayNames[i].substring(0, 3);
            calendarGrid.appendChild(dayHeader);
        }
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Check if there's an event on this day
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            if (events[dateKey]) {
                const event = document.createElement('div');
                event.className = 'calendar-event';
                event.textContent = events[dateKey];
                dayCell.appendChild(event);
            }
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Event listeners for month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Initial render
    renderCalendar();
}