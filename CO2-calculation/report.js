// report.js

document.addEventListener('DOMContentLoaded', function() {
    const reportPreview = document.getElementById('report-preview');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    // 调试：打印localStorage内容
    console.log('co2_report_data in localStorage:', localStorage.getItem('co2_report_data'));

    function getReportData() {
        const raw = localStorage.getItem('co2_report_data');
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }
        return null;
    }

    function renderReport() {
        const data = getReportData();
        if (!data) {
            reportPreview.innerHTML = '<div style="color:#c00;">No report data found. Please return to the calculator and generate a report.</div>';
            return;
        }
        reportPreview.innerHTML = `
        <b>Product Name:</b> ${data.productName}<br>
        <b>Material:</b> ${data.materialName} | <b>Weight:</b> ${data.materialWeight} kg | <b>CO2 Factor:</b> ${data.materialCO2Factor} kg CO2e/kg<br>
        <b>Material CO2:</b> ${Number(data.materialCO2Val).toFixed(2)} kg CO2e
        <hr>
        <b>Package:</b> ${data.trayMaterial} | <b>Tray Weight:</b> ${data.trayWeightVal} kg | <b>CO2 Factor:</b> ${data.trayCO2Factor} kg CO2e/kg | <b>Qty:</b> ${data.packageQtyVal}<br>
        <b>Package CO2 per PCS:</b> ${Number(data.packageCO2Val).toFixed(4)} kg CO2e
        <hr>
        <b>Process List:</b>
        <table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;margin:8px 0;width:100%;font-size:0.98em;">
            <tr><th>#</th><th>Process</th><th>CT (h)</th><th>CO2 (kg/h)</th><th>CO2 (kg)</th></tr>
            ${data.processRows}
        </table>
        <b>Total Process CO2:</b> ${Number(data.processCO2Val).toFixed(2)} kg CO2e
        <hr>
        <b style="font-size:1.1em;">Total CO2:</b> <span style="font-size:1.2em;">${Number(data.totalCO2).toFixed(2)} kg CO2e</span>
        `;
    }

    renderReport();

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            if (window.html2pdf) {
                html2pdf().set({
                    margin: 10,
                    filename: 'CO2_Report.pdf',
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).from(reportPreview).save();
            } else {
                alert('PDF export failed: html2pdf.js not loaded.');
            }
        });
    }
}); 