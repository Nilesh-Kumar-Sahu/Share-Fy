const dropZone = document.querySelector('.drop-zone');
const browseOption = document.querySelector('.browseOption');
const fileInput = document.querySelector('#fileinput');

const sharingContainer = document.querySelector('.sharing-container');
const loadingIcon = document.querySelector('.loading-icon');
const UploadSpinner = document.querySelector('.upload-spinner');
const fileURLInput = document.querySelector('#fileURL');
const emailForm = document.querySelector('#emailform');
const copyBtn = document.querySelector('#copyBtn');

// Showing Toast to the user
const customToast = document.querySelector('.custom-toast');

// Creating _classToast
class _classToast {
  constructor() {
    this.removeTimeout = null;
    this.el = document.createElement('div');
    this.el.className = 'show-toast';
    customToast.appendChild(this.el);
  }

  show(message, state) {
    clearTimeout(this.removeTimeout);

    this.el.textContent = message;
    this.el.className = 'show-toast toast--visible';

    if (state) {
      this.el.classList.add(`toast--${state}`);
    }

    this.removeTimeout = setTimeout(() => {
      this.el.classList.remove('toast--visible');
    }, 6000);
  }
}

// Creating a new Toast obj
const Toast = new _classToast();
Toast.show('Welcome 🤗');

const host = 'https://share-fy.herokuapp.com/';

const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains('dragged')) {
    dropZone.classList.add('dragged');
  }
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragged');
  const files = e.dataTransfer.files;

  if (files.length != 0) {
    fileInput.files = files;
    uploadFile();
  }
});

browseOption.addEventListener('click', (e) => {
  fileInput.click();
  resetFileURLInput();
});

fileInput.addEventListener('change', () => {
  uploadFile();
});

// sharing container listeners
copyBtn.addEventListener('click', () => {
  fileURLInput.select();
  document.execCommand('copy');
  Toast.show('Copied to clipboard! 👍', 'success');
});

const resetFileInput = () => {
  fileInput.value = '';
};

const resetFileURLInput = () => {
  fileURLInput.value = '';
};

// ================UPLOAD================
const uploadFile = () => {
  UploadSpinner.style.display = 'block';

  // User can upload only one file
  if (fileInput.files.length > 1) {
    resetFileInput();
    Toast.show('Upload 1 file only!', 'error');
    UploadSpinner.style.display = 'none';
    return;
  }
  const file = fileInput.files[0];

  if (file.size > maxAllowedSize) {
    resetFileInput();
    Toast.show('Cannot upload file more than 100MB! 😔', 'error');
    UploadSpinner.style.display = 'none';
    return;
  }

  const formData = new FormData();

  formData.append('myfile', file); //.append('field Name',file)

  const options = {
    method: 'POST',
    body: formData,
  };

  const request = fetch(uploadURL, options);
  request
    .then((res) => res.json())
    .then((data) => {
      UploadSpinner.style.display = 'none';
      showLink(data.file);
    })
    .catch((err) => {
      resetFileInput();
      Toast.show('Sorry, there was a problem in upload! 😔', 'error');
    });
};

// ================Showing the link================
const showLink = (url) => {
  resetFileInput(); //remove previous input
  sharingContainer.style.display = 'block';
  fileURLInput.value = url;
};

// ================Submitting email================
emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadingIcon.removeAttribute('id');

  const url = fileURLInput.value;
  const formData = {
    uuid: url.split('/').splice(-1, 1)[0],
    emailTo: emailForm.elements['to-email'].value,
    emailFrom: emailForm.elements['from-email'].value,
  };

  fetch(emailURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData), //JS object changes into JSON
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        sharingContainer.style.display = 'none';
        loadingIcon.setAttribute('id', 'hide');
        Toast.show('Email sent successfully! 👍', 'success');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
