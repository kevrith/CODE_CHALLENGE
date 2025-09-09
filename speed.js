// Speed Detector JavaScript Code
// Ensuring that the Script is run after the page has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const speedForm = document.getElementById('speedForm');
    const speedInput = document.getElementById('speed');
    const resetSpeedBtn = document.getElementById('resetSpeedBtn');
    const speedErrorDiv = document.getElementById('speedError');
    const speedResultDiv = document.getElementById('speedResult');
    const speedStatus = document.getElementById('speedStatus');
    const pointsDisplay = document.getElementById('pointsDisplay');
    const warningMessage = document.getElementById('warningMessage');

    // Speed limit constants
    const SPEED_LIMIT = 70;
    const POINTS_PER_VIOLATION = 1;
    const SPEED_INCREMENT = 5;
    const MAX_POINTS_BEFORE_SUSPENSION = 12;

    // Speed checking function
    function calculateDemeritPoints(speed) {
        if (speed <= SPEED_LIMIT) {
            return {
                status: 'ok',
                message: 'Ok',
                points: 0,
                speed: speed
            };
        }

        // Calculate points for speeding
        const speedOver = speed - SPEED_LIMIT;
        // Rounding the result down to the nearest whole number.
        const points = Math.floor(speedOver / SPEED_INCREMENT) * POINTS_PER_VIOLATION;
        
        return {
            status: 'violation',
            message: `Points: ${points}`,
            points: points,
            speed: speed,
            suspended: points > MAX_POINTS_BEFORE_SUSPENSION
        };
    }

    // Show error function
    function showError(message) {
        speedErrorDiv.textContent = message;
        speedErrorDiv.classList.add('show');
        speedResultDiv.classList.remove('show');
        // Don't clear warning message when showing error - let it persist
    }

    // Hide error function
    function hideError() {
        speedErrorDiv.classList.remove('show');
        speedErrorDiv.textContent = '';
    }

    // Display result function - NEVER clears warning message
    function displayResult(result) {
        hideError();
        speedResultDiv.classList.add('show');
        
        if (result.status === 'ok') {
            speedStatus.textContent = result.message;
            speedStatus.className = 'status ok';
            pointsDisplay.textContent = 'No demerit points issued';
            pointsDisplay.className = 'points';
            
            // DO NOT clear warning message - let it persist
        } else {
            speedStatus.textContent = `Speed: ${result.speed} km/h (${result.speed - SPEED_LIMIT} km/h over limit)`;
            speedStatus.className = 'status violation';
            pointsDisplay.textContent = result.message;
            pointsDisplay.className = 'points';
            
            if (result.suspended) {
                warningMessage.textContent = '⚠️ License suspended';
                warningMessage.classList.add('show');
            }
            // DO NOT clear warning message for non-suspension cases - let it persist
        }
    }

    // Clear results function - only used by reset button
    function clearAllResults() {
        hideError();
        speedResultDiv.classList.remove('show');
        
        // Clear all display elements including warning message
        speedStatus.textContent = '';
        speedStatus.className = 'status';
        pointsDisplay.textContent = '';
        pointsDisplay.className = 'points';
        warningMessage.classList.remove('show');
        warningMessage.textContent = '';
    }

    // Partial clear function - only clears status and points, NOT warning
    function clearStatusAndPoints() {
        speedStatus.textContent = '';
        speedStatus.className = 'status';
        pointsDisplay.textContent = '';
        pointsDisplay.className = 'points';
    }

    // Check speed function - DOES NOT clear warning message
    function checkSpeed() {
        const speed = parseFloat(speedInput.value);
        
        // Only clear status and points, NOT the warning message
        clearStatusAndPoints();
        hideError();

        // Validate input
        if (speed < 0) {
            showError('Please enter a valid speed (0 or greater).');
            return;
        }

        if (speed > 300) {
            showError('Please enter a realistic speed value.');
            return;
        }

        // Calculate result
        const result = calculateDemeritPoints(speed);
        displayResult(result);
    }

    // Reset form function - ONLY this clears the warning message
    function resetForm() {
        speedInput.value = '';
        speedInput.setCustomValidity(''); // Clear any validation messages
        clearAllResults(); // This is the ONLY function that clears warning message
        speedInput.focus();
    }

    // Event listeners
    speedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkSpeed();
    });

    resetSpeedBtn.addEventListener('click', function() {
        resetForm();
    });

    speedInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkSpeed();
        }
    });

    // Enhanced input validation on typing
    speedInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        
        if (this.value && (isNaN(value) || value < 0)) {
            this.setCustomValidity('Please enter a valid speed (0 or greater)');
        } else if (this.value && value > 300) {
            this.setCustomValidity('Please enter a realistic speed value');
        } else {
            this.setCustomValidity('');
            hideError();
        }
    });

    // Focus on speed input when page loads
    if (speedInput) {
        speedInput.focus();
    }

    console.log('Speed Detector loaded successfully');
});