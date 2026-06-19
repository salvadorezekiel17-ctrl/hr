// Coordinator Teams Module
const CoordinatorTeams = (() => {
    const API_ENDPOINT = `${API_BASE}coordinator/teams`;

    const init = () => {
        loadData();
        setupEventListeners();
    };

    const loadData = async () => {
        try {
            const response = await apiCall(API_ENDPOINT);
            const data = response.data || [];
            displayData(data);
        } catch (error) {
            console.error('Error loading teams:', error);
            showMessage('message', 'Failed to load teams.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createTeamBtn');
        const editBtn = document.getElementById('editTeamBtn');
        const deleteBtn = document.getElementById('deleteTeamBtn');
        const addMemberBtn = document.getElementById('addMemberBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);
        if (addMemberBtn) addMemberBtn.addEventListener('click', handleAddMember);
    };

    const displayData = (data) => {
        const container = document.getElementById('teamsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No teams found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="team-item" data-id="${item.id}">
                <h3>${escapeHtml(item.name || 'Team')}</h3>
                <p><strong>Team Lead:</strong> ${escapeHtml(item.teamLead || 'N/A')}</p>
                <p><strong>Members:</strong> ${escapeHtml(item.memberCount || '0')}</p>
                <p><strong>Department:</strong> ${escapeHtml(item.department || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Active')}</span></p>
                <p><strong>Description:</strong> ${escapeHtml(item.description || '')}</p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View Members</button>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEdit(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('teamForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Team created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating team:', error);
            showMessage('message', 'Failed to create team.', 'error');
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;

        const form = document.getElementById('teamForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, 'PUT', payload);
            showMessage('message', 'Team updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating team:', error);
            showMessage('message', 'Failed to update team.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!id || !confirm('Are you sure you want to delete this team?')) return;

        try {
            await apiCall(`${API_ENDPOINT}/${id}`, 'DELETE');
            showMessage('message', 'Team deleted successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error deleting team:', error);
            showMessage('message', 'Failed to delete team.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/members`);
            const members = response.data || [];
            displayTeamMembers(members);
        } catch (error) {
            console.error('Error loading team members:', error);
            showMessage('message', 'Failed to load team members.', 'error');
        }
    };

    const handleAddMember = async () => {
        const form = document.getElementById('addMemberForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${payload.teamId}/members`, 'POST', payload);
            showMessage('message', 'Member added successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error adding member:', error);
            showMessage('message', 'Failed to add member.', 'error');
        }
    };

    const displayTeamMembers = (members) => {
        const modalContent = document.getElementById('teamMembersModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Team Members</h2>
                <ul>
                    ${members.map(member => `<li>${escapeHtml(member.name || 'N/A')} - ${escapeHtml(member.position || 'N/A')}</li>`).join('')}
                </ul>
                <button class="close-btn">Close</button>
            </div>
        `;

        modalContent.innerHTML = html;
        document.querySelector('.close-btn').addEventListener('click', () => {
            modalContent.style.display = 'none';
        });
        modalContent.style.display = 'block';
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    CoordinatorTeams.init();
});
