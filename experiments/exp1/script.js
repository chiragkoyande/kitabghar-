/**
 * Kitab Ghar · Experiment 1 Client-Side Validation Script
 * Standalone JavaScript Form Validation & Bootstrap Integration
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const formAlert = document.getElementById("form-alert");
  const dobInput = document.getElementById("dob");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordMeterBar = document.getElementById("password-meter-bar");
  const passwordFeedback = document.getElementById("password-feedback");
  const modalSummary = document.getElementById("modal-summary");
  const modalElement = document.getElementById("registrationModal");
  const registrationModal = window.bootstrap && window.bootstrap.Modal
    ? new window.bootstrap.Modal(modalElement)
    : null;

  // Set maximum selectable date of birth (must be at least 13 years old)
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  dobInput.max = maxDobDate.toISOString().split("T")[0];

  function validateField(field) {
    if (!field) return true;
    let isValid = true;
    const value = (field.value || "").trim();
    if (field.id === "dob") {
      if (!value) {
        isValid = false;
      } else {
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        isValid = age >= 13;
      }
    } else if (field.id === "password") {
      isValid = value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
      // Constraint Validation API: setCustomValidity() for password strength
      field.setCustomValidity(isValid ? "" : "Password must be at least 8 characters with uppercase, lowercase and a digit.");
    } else if (field.id === "confirmPassword") {
      isValid = value.length > 0 && value === passwordInput.value;
      // Constraint Validation API: setCustomValidity() for password match
      field.setCustomValidity(isValid ? "" : "Passwords do not match.");
    } else if (field.id === "terms") {
      isValid = field.checked;
    } else {
      // Constraint Validation API: checkValidity() for HTML5 built-in rules
      isValid = field.checkValidity();
    }
    if (isValid) {
      field.setCustomValidity("");
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    } else {
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    }
    return isValid;
  }

  function updatePasswordMeter(value) {
    let strength = 0;
    if (value.length >= 6) strength += 25;
    if (value.length >= 8) strength += 25;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength += 25;
    if (/\d/.test(value)) strength += 25;
    passwordMeterBar.style.width = `${strength}%`;
    passwordMeterBar.className = "progress-bar";
    if (strength <= 25) {
      passwordMeterBar.classList.add("bg-danger");
      passwordFeedback.textContent = "Very weak password";
    } else if (strength <= 50) {
      passwordMeterBar.classList.add("bg-warning");
      passwordFeedback.textContent = "Moderate (add uppercase & digits)";
    } else if (strength <= 75) {
      passwordMeterBar.classList.add("bg-info");
      passwordFeedback.textContent = "Good password";
    } else {
      passwordMeterBar.classList.add("bg-success");
      passwordFeedback.textContent = "Strong password!";
    }
  }

  // Live input and blur validation event listeners
  const inputElements = form.querySelectorAll("input, select, textarea");
  inputElements.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.id === "password") {
        updatePasswordMeter(input.value);
        if (confirmPasswordInput.value) validateField(confirmPasswordInput);
      }
      if (input.classList.contains("is-invalid")) validateField(input);
    });
    if (input.type === "checkbox" || input.tagName === "SELECT") {
      input.addEventListener("change", () => validateField(input));
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let allValid = true;
    let firstInvalidField = null;
    inputElements.forEach((input) => {
      const fieldValid = validateField(input);
      if (!fieldValid && !firstInvalidField) {
        firstInvalidField = input;
        allValid = false;
      } else if (!fieldValid) {
        allValid = false;
      }
    });
    if (!allValid) {
      formAlert.className = "alert alert-danger mb-3";
      formAlert.textContent = "Please review and correct the highlighted fields before submitting.";
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }
    formAlert.className = "alert alert-success mb-3";
    formAlert.textContent = "All reader details are valid! Preparing registration confirmation...";
    const planNames = { basic: "Basic Plan (1 Book)", standard: "Standard Plan (3 Books)", premium: "Premium Plan (5 Books)" };
    const planText = planNames[form.subscriptionPlan.value] || form.subscriptionPlan.value;
    modalSummary.innerHTML = `
      <p class="mb-1"><strong>Reader Name:</strong> ${form.fullName.value}</p>
      <p class="mb-1"><strong>Email:</strong> ${form.email.value}</p>
      <p class="mb-1"><strong>Mobile:</strong> +91 ${form.mobile.value}</p>
      <p class="mb-1"><strong>Location:</strong> ${form.city.value} (${form.pincode.value})</p>
      <p class="mb-1"><strong>Membership Plan:</strong> ${planText}</p>
      <p class="mb-0"><strong>Preferred Category:</strong> ${form.bookCategory.value}</p>
    `;
    if (registrationModal) registrationModal.show();
  });

  document.getElementById("reset-btn")?.addEventListener("click", () => {
    form.reset();
    inputElements.forEach((input) => input.classList.remove("is-valid", "is-invalid"));
    formAlert.className = "alert d-none";
    passwordMeterBar.style.width = "0%";
    passwordMeterBar.className = "progress-bar bg-danger";
    passwordFeedback.textContent = "Min 8 characters with uppercase, lowercase & number.";
  });
});
