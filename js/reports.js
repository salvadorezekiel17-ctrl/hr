// HR Reports Module
const HRReports = (() => {
    const API_ENDPOINT = `${API_BASE}hr/reports`;

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
            console.error('Error loading reports:', error);
            showMessage('message', 'Failed to load reports.', 'error');
        }
    };

    const setupEventListeners = () => {
        const generateBtn = document.getElementById('generateReportBtn');
        const filterBtn = document.getElementById('filterReportBtn');
        const downloadBtn = document.getElementById('downloadReportBtn');

        if (generateBtn) generateBtn.addEventListener('click', handleGenerate);
        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
    };

    const displayData = (data) => {
        const container = document.getElementById('reportsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No reports available.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="report-item" data-id="${item.id}">
                <h3>${escapeHtml(item.title || 'Report')}</h3>
                <p><strong>Type:</strong> ${escapeHtml(item.type || 'N/A')}</p>
                <p><strong>Date Generated:</strong> ${escapeHtml(item.dateGenerated || 'N/A')}</p>
                <p><strong>Records:</strong> ${escapeHtml(item.recordCount || '0')}</p>
                <p><strong>Description:</strong> ${escapeHtml(item.description || '')}</p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View</button>
                    <button class="download-btn" data-id="${item.id}">Download</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDownload(e.target.dataset.id));
        });
    };

    const handleGenerate = async () => {
        const form = document.getElementById('reportForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/generate`, 'POST', payload);
            showMessage('message', 'Report generated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error generating report:', error);
            showMessage('message', 'Failed to generate report.', 'error');
        }
    };

    const handleFilter = async () => {
        const filterForm = document.getElementById('filterForm');
        if (!filterForm) return;

        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData);

        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await apiCall(`${API_ENDPOINT}?${queryString}`);
            const data = response.data || [];
            displayData(data);
        } catch (error) {
            console.error('Error filtering reports:', error);
            showMessage('message', 'Failed to filter reports.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayReportDetails(data);
        } catch (error) {
            console.error('Error loading report details:', error);
            showMessage('message', 'Failed to load report details.', 'error');
        }
    };

    const handleDownload = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/download`);
            showMessage('message', 'Report downloaded successfully.', 'success');
        } catch (error) {
            console.error('Error downloading report:', error);
            showMessage('message', 'Failed to download report.', 'error');
        }
    };

    const displayReportDetails = (data) => {
        const modalContent = document.getElementById('reportDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>${escapeHtml(data.title || 'Report Details')}</h2>
                <p><strong>Type:</strong> ${escapeHtml(data.type || 'N/A')}</p>
                <p><strong>Date Generated:</strong> ${escapeHtml(data.dateGenerated || 'N/A')}</p>
                <p><strong>Records:</strong> ${escapeHtml(data.recordCount || '0')}</p>
                <p><strong>Description:</strong> ${escapeHtml(data.description || '')}</p>
                <p><strong>Generated By:</strong> ${escapeHtml(data.generatedBy || 'N/A')}</p>
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
    HRReports.init();
});
