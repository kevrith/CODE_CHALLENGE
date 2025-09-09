// Net Salary Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const salaryForm = document.getElementById('salaryForm');
    const basicSalaryInput = document.getElementById('basicSalary');
    const benefitsInput = document.getElementById('benefits');
    const resetSalaryBtn = document.getElementById('resetSalaryBtn');
    const salaryErrorDiv = document.getElementById('salaryError');
    const salaryResultDiv = document.getElementById('salaryResult');

    // Display elements
    const displayBasicSalary = document.getElementById('displayBasicSalary');
    const displayBenefits = document.getElementById('displayBenefits');
    const displayGrossSalary = document.getElementById('displayGrossSalary');
    const displayPAYE = document.getElementById('displayPAYE');
    const displaySHIF = document.getElementById('displaySHIF');
    const displayNSSF = document.getElementById('displayNSSF');
    const displayHousingLevy = document.getElementById('displayHousingLevy');
    const displayTotalDeductions = document.getElementById('displayTotalDeductions');
    const displayNetSalary = document.getElementById('displayNetSalary');

    // Tax rates and constants (Based on Kenya KRA 2024 rates)
    const TAX_RATES = {
        // PAYE tax bands (monthly)
        PAYE_BANDS: [
            { min: 0, max: 24000, rate: 0.10 },        // 10% for first 24,000
            { min: 24001, max: 32333, rate: 0.25 },    // 25% for next 8,333
            { min: 32334, max: 500000, rate: 0.30 },   // 30% for next 467,667
            { min: 500001, max: 800000, rate: 0.325 }, // 32.5% for next 300,000
            { min: 800001, max: Infinity, rate: 0.35 } // 35% for above 800,000
        ],
        PERSONAL_RELIEF: 2400,        // Monthly personal relief
        SHIF_RATE: 0.0275,           // 2.75% Social Health Insurance Fund
        SHIF_MIN: 300,               // Minimum SHIF contribution
        NSSF_RATE: 0.06,             // 6% NSSF contribution
        NSSF_MAX: 4320,              // Maximum NSSF contribution (6% of 72,000)
        HOUSING_LEVY_RATE: 0.015     // 1.5% Housing Levy
    };
    // Calculate PAYE tax
    function calculatePAYE(taxableIncome) {
        let tax = 0;
        let remainingIncome = taxableIncome;

        for (const band of TAX_RATES.PAYE_BANDS) {
            if (remainingIncome <= 0) break;

            const bandMin = band.min;
            const bandMax = band.max === Infinity ? remainingIncome + bandMin : band.max;
            const bandWidth = bandMax - bandMin + 1;
            const taxableAtThisBand = Math.min(remainingIncome, bandWidth);

            if (taxableAtThisBand > 0) {
                tax += taxableAtThisBand * band.rate;
                remainingIncome -= taxableAtThisBand;
            }
        }
        // Apply personal relief
        tax = Math.max(0, tax - TAX_RATES.PERSONAL_RELIEF);
        return tax;
    }
    // Calculate SHIF deduction
    function calculateSHIF(grossSalary) {
        const shif = grossSalary * TAX_RATES.SHIF_RATE;
        return Math.max(shif, TAX_RATES.SHIF_MIN); // Minimum KSh 300
    }
    // Calculate NSSF deduction
    function calculateNSSF(grossSalary) {
        const nssf = grossSalary * TAX_RATES.NSSF_RATE;
        return Math.min(nssf, TAX_RATES.NSSF_MAX); // Maximum KSh 4,320
    }
    // Calculate Housing Levy
    function calculateHousingLevy(grossSalary) {
        return grossSalary * TAX_RATES.HOUSING_LEVY_RATE;
    }
    // Main salary calculation function
    function calculateNetSalary(basicSalary, benefits) {
        // Calculate gross salary
        const grossSalary = basicSalary + benefits;

        // Calculate statutory deductions
        const nssfDeduction = calculateNSSF(grossSalary);
        const shifDeduction = calculateSHIF(grossSalary);
        const housingLevyDeduction = calculateHousingLevy(grossSalary);

        // Calculate taxable income (gross minus allowable deductions)
        const allowableDeductions = nssfDeduction; // NSSF is tax-deductible
        const taxableIncome = grossSalary - allowableDeductions;

        // Calculate PAYE tax
        const payeTax = calculatePAYE(taxableIncome);

        // Calculate total deductions
        const totalDeductions = payeTax + shifDeduction + nssfDeduction + housingLevyDeduction;

        // Calculate net salary
        const netSalary = grossSalary - totalDeductions;

        return {
            basicSalary,
            benefits,
            grossSalary,
            payeTax,
            shifDeduction,
            nssfDeduction,
            housingLevyDeduction,
            totalDeductions,
            netSalary
        };
    }
    // Format currency for display
    function formatCurrency(amount) {
        return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    // Show error function
    function showError(message) {
        salaryErrorDiv.textContent = message;
        salaryErrorDiv.classList.add('show');
        salaryResultDiv.classList.remove('show');
    }
    // Hide error function
    function hideError() {
        salaryErrorDiv.classList.remove('show');
    }
    // Display results function
    function displayResults(results) {
        hideError();
        
        displayBasicSalary.textContent = formatCurrency(results.basicSalary);
        displayBenefits.textContent = formatCurrency(results.benefits);
        displayGrossSalary.textContent = formatCurrency(results.grossSalary);
        displayPAYE.textContent = formatCurrency(results.payeTax);
        displaySHIF.textContent = formatCurrency(results.shifDeduction);
        displayNSSF.textContent = formatCurrency(results.nssfDeduction);
        displayHousingLevy.textContent = formatCurrency(results.housingLevyDeduction);
        displayTotalDeductions.textContent = formatCurrency(results.totalDeductions);
        displayNetSalary.textContent = formatCurrency(results.netSalary);
        
        salaryResultDiv.classList.add('show');
    }
    // Clear results function
    function clearResults() {
        hideError();
        salaryResultDiv.classList.remove('show');
    }
    // Validate inputs function
    function validateInputs(basicSalary, benefits) {
        if (isNaN(basicSalary) || basicSalary < 0) {
            showError('Please enter a valid basic salary (0 or greater).');
            return false;
        }

        if (isNaN(benefits) || benefits < 0) {
            showError('Please enter valid benefits (0 or greater).');
            return false;
        }

        if (basicSalary > 10000000) {
            showError('Please enter a realistic salary amount.');
            return false;
        }

        return true;
    }
    // Reset form function
    function resetForm() {
        salaryForm.reset();
        benefitsInput.value = '0'; // Reset benefits to 0
        clearResults();
        basicSalaryInput.focus();
    }
    // Event listeners
    salaryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const basicSalary = parseFloat(basicSalaryInput.value) || 0;
        const benefits = parseFloat(benefitsInput.value) || 0;
        
        if (!validateInputs(basicSalary, benefits)) {
            return;
        }
        
        const results = calculateNetSalary(basicSalary, benefits);
        displayResults(results);
    });

    resetSalaryBtn.addEventListener('click', function() {
        resetForm();
    });
    // Input validation on typing
    basicSalaryInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        if (this.value && (isNaN(value) || value < 0)) {
            this.setCustomValidity('Please enter a valid salary (0 or greater)');
        } else if (this.value && value > 10000000) {
            this.setCustomValidity('Please enter a realistic salary amount');
        } else {
            this.setCustomValidity('');
            hideError();
        }
    });
    benefitsInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        if (this.value && (isNaN(value) || value < 0)) {
            this.setCustomValidity('Please enter valid benefits (0 or greater)');
        } else {
            this.setCustomValidity('');
            hideError();
        }
    });
    // Enter key support
    basicSalaryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            benefitsInput.focus();
        }
    });
    benefitsInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            salaryForm.dispatchEvent(new Event('submit'));
        }
    });
    // Example calculation function for demonstration
    function showExample() {
        basicSalaryInput.value = '50000';
        benefitsInput.value = '10000';
        
        const results = calculateNetSalary(50000, 10000);
        displayResults(results);
    }
    // Utility function to get tax breakdown
    function getTaxBreakdown(taxableIncome) {
        const breakdown = [];
        let remainingIncome = taxableIncome;
        let totalTax = 0;

        for (const band of TAX_RATES.PAYE_BANDS) {
            if (remainingIncome <= 0) break;

            const bandMin = band.min;
            const bandMax = band.max === Infinity ? remainingIncome + bandMin : band.max;
            const bandWidth = bandMax - bandMin + 1;
            const taxableAtThisBand = Math.min(remainingIncome, bandWidth);

            if (taxableAtThisBand > 0) {
                const taxAtThisBand = taxableAtThisBand * band.rate;
                totalTax += taxAtThisBand;
                
                breakdown.push({
                    range: `${formatCurrency(bandMin)} - ${band.max === Infinity ? 'Above' : formatCurrency(bandMax)}`,
                    rate: `${(band.rate * 100)}%`,
                    taxable: formatCurrency(taxableAtThisBand),
                    tax: formatCurrency(taxAtThisBand)
                });
                
                remainingIncome -= taxableAtThisBand;
            }
        }
        return { breakdown, totalTax };
    }
    // Add console logging for debugging
    console.log('Net Salary Calculator loaded successfully');
    console.log('Current tax rates:', TAX_RATES);
    // Focus on basic salary input when page loads
    if (basicSalaryInput) {
        basicSalaryInput.focus();
    }
});