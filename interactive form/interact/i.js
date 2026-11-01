const form = document.getElementById('jobform');
const panels = [...document.querySelectorAll('[data-panel]')];
const steps = [...document.querySelectorAll('.step')];
const progressFill = document.getElementById(progressFill);
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
    ['fieldofStudy', 'Field of study'],
    ['experience', 'Years of experience'],
    ['jobRole', 'Preferred job role']
];

function showMessage(text, type = 'error'){
    message.textContent = text;
    message.className = 'message $(type)';
    message.hidden = false;
}

function clearMessage(){
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