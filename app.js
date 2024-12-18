const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 

const API_KEY = process.env.API_KEY;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/add_filter',async(req,res) => {
    const {title,year} = req.body; 

    console.log(`title : ${title} year: ${year}`); 
    try {
      let query = `http://www.omdbapi.com/?apikey=${API_KEY}`;
      if (title) query += `&t=${encodeURIComponent(title)}`;
      if (year !== '') query += `&y=${year}`;

      console.log('final url is ',query); 
  
      const omdbResponse = await fetch(query);
      const data = await omdbResponse.json();
  
      console.log('OMDB Response:', data);
  
      if (data.Response === 'False') {
        return res.status(404).json({ error: data.Error });
      }
  
      // Send full OMDB response back (filter on frontend)
      res.json({ message: 'Data retrieved successfully', data: [data] });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
    
})

app.post('/fetch_request', async (req, res) => {
  const { title } = req.body;
  console.log('title is ',title); 
  try {
    let omdbResponse;
    if (title) {
      omdbResponse = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
    } else {
      omdbResponse = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=top`);
    }

    const data = await omdbResponse.json();
    
    console.log(data); 

    if (data.Response === 'False') {
      return res.status(404).json({ error: data.Error });
    }

    res.json({ message: 'Data retrieved successfully', data });
  } catch (error) {
    console.error('Error fetching data from OMDb API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
