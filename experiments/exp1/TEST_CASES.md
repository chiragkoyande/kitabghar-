# Test Cases for Experiment 1: Kitab Ghar Reader Registration

| Test ID | Scenario | Test Input | Expected Result |
|---|---|---|---|
| E1-01 | Empty Form Submission | Submit form with all fields empty | Required controls show `.is-invalid` classes and a summary alert is displayed. |
| E1-02 | Invalid Email Format | `reader@` | Email field is flagged as invalid with message. |
| E1-03 | Invalid Mobile Number | `5123456789` | Mobile field rejected (must start with 6, 7, 8, or 9). |
| E1-04 | Invalid Pincode | `42150` | Pincode field rejected (must be 6 digits). |
| E1-05 | Underage Date of Birth | Date corresponding to 12-year-old | Minimum 13-year age rule rejects date. |
| E1-06 | Weak Password | `weakpass` | Password rejected and strength meter reflects weak level. |
| E1-07 | Mismatched Password Confirmation | Passwords `StrongPass1` and `Different1` | Confirmation field flagged as invalid. |
| E1-08 | Unchecked Terms | Valid form with terms unchecked | Terms checkbox shows invalid state and prevents submission. |
| E1-09 | Valid Registration Submission | Complete valid reader profile | Form validates successfully and Bootstrap confirmation modal displays reader details. |
| E1-10 | Mobile Viewport Responsiveness | 320px × 900px viewport | Form adapts without horizontal overflow using single-column layout. |
