import express from 'express';
import morgan from 'morgan';
import { listFilm } from './dao.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));


app.get('api/films', (request, response)=>{
    listFilm()
    .then(films=> response.json(response))
    .catch(error => {
        console.error("Error:", error);
        response.status(500).json({ error: 'Internal server error' });
    });
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});