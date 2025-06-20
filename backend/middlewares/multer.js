import multer from "multer";

// //You are creating a storage engine using multer.diskStorage.

const storage=multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload=multer({storage})

export default upload

// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads/"); // or "public/uploads/" depending on your structure
//   },
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + "-" + file.originalname); // avoids filename conflicts
//   },
// });

// const upload = multer({ storage });

// export default upload;




// import multer from "multer";

// // Configure disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, 'uploads/'); // Folder where files will be stored
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname); // or use Date.now() + file.originalname to avoid duplicates
//   }
// });

// // Initialize multer with the storage config
// const upload = multer({ storage });

// export default upload;


// In Node.js, callbacks follow a standard pattern:

// callback(error, result);


// diskStorage	Disk	❌ No	⚠️ Only if you delete later
// dest: 'uploads/'	Disk	❌ No	⚠️ Same as above

// multer.diskStorage() lets you store uploaded files directly on the disk (your server’s file system).

// It takes an object with configuration options. Here, you're defining one of the options: filename.

// ✳️ filename:

// filename: function(req, file, callback) {
//     callback(null, file.originalname)
// }
// req: the HTTP request object.

// file: the uploaded file object.

// callback: a function to tell Multer what name to give to the uploaded file.

// 👉 You are telling Multer:
// “Use the original name of the file as it was on the client machine.”

// Example:
// If a user uploads a file called resume.pdf, Multer will save it on the server as resume.pdf.

// 📝 Note: You haven't set the destination field here, so Multer will use the default temp directory or throw an error unless destination is handled elsewhere in your code.


// const upload = multer({ storage });
// Here, you are creating the actual upload middleware using your custom storage configuration.

// Now, upload is a middleware function you can use in your Express routes like this:
// app.post('/upload', upload.single('file'), (req, res) => {
//     res.send("File uploaded successfully");
// });
// upload.single('file'): allows uploading a single file, where 'file' is the name of the form field used to send the file.