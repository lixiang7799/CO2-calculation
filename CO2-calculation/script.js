// script.js - JavaScript code will be added here

document.addEventListener('DOMContentLoaded', function() {
    // Material CO2
    const materialSelect = document.getElementById('material-select');
    const materialCO2 = document.getElementById('material-co2');
    const productWeight = document.getElementById('product-weight');
    const calcBtn = document.getElementById('calculate-material-co2');
    const resultDiv = document.getElementById('material-co2-result');

    if (materialSelect && materialCO2) {
        materialSelect.addEventListener('change', function() {
            const selected = materialSelect.options[materialSelect.selectedIndex];
            const co2 = selected.getAttribute('data-co2');
            if (co2) {
                materialCO2.value = co2;
            } else {
                materialCO2.value = '';
            }
        });
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            const weight = parseFloat(productWeight.value);
            const co2Factor = parseFloat(materialCO2.value);
            if (!isNaN(weight) && !isNaN(co2Factor)) {
                const totalCO2 = weight * co2Factor;
                resultDiv.style.display = 'block';
                resultDiv.textContent = `Material CO2 Emissions: ${totalCO2.toFixed(5)} kg CO2e`;
            } else {
                resultDiv.style.display = 'block';
                resultDiv.textContent = 'Please enter valid weight and CO2 factor.';
            }
        });
    }

    // Process CO2 (dynamic rows)
    const processList = document.getElementById('process-list');
    const addProcessBtn = document.getElementById('add-process');
    const processCalcBtn = document.getElementById('calculate-process-co2');
    const processResultDiv = document.getElementById('process-co2-result');

    function bindProcessRowEvents(row) {
        const select = row.querySelector('.process-select');
        const co2Input = row.querySelector('.process-co2');
        const removeBtn = row.querySelector('.remove-process');
        if (select && co2Input) {
            select.addEventListener('change', function() {
                const selected = select.options[select.selectedIndex];
                const co2 = selected.getAttribute('data-co2');
                if (co2) {
                    co2Input.value = co2;
                } else {
                    co2Input.value = '';
                }
            });
        }
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                if (processList.children.length > 1) {
                    row.remove();
                }
            });
        }
    }

    // 绑定初始行
    Array.from(processList.children).forEach(bindProcessRowEvents);

    if (addProcessBtn) {
        addProcessBtn.addEventListener('click', function() {
            const row = document.createElement('div');
            row.className = 'process-row';
            row.style.marginBottom = '12px';
            row.innerHTML = `
                <select class="process-select" required style="width:30%;margin-right:8px;">
                    <option value="">Select process</option>
                    <option value="injection" data-co2="0.5">Injection Molding</option>
                    <option value="cnc" data-co2="1.2">CNC Machining</option>
                    <option value="die_casting" data-co2="1.8">Die Casting</option>
                    <option value="stamping" data-co2="0.7">Stamping</option>
                    <option value="extrusion" data-co2="1.0">Extrusion</option>
                    <option value="anodizing" data-co2="0.3">Anodizing</option>
                    <option value="painting" data-co2="0.2">Painting</option>
                    <option value="welding" data-co2="0.4">Welding</option>
                    <option value="assembly" data-co2="0.1">Assembly</option>
                    <option value="other" data-co2="">Other</option>
                </select>
                <input type="number" class="process-ct" placeholder="CT (hour)" min="0" step="0.01" style="width:20%;margin-right:8px;">
                <input type="number" class="process-co2" placeholder="CO2 (kg/h)" min="0" step="0.01" style="width:20%;margin-right:8px;">
                <button type="button" class="remove-process" style="background:#e74c3c;color:#fff;">-</button>
            `;
            processList.appendChild(row);
            bindProcessRowEvents(row);
        });
    }

    if (processCalcBtn) {
        processCalcBtn.addEventListener('click', function() {
            let totalCO2 = 0;
            let valid = true;
            Array.from(processList.children).forEach(row => {
                const ct = parseFloat(row.querySelector('.process-ct').value);
                const co2 = parseFloat(row.querySelector('.process-co2').value);
                if (!isNaN(ct) && !isNaN(co2)) {
                    totalCO2 += ct * co2;
                } else {
                    valid = false;
                }
            });
            processResultDiv.style.display = 'block';
            if (valid && processList.children.length > 0) {
                processResultDiv.textContent = `Total Process CO2 Emissions: ${totalCO2.toFixed(5)} kg CO2e`;
            } else {
                processResultDiv.textContent = 'Please enter valid CT and CO2 factor for all processes.';
            }
        });
    }

    // Package CO2
    const trayMaterialSelect = document.getElementById('tray-material-select');
    const trayCO2 = document.getElementById('tray-co2');
    const trayWeight = document.getElementById('tray-weight');
    const packageQty = document.getElementById('package-qty');
    const packageCalcBtn = document.getElementById('calculate-package-co2');
    const packageResultDiv = document.getElementById('package-co2-result');

    if (trayMaterialSelect && trayCO2) {
        trayMaterialSelect.addEventListener('change', function() {
            const selected = trayMaterialSelect.options[trayMaterialSelect.selectedIndex];
            const co2 = selected.getAttribute('data-co2');
            if (co2) {
                trayCO2.value = co2;
            } else {
                trayCO2.value = '';
            }
        });
    }

    if (packageCalcBtn) {
        packageCalcBtn.addEventListener('click', function() {
            const qty = parseInt(packageQty.value, 10);
            const co2Factor = parseFloat(trayCO2.value);
            const weight = parseFloat(trayWeight.value);
            if (!isNaN(qty) && qty > 0 && !isNaN(co2Factor) && !isNaN(weight)) {
                const co2PerPCS = (weight * co2Factor) / qty;
                packageResultDiv.style.display = 'block';
                packageResultDiv.textContent = `Package CO2 per PCS: ${co2PerPCS.toFixed(5)} kg CO2e`;
            } else {
                packageResultDiv.style.display = 'block';
                packageResultDiv.textContent = 'Please enter valid tray weight, CO2 factor and package quantity.';
            }
        });
    }

    // Total CO2
    const totalBtn = document.getElementById('calculate-total-co2');
    const totalBreakdown = document.getElementById('total-co2-breakdown');

    if (totalBtn) {
        totalBtn.addEventListener('click', function() {
            // Material
            let materialCO2 = 0;
            const weight = parseFloat(productWeight.value);
            const co2Factor = parseFloat(materialCO2.value);
            // 修正：应取materialCO2输入框的值
            const materialCO2FactorInput = document.getElementById('material-co2');
            const materialWeightInput = document.getElementById('product-weight');
            const materialCO2Factor = parseFloat(materialCO2FactorInput.value);
            const materialWeightVal = parseFloat(materialWeightInput.value);
            if (!isNaN(materialWeightVal) && !isNaN(materialCO2Factor)) {
                materialCO2 = materialWeightVal * materialCO2Factor;
            }
            // Process
            let processCO2 = 0;
            let validProcess = true;
            Array.from(processList.children).forEach(row => {
                const ct = parseFloat(row.querySelector('.process-ct').value);
                const co2 = parseFloat(row.querySelector('.process-co2').value);
                if (!isNaN(ct) && !isNaN(co2)) {
                    processCO2 += ct * co2;
                } else {
                    validProcess = false;
                }
            });
            // Package
            let packageCO2 = 0;
            const qty = parseInt(packageQty.value, 10);
            const trayCO2Val = parseFloat(trayCO2.value);
            const trayWeightVal = parseFloat(trayWeight.value);
            if (!isNaN(qty) && qty > 0 && !isNaN(trayCO2Val) && !isNaN(trayWeightVal)) {
                packageCO2 = (trayWeightVal * trayCO2Val) / qty;
            }
            // Total
            const total = materialCO2 + processCO2 + packageCO2;
            let html = `<b>Material CO2:</b> ${materialCO2 ? materialCO2.toFixed(5) : '0.00000'} kg CO2e<br>`;
            html += `<b>Process CO2:</b> ${processCO2 ? processCO2.toFixed(5) : '0.00000'} kg CO2e<br>`;
            html += `<b>Package CO2:</b> ${packageCO2 ? packageCO2.toFixed(5) : '0.00000'} kg CO2e<br>`;
            html += `<hr style='margin:8px 0;'>`;
            html += `<b style='font-size:1.2em;'>Total CO2: ${total ? total.toFixed(5) : '0.00000'} kg CO2e</b>`;
            totalBreakdown.innerHTML = html;
        });
    }

    // Report Preview & Export PDF
    const reportPreview = document.getElementById('report-preview');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    function generateReportHTML() {
        // 获取各部分数据
        const productName = document.getElementById('product-name').value || '-';
        const materialName = materialSelect.options[materialSelect.selectedIndex]?.text || '-';
        const materialWeight = productWeight.value || '-';
        const materialCO2Factor = materialCO2.value || '-';
        let materialCO2Val = 0;
        if (productWeight.value && materialCO2.value) materialCO2Val = (parseFloat(productWeight.value) * parseFloat(materialCO2.value));

        const trayMaterial = trayMaterialSelect.options[trayMaterialSelect.selectedIndex]?.text || '-';
        const trayWeightVal = trayWeight.value || '-';
        const trayCO2Factor = trayCO2.value || '-';
        const packageQtyVal = packageQty.value || '-';
        let packageCO2Val = 0;
        if (trayWeight.value && trayCO2.value && packageQty.value) packageCO2Val = (parseFloat(trayWeight.value) * parseFloat(trayCO2.value)) / parseInt(packageQty.value, 10);

        // Process
        let processRows = '';
        let processCO2Val = 0;
        Array.from(processList.children).forEach((row, idx) => {
            const procName = row.querySelector('.process-select').options[row.querySelector('.process-select').selectedIndex]?.text || '-';
            const ct = row.querySelector('.process-ct').value || '-';
            const co2 = row.querySelector('.process-co2').value || '-';
            let rowCO2 = '-';
            if (ct !== '-' && co2 !== '-') {
                rowCO2 = (parseFloat(ct) * parseFloat(co2)).toFixed(2);
                if (!isNaN(rowCO2)) processCO2Val += parseFloat(rowCO2);
            }
            processRows += `<tr><td>${idx+1}</td><td>${procName}</td><td>${ct}</td><td>${co2}</td><td>${rowCO2}</td></tr>`;
        });

        const totalCO2 = (materialCO2Val + processCO2Val + packageCO2Val).toFixed(2);

        return `
        <b>Product Name:</b> ${productName}<br>
        <b>Material:</b> ${materialName} | <b>Weight:</b> ${materialWeight} kg | <b>CO2 Factor:</b> ${materialCO2Factor} kg CO2e/kg<br>
        <b>Material CO2:</b> ${materialCO2Val.toFixed(2)} kg CO2e
        <hr>
        <b>Package:</b> ${trayMaterial} | <b>Tray Weight:</b> ${trayWeightVal} kg | <b>CO2 Factor:</b> ${trayCO2Factor} kg CO2e/kg | <b>Qty:</b> ${packageQtyVal}<br>
        <b>Package CO2 per PCS:</b> ${packageCO2Val.toFixed(4)} kg CO2e
        <hr>
        <b>Process List:</b>
        <table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;margin:8px 0;width:100%;font-size:0.98em;">
            <tr><th>#</th><th>Process</th><th>CT (h)</th><th>CO2 (kg/h)</th><th>CO2 (kg)</th></tr>
            ${processRows}
        </table>
        <b>Total Process CO2:</b> ${processCO2Val.toFixed(2)} kg CO2e
        <hr>
        <b style="font-size:1.1em;">Total CO2:</b> <span style="font-size:1.2em;">${totalCO2} kg CO2e</span>
        `;
    }

    if (reportPreview) {
        // 自动预览（可根据需要改为按钮触发）
        setInterval(() => {
            reportPreview.innerHTML = generateReportHTML();
        }, 1000);
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            alert('PDF export feature coming soon!');
            // 可集成jsPDF/html2pdf等库实现PDF导出
        });
    }

    // 首页预览报告按钮跳转并存储数据
    const previewReportBtn = document.getElementById('preview-report-btn');
    if (previewReportBtn) {
        previewReportBtn.addEventListener('click', function() {
            // 收集数据
            const data = {};
            data.productName = document.getElementById('product-name').value || '-';
            data.materialName = materialSelect.options[materialSelect.selectedIndex]?.text || '-';
            data.materialWeight = productWeight.value || '-';
            data.materialCO2Factor = materialCO2.value || '-';
            data.materialCO2Val = (productWeight.value && materialCO2.value) ? (parseFloat(productWeight.value) * parseFloat(materialCO2.value)) : 0;
            data.trayMaterial = trayMaterialSelect.options[trayMaterialSelect.selectedIndex]?.text || '-';
            data.trayWeightVal = trayWeight.value || '-';
            data.trayCO2Factor = trayCO2.value || '-';
            data.packageQtyVal = packageQty.value || '-';
            data.packageCO2Val = (trayWeight.value && trayCO2.value && packageQty.value) ? (parseFloat(trayWeight.value) * parseFloat(trayCO2.value)) / parseInt(packageQty.value, 10) : 0;
            // 工艺
            let processRows = '';
            let processCO2Val = 0;
            Array.from(processList.children).forEach((row, idx) => {
                const procName = row.querySelector('.process-select').options[row.querySelector('.process-select').selectedIndex]?.text || '-';
                const ct = row.querySelector('.process-ct').value || '-';
                const co2 = row.querySelector('.process-co2').value || '-';
                let rowCO2 = '-';
                if (ct !== '-' && co2 !== '-') {
                    rowCO2 = (parseFloat(ct) * parseFloat(co2)).toFixed(5);
                    if (!isNaN(rowCO2)) processCO2Val += parseFloat(rowCO2);
                }
                processRows += `<tr><td>${idx+1}</td><td>${procName}</td><td>${ct}</td><td>${co2}</td><td>${rowCO2}</td></tr>`;
            });
            data.processRows = processRows;
            data.processCO2Val = processCO2Val;
            data.totalCO2 = (data.materialCO2Val + processCO2Val + data.packageCO2Val);
            // 存储到localStorage
            localStorage.setItem('co2_report_data', JSON.stringify(data));
            window.location.href = 'report.html';
        });
    }
});