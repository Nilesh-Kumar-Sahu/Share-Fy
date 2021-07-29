const dropZone = document.querySelector('.drop-zone');
const browsebtn = document.querySelector('.browsebtn');
const fileInput = document.querySelector('#fileinput');

const sharingContainer = document.querySelector('.sharing-container');
const loadingIcon = document.querySelector('.loading-icon');
const fileURL = document.querySelector('#fileURL');
const emailForm = document.querySelector('#emailform');
const copyBtn = document.querySelector('#copyBtn');
// const sendBtn = document.querySelector('.sendBtn');

const toast = document.querySelector('.toast');

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
  // console.log(e);
  // console.log(e.dataTransfer.files);
  const files = e.dataTransfer.files;
  // console.log(files);

  // console.log(fileInput);
  if (files.length != 0) {
    // console.log(fileInput.files);

    fileInput.files = files;

    //upload function defined below
    uploadFile();
  }
});

browsebtn.addEventListener('click', (e) => {
  fileInput.click();
});

fileinput.addEventListener('change', () => {
  uploadFile();
});

// sharing container listenrs
copyBtn.addEventListener('click', () => {
  fileURL.select();
  document.execCommand('copy');
  showToast('Copied to clipboard');
});

// ============================UPLOAD============================
const uploadFile = () => {
  // User can upload only one file
  if (fileInput.files.length > 1) {
    resetFileInput();
    showToast('Upload 1 file only!');
    return;
  }
  const file = fileInput.files[0];

  if (file.size > maxAllowedSize) {
    showToast("Can't upload more than 100MB");
    resetFileInput();
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
      showLink(data.file);
      // console.log(data);
    })
    .catch((err) => {
      showToast(`Error in upload: ${err.status}`);
    });
};

const showLink = (url) => {
  resetFileInput(); //remove previous input
  emailForm[2].removeAttribute('disabled'); //now button is showing
  sharingContainer.style.display = 'block';
  fileURL.value = url;
};

const resetFileInput = () => {
  fileinput.value = '';
};

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loadingIcon.removeAttribute('id');
  // loadingIcon.style.display = 'block';

  const url = fileURL.value;
  const formData = {
    uuid: url.split('/').splice(-1, 1)[0],
    emailTo: emailForm.elements['to-email'].value,
    emailFrom: emailForm.elements['from-email'].value,
  };

  emailForm[2].setAttribute('disabled', 'true');
  // console.table(formData);

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

        // loadingIcon.style.display = 'none';
        showToast('Email sent');
      }
    });
});

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = 'translate(-50%,0)';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = 'translate(-50%,60px)';
  }, 2000);
};

// nileshkumar42490@gmail.com
