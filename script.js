document.addEventListener('DOMContentLoaded', function () {
    
    // --- 1. Sidebar Navigation Logic ---
    const navItems = document.querySelectorAll('.sidebar ul li');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            // Remove active class from all tabs
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all views
            viewSections.forEach(section => section.classList.remove('active'));
            
            // Show target view
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 2. Employee JSON Data ---
    const employeeData = [
        { "employeeId": "E001", "name": "Rahul Sharma", "exitDate": "2026-06-05", "department": "Finance", "access": ["Azure AD: Finance_Group", "Database: Finance_Read", "VPN Access"] },
        { "employeeId": "E002", "name": "Anjali Reddy", "exitDate": "2026-06-15", "department": "IT", "access": ["Dev_Group", "CRM_User", "App Service Access"] },
        { "employeeId": "E003", "name": "Suresh Kumar", "exitDate": "2026-06-12", "department": "HR", "access": ["HR Portal", "Payroll System", "Employee DB"] },
        { "employeeId": "E004", "name": "Priya Nair", "exitDate": "2026-06-08", "department": "Operations", "access": ["Ops Dashboard", "Inventory System", "Vendor Portal"] },
        { "employeeId": "E005", "name": "Vikram Singh", "exitDate": "2026-06-25", "department": "Engineering", "access": ["GitHub Repo", "Azure Subscription", "CI/CD Pipeline"] },
        { "employeeId": "E006", "name": "Meera Joshi", "exitDate": "2026-06-03", "department": "Legal", "access": ["Contract Management", "Legal SharePoint", "Document Archive"] },
        { "employeeId": "E007", "name": "Arjun Patel", "exitDate": "2026-06-18", "department": "Sales", "access": ["Salesforce", "Lead Dashboard", "Customer Pricing Tool"] },
        { "employeeId": "E008", "name": "Neha Kapoor", "exitDate": "2026-06-01", "department": "Marketing", "access": ["Campaign Manager", "Brand Assets Library", "Analytics Portal"] },
        { "employeeId": "E009", "name": "Kiran Rao", "exitDate": "2026-06-10", "department": "Procurement", "access": ["Supplier Portal", "Purchase Approval App", "Spend Dashboard"] },
        { "employeeId": "E010", "name": "Divya Menon", "exitDate": "2026-06-30", "department": "Customer Support", "access": ["Ticketing System", "Knowledge Base", "Teams Support Channel"] }
    ];

    // --- 3. Update KPI Cards ---
    document.getElementById('total-leavers').textContent = employeeData.length;
    
    let totalAccesses = 0;
    employeeData.forEach(emp => totalAccesses += emp.access.length);
    document.getElementById('total-accesses').textContent = totalAccesses;

    // --- 4. Draw Charts ---
    // Pie Chart
    const deptCounts = {};
    employeeData.forEach(emp => {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });

    const pieCtx = document.getElementById('departmentPieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                data: Object.values(deptCounts),
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6f42c1', '#17a2b8', '#fd7e14', '#e83e8c', '#20c997', '#6c757d', '#343a40']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'right' } } }
    });

    // Bar Chart
    const barCtx = document.getElementById('accessCountChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: employeeData.map(e => e.name.split(' ')[0]), // Just first name
            datasets: [{
                label: 'Number of Systems Accessed',
                data: employeeData.map(e => e.access.length),
                backgroundColor: '#007bff'
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, suggestedMax: 5 } } }
    });

    // --- 5. Populate Table ---
    const tableBody = document.getElementById('employee-table-body');
    employeeData.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.employeeId}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.exitDate}</td>
            <td>
                <button class="view-btn" data-index="${index}">View Access</button>
                <button class="remove-btn" onclick="alert('POC Notification: Remove access functionality for ${emp.name} will be implemented in a later phase.')">Remove Access</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // --- 6. Modal Popup Logic ---
    const modal = document.getElementById('accessModal');
    const closeBtn = document.querySelector('.close-btn');
    const modalName = document.getElementById('modalEmployeeName');
    const modalAccessList = document.getElementById('modalAccessList');

    // Open Modal
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Check if this is the "Sync Now" or "Export" button from the Employees tab
            if (!this.hasAttribute('data-index')) return; 

            const empIndex = this.getAttribute('data-index');
            const employee = employeeData[empIndex];
            
            modalName.textContent = `Access Details: ${employee.name}`;
            modalAccessList.innerHTML = ''; 
            
            employee.access.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                modalAccessList.appendChild(li);
            });

            modal.style.display = 'flex';
        });
    });

    // Close Modal via 'X'
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    
    // Close Modal via clicking outside the white box
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});