import sqlite from 'sqlite3';
import {Film, FilmLibrary} from './film_module.mjs';


//open the database 

const db= new sqlite.Database('films.db', (err)=>{
    if (err) throw err;
});

export const listFilm = () =>{
    return new Promise((resolve, reject) => {
        const sql= "SELECT * FROM FILMS";
        db.all(sql, [], (err, rows)=>{
            if (err)
                reject (err);
            else{
                const films= rows.map(q=>new Film(q.id,q.title,q.isFavorite, q.watchDate, q.rating, q.userId));
                resolve (films);
            }
        })
    })
}

export const filmFavorites = () =>{
    return new Promise((resolve, reject)=>{
        const sql= "Select * from Films where isFavorite=1";
        db.all(sql,[], (err,rows)=>{
            if (err)
                reject (err);
            else{
                const films= rows.map(q=>new Film(q.id,q.title,q.isFavorite, q.watchDate, q.rating, q.userId));
                resolve (films);
            }
        })
    })
}
