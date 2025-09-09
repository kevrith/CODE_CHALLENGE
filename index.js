// DOM elements
const form = document.getElementById('gradeForm');
const marksInput = document.getElementById('marks');
const resetBtn = document.getElementById('resetBtn');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');
const gradeDisplay = document.getElementById('gradeDisplay');
const resultText = document.getElementById('resultText');
const resultMark = document.getElementById('resultMark');

// Grade calculation function using if and else if
function calculateGrade(marks) {
    if (marks >= 80) {
        return { grade: 'A', message: 'Excellent!', class: 'a' };
    } else if (marks >= 60) {
        return { grade: 'B', message: 'Good work!', class: 'b' };
    } else if (marks >= 49) {
        return { grade: 'C', message: 'Average performance', class: 'c' };
    } else if (marks >= 40) {
        return { grade: 'D', message: 'Below average', class: 'd' };
    } else {
        return { grade: 'E', message: 'Needs improvement', class: 'e' };
    }
}
// Show error function
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    resultDiv.classList.remove('show');
}
// Hide error function
function hideError() {
    errorDiv.classList.remove('show');
}
// Show result function
function showResult(marks, gradeData) {
    hideError();
    
    gradeDisplay.textContent = gradeData.grade;
    gradeDisplay.className = `grade ${gradeData.class}`;
    resultText.textContent = gradeData.message;
    resultMark.textContent = `${marks} marks`;
    
    resultDiv.classList.add('show');
}

// Form submit handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const marks = parseInt(marksInput.value);
    
    // Validation
    if (isNaN(marks)) {
        showError('Please enter a valid number');
        return;
    }
    
    if (marks < 0 || marks > 100) {
        showError('Marks must be between 0 and 100');
        return;
    }
    
    // Calculate and show grade
    const gradeData = calculateGrade(marks);
    showResult(marks, gradeData);
});

// Reset button handler
resetBtn.addEventListener('click', function() {
    form.reset();
    hideError();
    resultDiv.classList.remove('show');
    marksInput.focus();
});

// Input validation on typing
marksInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    
    if (this.value && (isNaN(value) || value < 0 || value > 100)) {
        this.setCustomValidity('Please enter a number between 0 and 100');
    } else {
        this.setCustomValidity('');
        hideError();
    }
});

// Focus on input when page loads
window.addEventListener('load', function() {
    marksInput.focus();
});