import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.mjs';

const app = express();
const port = process.env.PORT || 4000;

// ข้อมูลที่จะส่งกลับ
const data = {
    "data": {
        "name": "john",
        "age": 20
    }
}

app.use(cors());  
app.use(express.json());  

app.use('/posts',postsRouter)

app.get('/', (req, res) => {
    return res.send('Hello'); 
});

app.get('/profiles', (req, res) => {
    return res.json(data); 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
