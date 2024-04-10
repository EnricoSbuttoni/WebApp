
import dayjs from "dayjs";
import sqlite from "sqlite3"
const db=new sqlite.Database('films.db', (err)=>{if(err) throw err;});
function Film(id, title, isFavorite = false, watchDate = null, rating = 0, userId = 1) {
  this.id = id;
  this.title = title;
  if(isFavorite===1){
    isFavorite=true;
  }
  this.rating = rating;
  // saved as dayjs object only if watchDate is truthy
  this.watchDate = watchDate && dayjs(watchDate);
  this.userId = userId

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Title: ${this.title}, Favorite: ${this.favorite}, ` +
    `Watch date: ${this.watchDate}, Score: ${this.rating}, ` +
    `User: ${this.userId}` ;
  }
}


function FilmLibrary() {
  this.list = [];

  this.addNewFilm = (film) => {
    if(!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicate id');
  };

  this.deleteFilm = (id) => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.id !== id;
    })
    this.list = newList;
  }

  this.resetWatchedFilms = () => {
    this.list.forEach((film) => delete film.watchDate);
  }

  this.getRated = () => {
    const newList = this.list.filter(function(film, index, arr) {
      return film.rating > 0;
    })
    return newList;
  }

  this.sortByDate = () => {
    const newArray = [...this.list];
    newArray.sort((d1, d2) => {
      if(!(d1.watchDate)) return  1;   // null/empty watchDate is the lower value
      if(!(d2.watchDate)) return -1;
      return d1.watchDate.diff(d2.watchDate, 'day')
    });
    return newArray;
  }
  this.insertFromDatabase=()=>{
    return new Promise((resolve,reject)=>{
      const sql='Select * from films';
      db.all(sql,[], (err,rows)=>{
        if (err) reject(err);
        else{
          const films = rows.map(row => new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId));
          for(const film of films){
            this.addNewFilm(film);
          }
          resolve (this.list);
        }
      })
    })
  }
  this.getFavorites=()=>{
    return new Promise((resolve,reject)=>{
      const list1=[]
      const sql= "Select * from films where isFavorite=1";
      db.all(sql,[],(err,rows)=>{
        if (err) reject(err);
        else{
          rows.map((row)=>{
            let film= new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId);
            list1.push(film);
          })
          resolve(list1);
        }
            })
    })
  }
  this.getToday=()=>{
    return new Promise((resolve,reject)=>{
      const list1=[];
      let f=dayjs();
      f=f.format('YYYY-MM-DD');
      const sql= "Select * from films where watchDate=?";
      db.all(sql,[f],(err,rows)=>{
        if (err) reject(err);
        else{
          rows.map((row)=>{
            let film= new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId);
            list1.push(film);
          })
          resolve(list1);
        }
            })
    })
  }
  this.getBefore=(data)=>{
    return new Promise((resolve,reject)=>{
      const list1=[];
      const sql= "Select * from films where watchDate<?";
      db.all(sql,[data],(err,rows)=>{
        if (err) reject(err);
        else{
          rows.map((row)=>{
            let film= new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId);
            list1.push(film);
          })
          resolve(list1);
        }
            })
    })
  }
  this.getRated1=(rate)=>{
    return new Promise((resolve,reject)=>{
      const list1=[];
      const sql= "Select * from films where rating>?";
      db.all(sql,[rate],(err,rows)=>{
        if (err) reject(err);
        else{
          rows.map((row)=>{
            let film= new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId);
            list1.push(film);
          })
          resolve(list1);
        }
            })
    })
  }
  this.contains=(stringa)=>{
    return new Promise((resolve,reject)=>{
      const list1=[];
      const sql= "Select * from films where title LIKE ?";
      db.all(sql,["%"+stringa+"%"],(err,rows)=>{
        if (err) reject(err);
        else{
          rows.map((row)=>{
            let film= new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId);
            list1.push(film);
          })
          resolve(list1);
        }
            })
    })
  }
  this.addNewMovie=(film)=>{
    return new Promise((resolve,reject)=>{
    let t;
    const sql1="Select * from films where id=?";
    db.get(sql1,[film.id],(err,row)=>{
      if(err) throw (err);
      else if(row===undefined){
    const sql='INSERT INTO films(id, title, isFavorite, rating, watchDate,userId) VALUES(?,?,?,?,DATE(?),?)';
    if(film.isFavorite){ t=1;}
    else { t=0;}
    db.run(sql,[film.id,film.title, t, film.rating, film.watchDate.format('YYYY-MM-DD'),film.userId], (err)=>{
      if(err) {console.log("ERRORE");
      reject(err);}
      else {console.log("YASSS");
      resolve(film.title);}
    });}
    else{console.log("errore");
    reject("ee");}
  });});
  }
  this.deleteMovie=(id)=>{
    return new Promise((resolve,reject)=>{
    let t;
    const sql='DELETE from films where id=?';
    
    db.run(sql,[id], (err)=>{
      if(err) {console.log("ERRORE");
      reject(err);}
      else {console.log("YASSS");
      resolve(1);}
    });});
  }
}

export {Film, FilmLibrary};