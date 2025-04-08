import express from "express"
import bodyParser from "body-parser"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';

const app = express();
const port = 5000; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Path to message, users file
const messageFile = path.join(__dirname, 'messages.json');
const userFile = path.join(__dirname, 'users.json');

// file path to public
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true}));

// render welcome page
app.get("/", (req, res) => {
    res.render("index.ejs");
})
// display services
app.get("/services", (req, res) => {
    res.render("services.ejs");
});
// Read messages from file
function readMessages() {
    try {
        const data = fs.readFileSync(messageFile, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading messages:', err);
        return [];
    }
}
// Save messages
function saveMessages(messages) {
    fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
}
// render contact page
app.get("/contact", (req, res) => {
    res.render("contact.ejs", {
        name: req.query.name || '',
        email: req.query.email || '',
        message: req.query.message || ''
    });
});
// handle contact form submission
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    const messages = readMessages();
    messages.push({
        name,
        email,
        message,
        date: new Date().toISOString()
    });
    saveMessages(messages);
    res.render("contact.ejs", {
        name,
        email,
        message: "✅ Thank you! We received your message and will get back to you soon."
    });
});


// render registeration files
app.get("/register", (req, res) => {
    res.render("register.ejs", {
        name: req.query.name || '',
        email: req.query.email || '',
        message: req.query.message || ''
    });
});
// handle register 
app.post("/register", (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.redirect(`/register?message=All fields are required.&name=${name}&email=${email}`);
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 8 || !specialCharRegex.test(password)) {
        return res.redirect(`/register?message=Password must be at least 8 characters and contain a special character.&name=${name}&email=${email}`);
    }

    if (password !== confirmPassword) {
        return res.redirect(`/register?message=Passwords do not match.&name=${name}&email=${email}`);
    }

    const users = readUsers();

    if (users[email]) {
        return res.redirect(`/register?message=Email already exists.&email=${email}`);
    }

    // real time date
    const registrationDate = new Date().toISOString();

    users[email] = {
        name,
        password,
        registrationDate
    };
    // save user to user.json file
    saveUsers(users);

    return res.redirect(`/login?email=${email}&message=Registration successful. Please log in.`);
});

// Read users from file
function readUsers() {
    const data = fs.readFileSync(userFile);
    return JSON.parse(data);
}

// Save users to file
function saveUsers(users) {
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

app.get("/login", (req, res) => {
    res.render("login.ejs", {
        email: req.query.email || '',
        message: req.query.message || ''
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    if (users[email] && users[email].password === password) {
        res.render("index1.ejs", {
            email,
            message: "Login successful."
        });
    } else {
        res.redirect(`/login?email=${email}&message=Invalid email or password.`);
    }
});

app.get("/forgot-password", (req, res) => {
    const message = req.query.message || '';  // Retrieve message if any
    res.render("forgot-password.ejs", { message: message });
});

app.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    const users = readUsers();

    if (!users[email]) {
        return res.redirect(`/forgot-password?message=Email not found.`);
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    users[email].verificationCode = verificationCode;
    saveUsers(users);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.redirect(`/forgot-password?message=Error sending email.`);
        }
        res.redirect(`/verify-code?email=${email}`);
    });
});

app.get("/forgot-password/verify-code", (req, res) => {
    const { email } = req.query;
    res.render("verify-code.ejs", { email: email });
});

app.post("/verify-code", (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    const users = readUsers();

    if (users[email] && users[email].verificationCode == verificationCode) {
        // Update the password
        users[email].password = newPassword;
        delete users[email].verificationCode; // Remove the verification code
        saveUsers(users);
        res.redirect("/login");
    } else {
        res.redirect(`/verify-code?email=${email}&message=Invalid verification code.`);
    }
});




app.listen(port, () => {
    console.log(`Chills diddy sever is cooking at Port ${port}`);
});