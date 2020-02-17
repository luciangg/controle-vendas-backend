module.exports = {

    mongo : {
        user: process.env.LGG_MONGO_USER,
        pass: process.env.LGG_MONGO_PASS,
        url: process.env.LGG_MONGO_URL,
        port:process.env.LGG_MONGO_PORT,
        db: process.env.LGG_MONGO_DB
    },

    getUrl: function(db) {
        console.log("CON:", db);
        return 'mongodb://'+encodeURIComponent(db.user)+':'+encodeURIComponent(db.pass)+'@'+db.url+':'+db.port+'/'+db.db;
    },

    authSecret : '!!C@th0rr0195sB01@D&&1r0',
    secret : '!!C@th0rr0195sB01@D&&1r0',
}
