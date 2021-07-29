const mongoose = require('mongoose');
const dotenv = require('dotenv');

const File = require('./models/fileModel');
const fs = require('fs');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

exports.Connect = mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!!!');
  });

// Get all records older than 24 hours
const DeleteData = async () => {
  const pastDate = new Date(Date.now() - 20 * 60 * 1000);
  const files = await File.find({ createdAt: { $lt: pastDate } });

  if (files.length) {
    for (const each_file of files) {
      try {
        // fs.unlinkSync(each_file.path);
        await each_file.remove();
        console.log(`successfully deleted ${each_file.filename}`);
      } catch (err) {
        console.log(`Error while deleting file: ${err}`);
      }
    }
  }
  // console.log('Removed Successfully!');
};

DeleteData().then(() => {
  console.log('Removed files older than 24 hours!!');
  // process.exit();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
