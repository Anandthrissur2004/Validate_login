"use strict";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getError(form, fieldName) {
  return form.querySelector(`[data-error-for="${fieldName}"]`);
}

function getField(form, fieldName) {
  return form.elements.namedItem(fieldName);
}

function validateField(form, fieldName) {
  const field = getField(form, fieldName);
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = "This field is required.";
  } else if (fieldName === "email" && !emailPattern.test(value)) {
    message = "Enter a valid email address.";
  } else if (form.dataset.validate === "registration" && fieldName === "password") {
    if (value.length < 8 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
      message = "Use at least 8 characters with an uppercase letter, a lowercase letter, and a number.";
    }
  } else if (form.dataset.validate === "registration" && fieldName === "confirmPassword") {
    if (value !== getField(form, "password").value) {
      message = "Passwords do not match.";
    }
  }

  const error = getError(form, fieldName);
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

document.querySelectorAll("form[data-validate]").forEach((form) => {
  const fields = Array.from(form.querySelectorAll("input"));
  const message = form.querySelector("[data-form-message]");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(form, field.name);
      if (field.name === "password" && form.dataset.validate === "registration" &&
          getField(form, "confirmPassword").value) {
        validateField(form, "confirmPassword");
      }
      message.textContent = "";
      message.classList.remove("success");
    });

    field.addEventListener("blur", () => validateField(form, field.name));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = fields.filter((field) => !validateField(form, field.name));

    if (invalidFields.length) {
      message.textContent = "Please correct the highlighted fields.";
      message.classList.remove("success");
      invalidFields[0].focus();
      return;
    }

    message.textContent = "Validation passed.";
    message.classList.add("success");
  });
});
