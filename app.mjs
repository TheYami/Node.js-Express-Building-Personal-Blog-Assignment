import express from 'express';
import cors from 'cors';

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

app.get('/profiles', (req, res) => {
    return res.json(data); 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});