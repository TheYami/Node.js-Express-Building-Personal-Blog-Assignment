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

app.get('/posts',async (req,res)=>{
    try{
        const page = req.query.page || 1
        const PAGE_SIZE = 6
        const category = req.query.category
        const keyword = req.query.keyword

        const offset = (page-1)*PAGE_SIZE

        let query = `select * from posts`
        let values = [];

        if(keyword && category){
            query += ' where category ilike $1 and title ilike $2 limit $3 offset $4';
            values = [`%${category}%`, `%${keyword}%`, PAGE_SIZE, offset]
        }else if(keyword){
            query += ' where title ilike $1 limit $2 offset $3';
            values = [`%${keyword}%`, PAGE_SIZE, offset]
        }else if(category){
            query += ' where category ilike $1 limit $2 offset $4';
            values = [`%${category}%`, PAGE_SIZE, offset]
        }else{
            query += ' limit $1 offset $2';
            values = [PAGE_SIZE, offset]
        }

        const results = await connectionPool.query(query,values)

        return res.status(200).json({data:results.rows})

    }catch(error){
        console.log(error);
        return res.status(500).json({"message": "Server could not read post because database connection"})
    }

})

app.get('/posts/:postId',async(req,res)=>{
    const postIdFromClient = req.params.postId

    try{
        const results = await connectionPool.query(
            `select * from posts where id = $1`
            ,[postIdFromClient]
        )

        if(!results.rows[0]){
            return res.status(404).json({ "message": "Server could not find a requested post" })
        }

        return res.status(201).json({data:results.rows[0]})

    }catch(error){
        res.status(500).json({ "message": "Server could not read post because database connection" })
    }

})

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


app.put('/posts/:postId', async(req,res)=>{
    const postIdFromClient = req.params.postId

    const updatedPost = {
        ...req.body,
        updated_at: new Date()
    }

    try{
        await connectionPool.query(
            `
            update posts
            set title = $2,
                image = $3,
                category_id = $4,
                description = $5,
                content = $6,
                status_id = $7
            where id = $1
            `,
            [
                postIdFromClient,
                updatedPost.title,
                updatedPost.image,
                updatedPost.category_id,
                updatedPost.description,
                updatedPost.content,
                updatedPost.status_id,
            ]
        )

        return res.status(200).json({ "message": "Updated post sucessfully" })

    }catch(error){
        console.log(error);
        return res.status(500).json({ "message": "Server could not update post because database connection" })
    }

})

app.delete('/posts/:postId', async(req,res)=>{
    const postIdFromClient = req.params.postId

    try{
        await connectionPool.query(
            `
                delete from posts where id = $1
            `,
            [postIdFromClient]
        )

        return res.status(200).json({ "message": "Deleted post sucessfully" })
    }catch(error){
        console.log(error);
        return res.status(500).json({ "message": "Server could not delete post because database connection" })
    }
})