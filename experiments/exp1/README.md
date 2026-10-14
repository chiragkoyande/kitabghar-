# Experiment 1: Responsive Registration Form using Bootstrap & JavaScript Validation

## Kitab Ghar Case Study Context
In the Kitab Ghar Badlapur book rental platform, reader registration collects customer identity, delivery addresses, and initial membership preferences. This standalone practical demonstrates client-side form controls, responsive Bootstrap grid layouts, and JavaScript validation rules prior to server submission.

## Requirements Demonstrated
1. **Responsive Registration Form**: Semantic HTML5 form controls arranged using Bootstrap 5 grid classes (`row`, `col-12`, `col-md-6`) adapting seamlessly across desktop, tablet, and mobile viewports.
2. **Bootstrap Validation States**: Visual feedback via `.is-valid` and `.is-invalid` classes, form alerts, and feedback tooltips.
3. **JavaScript Client-Side Validation**:
   - Required field checks.
   - Email format validation.
   - Indian mobile number validation (10 digits starting with 6, 7, 8, or 9).
   - Minimum reader age verification (13 years or older).
   - 6-digit postal pincode validation.
   - Dynamic password strength meter (minimum 8 characters with uppercase, lowercase, and digits).
   - Password confirmation matching.
   - Terms and conditions acceptance check.
   - Accessible error focus handling and Bootstrap confirmation modal on successful submission.

## How to Run
```bash
# Start a local static HTTP server in this directory
python3 -m http.server 4173 --directory experiments/exp1
```
Open `http://localhost:4173` in a web browser.
