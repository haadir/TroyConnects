const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let profiles = [];

let premadeProfiles = [
    { name: "Haadi", major: "CSCI", projectIdea: "Building tools for USC students.", keywords: ["tools", "USC", "students"] },
    { name: "Priyansh", major: "CSCI", projectIdea: "Backend development in Python and Java.", keywords: ["backend", "python", "java"] },
    { name: "Cameron", major: "CSBA", projectIdea: "Full-stack development with C++, MongoDB, SQL.", keywords: ["full-stack", "c++", "mongodb", "sql"] },
    { name: "Bob", major: "Business", projectIdea: "Product management for new startups.", keywords: ["product", "management", "startups"] },
    { name: "Sarah", major: "Data Science", projectIdea: "Data analysis in Python.", keywords: ["data", "analysis", "python"] },
    { name: "Josh", major: "UI/UX", projectIdea: "UI/UX design and Frontend development with HTML, CSS, React.", keywords: ["ui/ux", "frontend", "html", "css", "react"] }
  ];
  

  app.get('/match-profiles', (req, res) => {
    const userKeywords = req.query.keywords.split(',').map(keyword => keyword.trim().toLowerCase());
    const getMatches = profile => {
      return profile.keywords.filter(keyword => userKeywords.includes(keyword)).length;
    };
    
    const matches = premadeProfiles
      .map(profile => ({
        ...profile,
        matchCount: getMatches(profile)
      }))
      .filter(profile => profile.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);
    
    res.json(matches);
  });
  

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.post('/submit-profile', (req, res) => {
    const { name, major, projectIdea, lookingFor } = req.body;
    const keywords = lookingFor.split(',').map(keyword => keyword.trim().toLowerCase());
    const newProfile = { name, major, projectIdea, lookingFor, keywords };
    profiles.push(newProfile);
    console.log(newProfile);

    res.json({ success: true, keywords: lookingFor });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
