// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

// // Connect to MongoDB Atlas
// mongoose.connect('mongodb+srv://admin:admin@cluster0.4gycsvz.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//     console.log("Connected")
// }).catch((err) => {
//     console.log(err)
// })


// // Create a schema for user data
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//   });
  
//   // Create a model based on the schema
//   const User = mongoose.model('User', userSchema);
  
//   // Middleware
//   app.use(bodyParser.json());



//   // app.post('/api/users', async (req, res) => {
//   //   try {
//   //     // Create a new user instance
//   //     const newUser = new User(req.body);
//   //     console.log(newUser);
  
//   //     // Save the user data to MongoDB
//   //     await newUser.save();
  
//   //     res.status(201).json({ message: 'User data saved successfully' });
//   //   } catch (error) {
//   //     console.error(error);
//   //     res.status(500).json({ message: 'Internal Server Error' });
//   //   }
//   // });

  

// app.post('/api/users', async (req, res) => {
//     try {
//         // Check if the email already exists
//         const existingUser = await User.findOne({ email: req.body.email });

//         if (existingUser) {
//             // Email already exists, send an error response
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // Create a new user instance
//         const newUser = new User(req.body);
//         console.log(newUser);

//         // Save the user data to MongoDB
//         await newUser.save();

//         res.status(201).json({ message: 'User data saved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });



// app.post('/api/login', async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or email' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });




// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

mongoose.connect('mongodb+srv://admin:admin@cluster0.4gycsvz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB.");
}).catch((err) => {
    console.log(err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.post('/api/users', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
