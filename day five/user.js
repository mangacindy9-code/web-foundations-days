document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-users');
    const filterInput = document.getElementById('filter-input');
    const statusEl = document.getElementById('status');
    const usersListEl = document.getElementById('users-list');

    let allUsers = [];

    loadBtn.addEventListener('click', loadUsers);
    filterInput.addEventListener('input', handleFilter);

    async function loadUsers() {
        loadBtn.disabled = true;
        statusEl.textContent = 'Loading users...';
        usersListEl.innerHTML = '';

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            allUsers = await response.json();
            statusEl.textContent = `Successfully loaded ${allUsers.length} users.`;
            renderUsers(allUsers);
        } catch (error) {
            statusEl.textContent = `Error loading users: ${error.message}`;
            console.error('Fetch error:', error);
        } finally {
            loadBtn.disabled = false;
        }
    }

    function renderUsers(list) {
        usersListEl.innerHTML = '';

        if (list.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No users match your filter.';
            usersListEl.appendChild(li);
            return;
        }

        list.forEach(user => {
            const li = document.createElement('li');
            
            const nameEl = document.createElement('strong');
            nameEl.textContent = user.name;
            li.appendChild(nameEl);

            const detailsEl = document.createElement('div');
            detailsEl.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;
            li.appendChild(detailsEl);

            usersListEl.appendChild(li);
        });
    }

    function handleFilter(e) {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allUsers.filter(user => 
            user.name.toLowerCase().includes(query)
        );
        renderUsers(filtered);
    }
});
