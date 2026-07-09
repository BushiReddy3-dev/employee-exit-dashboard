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
    { "employeeId": "E001", "name": "Rahul Sharma", "exitDate": "2026-06-05", "department": "Finance", "access": ["Azure AD [Level: Admin]", "Finance DB [Level: Read-Only]", "VPN Access [Level: Standard]"] },
    { "employeeId": "E002", "name": "Anjali Reddy", "exitDate": "2026-06-15", "department": "IT", "access": ["Dev_Group [Level: Contributor]", "CRM_User [Level: Standard]", "App Service [Level: Owner]"] },
    { "employeeId": "E003", "name": "Suresh Kumar", "exitDate": "2026-06-12", "department": "HR", "access": ["HR Portal [Level: Admin]", "Payroll System [Level: Read/Write]", "Employee DB [Level: Standard]"] },
    { "employeeId": "E004", "name": "Priya Nair", "exitDate": "2026-06-08", "department": "Operations", "access": ["Ops Dashboard [Level: Standard]", "Inventory System [Level: Admin]", "Vendor Portal [Level: Standard]"] },
    { "employeeId": "E005", "name": "Vikram Singh", "exitDate": "2026-06-25", "department": "Engineering", "access": ["GitHub Repo [Level: Owner]", "Azure Subscription [Level: Contributor]", "CI/CD Pipeline [Level: Read-Only]"] },
    { "employeeId": "E006", "name": "Meera Joshi", "exitDate": "2026-06-03", "department": "Legal", "access": ["Contract Mgmt [Level: Admin]", "Legal SharePoint [Level: Read/Write]", "Doc Archive [Level: Read-Only]"] },
    { "employeeId": "E007", "name": "Arjun Patel", "exitDate": "2026-06-18", "department": "Sales", "access": ["Salesforce [Level: Standard]", "Lead Dashboard [Level: Read-Only]", "Pricing Tool [Level: Standard]"] },
    { "employeeId": "E008", "name": "Neha Kapoor", "exitDate": "2026-06-01", "department": "Marketing", "access": ["Campaign Mgr [Level: Admin]", "Brand Assets [Level: Read-Only]", "Analytics Portal [Level: Standard]"] },
    { "employeeId": "E009", "name": "Kiran Rao", "exitDate": "2026-06-10", "department": "Procurement", "access": ["Supplier Portal [Level: Admin]", "Purchase App [Level: Read/Write]", "Spend Dashboard [Level: Read-Only]"] },
    { "employeeId": "E010", "name": "Divya Menon", "exitDate": "2026-06-30", "department": "Customer Support", "access": ["Ticketing System [Level: Standard]", "Knowledge Base [Level: Contributor]", "Teams Channel [Level: Standard]"] }
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
                <!-- Two buttons added, sharing the base view-btn style -->
                <button class="view-btn app-btn" data-index="${index}">Applications</button>
                <button class="view-btn level-btn" data-index="${index}">Level of Access</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

	 // --- 6. Modal Popup Logic ---
    const modal = document.getElementById('accessModal');
    const closeBtn = document.querySelector('.close-btn');
    const modalName = document.getElementById('modalEmployeeName');
    const modalAccessList = document.getElementById('modalAccessList');

    // Logic for the "Applications" Button
    document.querySelectorAll('.app-btn').forEach(button => {
        button.addEventListener('click', function() {
            const empIndex = this.getAttribute('data-index');
            const employee = employeeData[empIndex];
            
            // Set title for Applications
            modalName.textContent = `Applications: ${employee.name}`;
            modalAccessList.innerHTML = ''; 
            
            employee.access.forEach(item => {
                const li = document.createElement('li');
                // Extract just the system name (removes the "[Level: ]" text)
                let systemName = item;
                if (item.includes("[Level: ")) {
                    systemName = item.split("[Level: ")[0].trim();
                }
                
                li.innerHTML = `<strong>${systemName}</strong>`;
                modalAccessList.appendChild(li);
            });
            modal.style.display = 'flex';
        });
    });

    // Logic for the "Level of Access" Button
    document.querySelectorAll('.level-btn').forEach(button => {
        button.addEventListener('click', function() {
            const empIndex = this.getAttribute('data-index');
            const employee = employeeData[empIndex];
            
            // Set title for Access Levels
            modalName.textContent = `Access Levels: ${employee.name}`;
            modalAccessList.innerHTML = ''; 
            
            employee.access.forEach(item => {
                const li = document.createElement('li');
                
                if (item.includes("[Level: ")) {
                    let parts = item.split("[Level: ");
                    let systemName = parts[0].trim();
                    let level = parts[1].replace("]", "").trim();
                    let cssClass = level.toLowerCase().replace(/[^a-z0-9]/g, '');
                    
                    li.innerHTML = `<strong>${systemName}</strong> <span class="access-badge ${cssClass}">${level}</span>`;
                } else {
                    li.textContent = item;
                }
                
                modalAccessList.appendChild(li);
            });
            modal.style.display = 'flex';
        });
    });

    // Close Modal via 'X' button
    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    // Close Modal via clicking outside the white box
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    });
