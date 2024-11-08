import express from 'express';
import cors from 'cors';
import connectionPool from './utils/db.mjs';

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

app.get('/', (req, res) => {
    return res.send('Hello'); 
});

app.get('/profiles', (req, res) => {
    return res.json(data); 
});

app.post("/posts", async (req,res)=>{
    const newPosts = {
        ...req.body,
        created_at:new Date(),
        updated_at:new Date(),
        published_at:new Date()
    }

    try{
        await connectionPool.query(
            `INSERT INTO posts (title, image ,category_id, description, content, status_id)
             VALUES($1,$2,$3,$4,$5,$6)`,
             [
                newPosts.title,
                newPosts.image,
                newPosts.category_id,
                newPosts.description,
                newPosts.content,
                newPosts.status_id
             ]
        )
    }catch{
        res.status(500).json(   { "message": "Server could not create post because database connection" })
    }

    res.status(200).json(  { "message": "Created post sucessfully" })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
