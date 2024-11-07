// script.js

class FormValidator {
  constructor() {
    this.form = document.getElementById("registrationForm");
    this.progressBar = document.getElementById("validationProgress");
    this.submitButton = this.form.querySelector('button[type="submit"]');

    // Inisialisasi state validasi
    this.validationState = {
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    this.setupEventListeners();
  }

  // Setup semua event listener
  setupEventListeners() {
    // Validasi Username
    const usernameInput = document.getElementById("username");
    usernameInput.addEventListener("input", () => this.validateUsername());
    usernameInput.addEventListener("blur", () => this.validateUsername(true));

    // Validasi Email
    const emailInput = document.getElementById("email");
    emailInput.addEventListener("input", () => this.validateEmail());
    emailInput.addEventListener("blur", () => this.validateEmail(true));

    // Validasi Password
    const passwordInput = document.getElementById("password");
    passwordInput.addEventListener("input", () => {
      this.validatePassword();
      this.validateConfirmPassword();
      this.updatePasswordStrength();
    });
    passwordInput.addEventListener("blur", () => this.validatePassword(true));

    // Validasi Konfirmasi Password
    const confirmPasswordInput = document.getElementById("confirmPassword");
    confirmPasswordInput.addEventListener("input", () =>
      this.validateConfirmPassword()
    );
    confirmPasswordInput.addEventListener("blur", () =>
      this.validateConfirmPassword(true)
    );

    // Toggle visibility password
    document
      .getElementById("togglePassword")
      .addEventListener("click", () =>
        this.togglePasswordVisibility("password", "togglePassword")
      );
    document
      .getElementById("toggleConfirmPassword")
      .addEventListener("click", () =>
        this.togglePasswordVisibility(
          "confirmPassword",
          "toggleConfirmPassword"
        )
      );

    // Submit form
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  // Validasi username
  validateUsername(showError = false) {
    const username = document.getElementById("username");
    const error = document.getElementById("usernameError");
    const requirements = username
      .closest(".form-group")
      .querySelectorAll(".requirement");

    const lengthValid =
      username.value.length >= 5 && username.value.length <= 20;
    const patternValid = /^[a-zA-Z0-9_]+$/.test(username.value);

    // Update tampilan requirement
    requirements[0].classList.toggle("valid", lengthValid);
    requirements[1].classList.toggle("valid", patternValid);

    if (username.value.length === 0) {
      error.textContent = showError ? "Username wajib diisi" : "";
      this.validationState.username = false;
    } else if (!lengthValid) {
      error.textContent = showError ? "Username harus 5-20 karakter" : "";
      this.validationState.username = false;
    } else if (!patternValid) {
      error.textContent = showError
        ? "Username hanya boleh berisi huruf, angka, dan underscore"
        : "";
      this.validationState.username = false;
    } else {
      error.textContent = "";
      this.validationState.username = true;
    }

    this.updateFormValidation();
  }

  // Validasi email
  validateEmail(showError = false) {
    const email = document.getElementById("email");
    const error = document.getElementById("emailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.length === 0) {
      error.textContent = showError ? "Email wajib diisi" : "";
      this.validationState.email = false;
    } else if (!emailRegex.test(email.value)) {
      error.textContent = showError ? "Format email tidak valid" : "";
      this.validationState.email = false;
    } else {
      error.textContent = "";
      this.validationState.email = true;
    }

    this.updateFormValidation();
  }

  // Validasi password
  validatePassword(showError = false) {
    const password = document.getElementById("password");
    const requirements = password
      .closest(".form-group")
      .querySelectorAll(".requirement");

    const lengthValid = password.value.length >= 8;
    const numberValid = /[0-9]/.test(password.value);
    const lowercaseValid = /[a-z]/.test(password.value);
    const uppercaseValid = /[A-Z]/.test(password.value);

    // Update tampilan requirements
    requirements[0].classList.toggle("valid", lengthValid);
    requirements[1].classList.toggle("valid", numberValid);
    requirements[2].classList.toggle("valid", lowercaseValid);
    requirements[3].classList.toggle("valid", uppercaseValid);

    this.validationState.password =
      lengthValid && numberValid && lowercaseValid && uppercaseValid;
    this.updateFormValidation();
  }

  // Validasi konfirmasi password
  validateConfirmPassword(showError = false) {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const error = document.getElementById("confirmPasswordError");

    if (confirmPassword.value.length === 0) {
      error.textContent = showError ? "Konfirmasi password wajib diisi" : "";
      this.validationState.confirmPassword = false;
    } else if (confirmPassword.value !== password.value) {
      error.textContent = showError ? "Password tidak cocok" : "";
      this.validationState.confirmPassword = false;
    } else {
      error.textContent = "";
      this.validationState.confirmPassword = true;
    }

    this.updateFormValidation();
  }

  // Update kekuatan password
  updatePasswordStrength() {
    const password = document.getElementById("password").value;
    const strengthIndicator = document.getElementById("strengthIndicator");
    const strengthText = document.getElementById("strengthText");

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthIndicator.className = "strength-indicator";
    switch (strength) {
      case 0:
      case 1:
        strengthIndicator.classList.add("strength-weak");
        strengthIndicator.style.width = "20%";
        strengthText.textContent = "Lemah";
        break;
      case 2:
      case 3:
        strengthIndicator.classList.add("strength-medium");
        strengthIndicator.style.width = "60%";
        strengthText.textContent = "Sedang";
        break;
      case 4:
      case 5:
        strengthIndicator.classList.add("strength-strong");
        strengthIndicator.style.width = "100%";
        strengthText.textContent = "Kuat";
        break;
    }
  }

  // Toggle visibilitas password
  togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    const icon = toggle.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.className = "fas fa-eye-slash";
    } else {
      input.type = "password";
      icon.className = "fas fa-eye";
    }
  }

  // Update progress bar dan status validasi form
  updateFormValidation() {
    const totalFields = Object.keys(this.validationState).length;
    const validFields = Object.values(this.validationState).filter(
      Boolean
    ).length;
    const progress = (validFields / totalFields) * 100;

    this.progressBar.style.width = `${progress}%`;
    this.submitButton.disabled = validFields !== totalFields;
  }

  // Handle submit form
  handleSubmit(e) {
    e.preventDefault();

    if (Object.values(this.validationState).every(Boolean)) {
      // Simulasi pengiriman data
      const formData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      // Tampilkan pesan sukses
      alert("Pendaftaran berhasil! Data telah dikirim.");
      this.form.reset();
      this.resetValidation();
    }
  }

  // Reset semua validasi
  resetValidation() {
    Object.keys(this.validationState).forEach((key) => {
      this.validationState[key] = false;
    });

    this.progressBar.style.width = "0%";
    this.submitButton.disabled = true;

    document.querySelectorAll(".requirement").forEach((req) => {
      req.classList.remove("valid");
    });

    document.querySelectorAll(".validation-message").forEach((msg) => {
      msg.textContent = "";
    });

    document.getElementById("strengthIndicator").style.width = "0%";
    document.getElementById("strengthText").textContent = "Kekuatan Password";
  }
}

// Inisialisasi validator saat dokumen dimuat
document.addEventListener("DOMContentLoaded", () => {
  new FormValidator();
});
