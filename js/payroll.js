// Payroll Module – Separate File
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown
    var dropbtn = document.getElementById('dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var menu = document.getElementById('dropdownMenu');
            menu.classList.toggle('show');
        });
        window.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-content').forEach(m => m.classList.remove('show'));
        });
    }

    // User name
    const userName = localStorage.getItem('user_name');
    if (document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = userName || 'HR Administrator';
    }

    // ---- DEMO DATA (fallback) ----
    function getDemoData() {
        return [
            { name: 'Employee 1', daily_rate: 500, days_present: 10, gross: 5000, sss: 250, philhealth: 125, pagibig: 100, withholding_tax: 0, net: 4525 },
            { name: 'Employee 4', daily_rate: 700, days_present: 8, gross: 5600, sss: 280, philhealth: 140, pagibig: 100, withholding_tax: 0, net: 5080 },
            { name: 'Employee 5', daily_rate: 800, days_present: 12, gross: 9600, sss: 480, philhealth: 240, pagibig: 100, withholding_tax: 0, net: 8780 },
            { name: 'Employee 6', daily_rate: 900, days_present: 10, gross: 9000, sss: 450, philhealth: 225, pagibig: 100, withholding_tax: 0, net: 8225 },
        ];
    }

    function renderPayroll(payrollData) {
        const resultsDiv = document.getElementById('payrollResults');
        let totalGross = 0, totalSSS = 0, totalPhil = 0, totalPag = 0, totalWT = 0, totalNet = 0;
        let html = '';

        for (const emp of payrollData) {
            totalGross += emp.gross || 0;
            totalSSS += emp.sss || 0;
            totalPhil += emp.philhealth || 0;
            totalPag += emp.pagibig || 0;
            totalWT += emp.withholding_tax || 0;
            totalNet += emp.net || 0;

            html += `<tr>
                <td>${emp.name}</td>
                <td>₱${(emp.daily_rate || 0).toFixed(2)}</td>
                <td>${emp.days_present || 0}</td>
                <td>₱${(emp.gross || 0).toFixed(2)}</td>
                <td>₱${(emp.sss || 0).toFixed(2)}</td>
                <td>₱${(emp.philhealth || 0).toFixed(2)}</td>
                <td>₱${(emp.pagibig || 0).toFixed(2)}</td>
                <td>₱${(emp.withholding_tax || 0).toFixed(2)}</td>
                <td>₱${(emp.net || 0).toFixed(2)}</td>
                <td><button class="btn-payslip" data-name="${emp.name}" data-daily="${emp.daily_rate}" data-days="${emp.days_present}" data-gross="${emp.gross}" data-sss="${emp.sss}" data-phil="${emp.philhealth}" data-pag="${emp.pagibig}" data-wt="${emp.withholding_tax}" data-net="${emp.net}">View Payslip</button></td>
            </tr>`;
        }

        const summaryHtml = `
            <div class="summary-cards">
                <div class="summary-card"><h4>Total Gross</h4><div class="summary-number">₱${totalGross.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total SSS (5%)</h4><div class="summary-number">₱${totalSSS.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total PhilHealth (2.5%)</h4><div class="summary-number">₱${totalPhil.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Pag-IBIG (2%)</h4><div class="summary-number">₱${totalPag.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Withholding Tax</h4><div class="summary-number">₱${totalWT.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Net Pay</h4><div class="summary-number">₱${totalNet.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Employees</h4><div class="summary-number">${payrollData.length}</div></div>
            </div>
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Daily Rate</th>
                            <th>Days Present</th>
                            <th>Gross Pay</th>
                            <th>SSS (5%)</th>
                            <th>PhilHealth (2.5%)</th>
                            <th>Pag-IBIG (2%)</th>
                            <th>Withholding Tax</th>
                            <th>Net Pay</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>${html}</tbody>
                </table>
            </div>
        `;
        resultsDiv.innerHTML = summaryHtml;

        // Attach payslip button events
        document.querySelectorAll('.btn-payslip').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.dataset.name;
                const daily = this.dataset.daily;
                const days = this.dataset.days;
                const gross = parseFloat(this.dataset.gross);
                const sss = parseFloat(this.dataset.sss);
                const phil = parseFloat(this.dataset.phil);
                const pag = parseFloat(this.dataset.pag);
                const wt = parseFloat(this.dataset.wt);
                const net = parseFloat(this.dataset.net);
                alert(`Payslip for ${name}\nDaily Rate: ₱${daily}\nDays Present: ${days}\nGross: ₱${gross.toFixed(2)}\nSSS (5%): ₱${sss.toFixed(2)}\nPhilHealth (2.5%): ₱${phil.toFixed(2)}\nPag-IBIG (2%): ₱${pag.toFixed(2)}\nWithholding Tax: ₱${wt.toFixed(2)}\nNet Pay: ₱${net.toFixed(2)}`);
            });
        });
    }

    // ---- COMPUTE PAYROLL ----
    function computePayroll() {
        const resultsDiv = document.getElementById('payrollResults');
        resultsDiv.innerHTML = '<p style="text-align:center; padding:2rem;">⏳ Computing...</p>';

        // Show demo immediately
        const demo = getDemoData();
        renderPayroll(demo);
        window.currentPayrollData = { employees: demo };

        // Try real API in background
        const period = document.getElementById('payPeriod').value;
        const monthYear = document.getElementById('payMonth').value;
        const [year, month] = monthYear.split('-');
        let startDay = (period === '1-15') ? '01' : '16';
        let endDay = (period === '1-15') ? '15' : '30';
        let startDate = year + '-' + month + '-' + startDay;
        let endDate = year + '-' + month + '-' + endDay;

        fetch('/hrms/backend/api/get_attendance_summary.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ start_date: startDate, end_date: endDate })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                renderPayroll(data.data);
                window.currentPayrollData = { period, monthYear, startDate, endDate, employees: data.data };
            }
        })
        .catch(err => console.log('API not available, using demo data.', err));
    }

    // ---- FINALIZE ----
    function finalizePayroll() {
        if (!window.currentPayrollData) {
            alert('Compute payroll first.');
            return;
        }
        alert('Payroll finalized (demo mode). In production, this would save to DB.');
    }

    // ---- BULK PAYSLIPS ----
    function generateBulkPayslips() {
        if (!window.currentPayrollData) {
            alert('Compute payroll first.');
            return;
        }
        const zip = new JSZip();
        for (let emp of window.currentPayrollData.employees) {
            const content = `========================================
PAYSLIP
========================================
Employee: ${emp.name}
Daily Rate: ₱${emp.daily_rate || 0}
Period: ${document.getElementById('payMonth').value}
Days Present: ${emp.days_present || 0}
----------------------------------------
Gross Pay: ₱${(emp.gross || 0).toFixed(2)}
Deductions:
  SSS (5%): ₱${(emp.sss || 0).toFixed(2)}
  PhilHealth (2.5%): ₱${(emp.philhealth || 0).toFixed(2)}
  Pag-IBIG (2%): ₱${(emp.pagibig || 0).toFixed(2)}
  Withholding Tax: ₱${(emp.withholding_tax || 0).toFixed(2)}
----------------------------------------
Net Pay: ₱${(emp.net || 0).toFixed(2)}
========================================
Generated by CKL HRMS on ${new Date().toLocaleString()}`;
            zip.file(`Payslip_${emp.name.replace(/ /g,'_')}.txt`, content);
        }
        zip.generateAsync({ type: 'blob' }).then(function(blob) {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `Payslips_${document.getElementById('payMonth').value}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Bulk payslips downloaded as ZIP file.');
        });
    }

    // ---- BUTTONS ----
    document.getElementById('computePayrollBtn').addEventListener('click', computePayroll);
    document.getElementById('finalizePayrollBtn').addEventListener('click', finalizePayroll);
    document.getElementById('bulkPayslipBtn').addEventListener('click', generateBulkPayslips);

    // ---- AUTO-LOAD ----
    computePayroll();
});// Payroll Module – Separate File
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown
    var dropbtn = document.getElementById('dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var menu = document.getElementById('dropdownMenu');
            menu.classList.toggle('show');
        });
        window.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-content').forEach(m => m.classList.remove('show'));
        });
    }

    // User name
    const userName = localStorage.getItem('user_name');
    if (document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').innerText = userName || 'HR Administrator';
    }

    // ---- DEMO DATA (fallback) ----
    function getDemoData() {
        return [
            { name: 'Employee 1', daily_rate: 500, days_present: 10, gross: 5000, sss: 250, philhealth: 125, pagibig: 100, withholding_tax: 0, net: 4525 },
            { name: 'Employee 4', daily_rate: 700, days_present: 8, gross: 5600, sss: 280, philhealth: 140, pagibig: 100, withholding_tax: 0, net: 5080 },
            { name: 'Employee 5', daily_rate: 800, days_present: 12, gross: 9600, sss: 480, philhealth: 240, pagibig: 100, withholding_tax: 0, net: 8780 },
            { name: 'Employee 6', daily_rate: 900, days_present: 10, gross: 9000, sss: 450, philhealth: 225, pagibig: 100, withholding_tax: 0, net: 8225 },
        ];
    }

    function renderPayroll(payrollData) {
        const resultsDiv = document.getElementById('payrollResults');
        let totalGross = 0, totalSSS = 0, totalPhil = 0, totalPag = 0, totalWT = 0, totalNet = 0;
        let html = '';

        for (const emp of payrollData) {
            totalGross += emp.gross || 0;
            totalSSS += emp.sss || 0;
            totalPhil += emp.philhealth || 0;
            totalPag += emp.pagibig || 0;
            totalWT += emp.withholding_tax || 0;
            totalNet += emp.net || 0;

            html += `<tr>
                <td>${emp.name}</td>
                <td>₱${(emp.daily_rate || 0).toFixed(2)}</td>
                <td>${emp.days_present || 0}</td>
                <td>₱${(emp.gross || 0).toFixed(2)}</td>
                <td>₱${(emp.sss || 0).toFixed(2)}</td>
                <td>₱${(emp.philhealth || 0).toFixed(2)}</td>
                <td>₱${(emp.pagibig || 0).toFixed(2)}</td>
                <td>₱${(emp.withholding_tax || 0).toFixed(2)}</td>
                <td>₱${(emp.net || 0).toFixed(2)}</td>
                <td><button class="btn-payslip" data-name="${emp.name}" data-daily="${emp.daily_rate}" data-days="${emp.days_present}" data-gross="${emp.gross}" data-sss="${emp.sss}" data-phil="${emp.philhealth}" data-pag="${emp.pagibig}" data-wt="${emp.withholding_tax}" data-net="${emp.net}">View Payslip</button></td>
            </tr>`;
        }

        const summaryHtml = `
            <div class="summary-cards">
                <div class="summary-card"><h4>Total Gross</h4><div class="summary-number">₱${totalGross.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total SSS (5%)</h4><div class="summary-number">₱${totalSSS.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total PhilHealth (2.5%)</h4><div class="summary-number">₱${totalPhil.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Pag-IBIG (2%)</h4><div class="summary-number">₱${totalPag.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Withholding Tax</h4><div class="summary-number">₱${totalWT.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Total Net Pay</h4><div class="summary-number">₱${totalNet.toFixed(2)}</div></div>
                <div class="summary-card"><h4>Employees</h4><div class="summary-number">${payrollData.length}</div></div>
            </div>
            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Daily Rate</th>
                            <th>Days Present</th>
                            <th>Gross Pay</th>
                            <th>SSS (5%)</th>
                            <th>PhilHealth (2.5%)</th>
                            <th>Pag-IBIG (2%)</th>
                            <th>Withholding Tax</th>
                            <th>Net Pay</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>${html}</tbody>
                </table>
            </div>
        `;
        resultsDiv.innerHTML = summaryHtml;

        // Attach payslip button events
        document.querySelectorAll('.btn-payslip').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.dataset.name;
                const daily = this.dataset.daily;
                const days = this.dataset.days;
                const gross = parseFloat(this.dataset.gross);
                const sss = parseFloat(this.dataset.sss);
                const phil = parseFloat(this.dataset.phil);
                const pag = parseFloat(this.dataset.pag);
                const wt = parseFloat(this.dataset.wt);
                const net = parseFloat(this.dataset.net);
                alert(`Payslip for ${name}\nDaily Rate: ₱${daily}\nDays Present: ${days}\nGross: ₱${gross.toFixed(2)}\nSSS (5%): ₱${sss.toFixed(2)}\nPhilHealth (2.5%): ₱${phil.toFixed(2)}\nPag-IBIG (2%): ₱${pag.toFixed(2)}\nWithholding Tax: ₱${wt.toFixed(2)}\nNet Pay: ₱${net.toFixed(2)}`);
            });
        });
    }

    // ---- COMPUTE PAYROLL ----
    function computePayroll() {
        const resultsDiv = document.getElementById('payrollResults');
        resultsDiv.innerHTML = '<p style="text-align:center; padding:2rem;">⏳ Computing...</p>';

        // Show demo immediately
        const demo = getDemoData();
        renderPayroll(demo);
        window.currentPayrollData = { employees: demo };

        // Try real API in background
        const period = document.getElementById('payPeriod').value;
        const monthYear = document.getElementById('payMonth').value;
        const [year, month] = monthYear.split('-');
        let startDay = (period === '1-15') ? '01' : '16';
        let endDay = (period === '1-15') ? '15' : '30';
        let startDate = year + '-' + month + '-' + startDay;
        let endDate = year + '-' + month + '-' + endDay;

        fetch('/hrms/backend/api/get_attendance_summary.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ start_date: startDate, end_date: endDate })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                renderPayroll(data.data);
                window.currentPayrollData = { period, monthYear, startDate, endDate, employees: data.data };
            }
        })
        .catch(err => console.log('API not available, using demo data.', err));
    }

    // ---- FINALIZE ----
    function finalizePayroll() {
        if (!window.currentPayrollData) {
            alert('Compute payroll first.');
            return;
        }
        alert('Payroll finalized (demo mode). In production, this would save to DB.');
    }

    // ---- BULK PAYSLIPS ----
    function generateBulkPayslips() {
        if (!window.currentPayrollData) {
            alert('Compute payroll first.');
            return;
        }
        const zip = new JSZip();
        for (let emp of window.currentPayrollData.employees) {
            const content = `========================================
PAYSLIP
========================================
Employee: ${emp.name}
Daily Rate: ₱${emp.daily_rate || 0}
Period: ${document.getElementById('payMonth').value}
Days Present: ${emp.days_present || 0}
----------------------------------------
Gross Pay: ₱${(emp.gross || 0).toFixed(2)}
Deductions:
  SSS (5%): ₱${(emp.sss || 0).toFixed(2)}
  PhilHealth (2.5%): ₱${(emp.philhealth || 0).toFixed(2)}
  Pag-IBIG (2%): ₱${(emp.pagibig || 0).toFixed(2)}
  Withholding Tax: ₱${(emp.withholding_tax || 0).toFixed(2)}
----------------------------------------
Net Pay: ₱${(emp.net || 0).toFixed(2)}
========================================
Generated by CKL HRMS on ${new Date().toLocaleString()}`;
            zip.file(`Payslip_${emp.name.replace(/ /g,'_')}.txt`, content);
        }
        zip.generateAsync({ type: 'blob' }).then(function(blob) {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `Payslips_${document.getElementById('payMonth').value}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Bulk payslips downloaded as ZIP file.');
        });
    }

    // ---- BUTTONS ----
    document.getElementById('computePayrollBtn').addEventListener('click', computePayroll);
    document.getElementById('finalizePayrollBtn').addEventListener('click', finalizePayroll);
    document.getElementById('bulkPayslipBtn').addEventListener('click', generateBulkPayslips);

    // ---- AUTO-LOAD ----
    computePayroll();
});