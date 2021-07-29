const multer = require('multer');
const short = require('short-uuid');
const { v4: uuidv4 } = require('uuid');

const sendMail = require('../services/mailService');
const File = require('../models/fileModel');

// Set Storage Engine
let storageEng = multer.diskStorage({
  // Where we want to upload our file
  destination: (req, file, cb) => cb(null, 'uploads/'),

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const uniqueName = `user_${short.generate()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;
    //uniqueName- user_8ty5xQzehm3s3agePuHYqH-81553491.jpeg

    cb(null, uniqueName);
  },
});

// Init Upload
const upload = multer({
  storage: storageEng,
  limits: { fileSize: 1000000 * 100 },
});

// Uploading only single file
exports.uploadUserFile = upload.single('myfile'); //upload.single( 'field Name or key' )

exports.uploadFile = async (req, res, next) => {
  try {
    // init file
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });

    // store into database
    const response = await file.save();

    // Response->link
    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    // After above code link will show like this in the url bar
    // http://localhost:3000/files/54253gehwgdhsb-gdjcbj
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

  next();
};

/*
  console.log(req.file);
  {
    fieldname: 'myfile',
    originalname: 'Ganesh-Dev.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: '1627413865779-251591624.jpg',
    path: 'uploads\\1627413865779-251591624.jpg',
    size: 80540
  }

*/

// =====================================================================
// Sending Mail
exports.sendMail = async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  // Validate User
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required!' });
  }

  try {
    // Get data from db
    const file = await File.findOne({ uuid: uuid });

    // This if(file.sender) condition checks if the senders email is used only one time
    // if (file.sender) {
    //   return res.status(422).send({ error: 'Email already sent...' });
    // }

    file.sender = emailFrom;
    file.receiver = emailTo;

    // Save in the database
    const response = await file.save();

    sendMail
      .mailService({
        from: emailFrom,
        to: emailTo,
        subject: 'Alert! a file has been shared with you 😃',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
          emailFrom: emailFrom,
          downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
          size: parseInt(file.size / 1000) + ' KB',
          expires: '24 hours',
        }),
      })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ error: 'Error in email sending.' });
      });
  } catch (err) {
    return res
      .status(500)
      .send({ error: 'Something went wrong in fileController.' });
  }
};

/*
The HyperText Transfer Protocol (HTTP) 422 Unprocessable Entity response status code indicates that 
the server understands the content type of the request entity, and the syntax of the request entity is correct, 
but it was unable to process the contained instructions





http://localhost:5000/files/e2d801e3-ccbe-4965-acbe-f343591f821d?source=email
*/

/*
{
  "uuid":"5cc6da23-e3d9-450c-8a99-ed8e53da5a08",
  "emailTo":"nileshkr786@gmail.com",
  "emailFrom":"test1@gmail.com"
}
*/
