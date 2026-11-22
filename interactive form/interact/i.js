const form = document.getElementById('jobForm');
const panels = [...document.querySelectorAll('[data-panel]')];
const steps = [...document.querySelectorAll('.step')];
const progressFill = document.getElementById('progressFill');
const message = document.getElementById('message');
let currentStep = 0;

const personalFields = [
  ['firstName', 'First name'],
  ['lastName', 'Last name'],
  ['age', 'Age'],
  ['dob', 'Date of birth'],
  ['email', 'Email address'],
  ['phone', 'Phone number'],
  ['location', 'Location']
];
const professionalFields = [
  ['qualification', 'Highest qualification'],
  ['fieldOfStudy', 'Field of study'],
  ['experience', 'Years of experience'],
  ['jobRole', 'Preferred job role']
];

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.hidden = false;
}
function clearMessage() {
  message.textContent = '';
  message.className = 'message';
  message.hidden = true;
}
function showStep(stepIndex) {
  currentStep = stepIndex;
  panels.forEach((panel, index) => {
    const active = index === stepIndex;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
    step.classList.toggle('completed', index < stepIndex);
    const number = step.querySelector('.step-number');
    number.textContent = index < stepIndex ? '✓' : String(index + 1);
  });
  progressFill.style.width = `${(stepIndex / 2) * 100}%`;
  clearMessage();
  const heading = panels[stepIndex]?.querySelector('h2');
  if (heading) heading.setAttribute('tabindex', '-1'), heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setFieldError(field, text) {
  field.classList.toggle('invalid', Boolean(text));
  const error = field.closest('.field')?.querySelector('.field-error');
  if (error) error.textContent = text || '';
}
function validateStep(stepIndex) {
  clearMessage();
  let valid = true;
  const fields = stepIndex === 0 ? personalFields : professionalFields;

  fields.forEach(([id, label]) => {
    const field = document.getElementById(id);
    let error = '';
    if (!field.value.trim()) {
      error = `Please enter/select ${label.toLowerCase()}.`;
    } else if (id === 'age' && (Number(field.value) < 16 || Number(field.value) > 100)) {
      error = 'Age must be between 16 and 100.';
    } else if (id === 'email' && !field.validity.valid) {
      error = 'Enter a valid email address.';
    } else if (id === 'dob') {
      const birthDate = new Date(`${field.value}T00:00:00`);
      const today = new Date();
      if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
        error = 'Enter a valid date of birth that is not in the future.';
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age !== Number(document.getElementById('age').value)) {
          error = 'Your age does not match your date of birth.';
        }
      }
    } else if (id === 'phone' && !/^[+()\d\s.-]{7,20}$/.test(field.value.trim())) {
      error = 'Enter a valid phone number.';
    }
    setFieldError(field, error);
    if (error) valid = false;
  });

  if (stepIndex === 1) {
    const employment = form.querySelector('input[name="employmentType"]:checked');
    const employmentError = document.getElementById('employmentError');
    employmentError.textContent = employment ? '' : 'Please select an employment type.';
    if (!employment) valid = false;
  }
  if (!valid) showMessage('Please correct the highlighted fields before continuing.');
  return valid;
}
function valueOf(id) {
  return document.getElementById(id).value.trim();
}
function addReviewGroup(title, rows) {
  const groupTitle = document.createElement('h3');
  groupTitle.className = 'review-group-title';
  groupTitle.textContent = title;
  document.getElementById('review').appendChild(groupTitle);
  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'review-row';
    const labelNode = document.createElement('span');
    labelNode.className = 'review-label';
    labelNode.textContent = label;
    const valueNode = document.createElement('span');
    valueNode.className = 'review-value';
    valueNode.textContent = value || '—';
    row.append(labelNode, valueNode);
    document.getElementById('review').appendChild(row);
  });
}
function buildReview() {
  const review = document.getElementById('review');
  review.replaceChildren();
  addReviewGroup('Personal information', [
    ['Full name', `${valueOf('firstName')} ${valueOf('lastName')}`],
    ['Age', valueOf('age')],
    ['Date of birth', valueOf('dob')],
    ['Email address', valueOf('email')],
    ['Phone number', valueOf('phone')],
    ['Location', valueOf('location')]
  ]);
  addReviewGroup('Professional information', [
    ['Highest qualification', valueOf('qualification')],
    ['Field of study', valueOf('fieldOfStudy')],
    ['Years of experience', valueOf('experience')],
    ['Preferred job role', valueOf('jobRole')],
    ['Employment type', form.querySelector('input[name="employmentType"]:checked')?.value || '']
  ]);
}

document.querySelectorAll('[data-next]').forEach(button => {
  button.addEventListener('click', () => {
    const stepIndex = Number(button.dataset.next);
    if (!validateStep(stepIndex)) return;
    if (stepIndex === 1) buildReview();
    showStep(stepIndex + 1);
  });
});
document.querySelectorAll('[data-back]').forEach(button => {
  button.addEventListener('click', () => showStep(Number(button.dataset.back) - 1));
});

form.addEventListener('input', event => {
  if (event.target.matches('input, select')) {
    event.target.classList.remove('invalid');
    const error = event.target.closest('.field')?.querySelector('.field-error');
    if (error && event.target.name !== 'employmentType') error.textContent = '';
    if (event.target.name === 'employmentType') document.getElementById('employmentError').textContent = '';
  }
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateStep(1)) {
    showStep(1);
    return;
  }
  document.getElementById('successName').textContent = valueOf('firstName');
  showStep(3);
  steps.forEach(step => {
    step.classList.remove('active');
    step.classList.add('completed');
    step.querySelector('.step-number').textContent = '✓';
  });
  progressFill.style.width = '100%';
  showMessage('Demo complete. No data was sent to a server.', 'success');
});
document.getElementById('startAgain').addEventListener('click', () => {
  form.reset();
  form.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
  form.querySelectorAll('.field-error').forEach(error => error.textContent = '');
  document.getElementById('employmentError').textContent = '';
  document.getElementById('review').replaceChildren();
  showStep(0);
});
showStep(0);
