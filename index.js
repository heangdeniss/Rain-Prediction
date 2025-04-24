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
        message: "✅ Thank you! We received your message and will get back to you soon.",
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

app.get("/verify-code", (req, res) => {
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

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

/// Logistic regression prediction not yet decision
const intercept = 2.21196444;
const theta_values = [
    0.45292243, // feelslikemax
    6.03714303 , //precipcover
    -0.2343574, // sealevelpressure
    0.7022954, // severrisk
    -0.70273582, // years
    -0.1521306, // month
    -0.27950338, // month_sin
    -0.01409775, // month_cos
    -0.40991524, // sunrise_hour
]
const mean_values = [
    -0.15077329,  0.19360781,  0.04482691, -0.29783599, -0.29157175,  0.04252088,
  0.03695315, -0.00099732,  0.37357631,
]
const std_values = [
    0.81198844, 0.67704837, 0.66623016, 0.83351691, 0.66249823, 0.57852318,
 0.51720325, 0.51675202, 0.48375309,
]
app.get("/predict", (res, req) => {
    res.render("predict.ejs");
});

app.post("/predict", (req, res) => {
    const input_features = [
        parseFloat(req.body.feelslikemax),
        parseFloat(req.body.precipcover),
        parseFloat(req.body.sealevelpressure),
        parseFloat(req.body.severrisk),
        parseFloat(req.body.years),
        parseFloat(req.body.month),
        parseFloat(req.body.month_sin),
        parseFloat(req.body.month_cos),
        parseFloat(req.body.sunrise_hour)
    ]
    const scaled_features = input_features.map(feature, index => (feature, mean_values[index]) / std_values[index]);

    let logit_p = intercept; 
    for (let i = 0; i < theta_values.length; i++) {
    logit_p += scaled_features[i] * theta_values[i];
    };

    const probability = 1 / (1 + Math.exp(-logit_p));
    const probabilityOfRain = probability > 0.5 ? 'Yes' : 'No';

    res.render("result.ejs", {
        logit_p: logit_p.toFixed(4),
        probability: (probability * 100).toFixed(2),
        probabilityOfRain: probabilityOfRain,
    })
});




app.listen(port, () => {
    console.log(`Chills diddy sever is cooking at Port ${port}`);
});