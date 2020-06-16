const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
	host: 'localhost', // 0.0.0.0
  	dialect: 'sqlite',
  	pool: {
    	max: 5,
    	min: 0,
    	idle: 10000
  	},
  	storage: 'database.sqlite'
});

  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    Top = sequelize.define('top', {
      username: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.INTEGER
      }
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  function dbAdd(username, score) {
    Top.create({ username: username, score: score }).then(top => {
        console.log("Auto-generated ID:", top.id);
    });
}

function dbGetTop(num) {
    return Top.findAll({
        limit: num,
		order: [
            ['score', 'DESC']
        ]
	}).then(tops => tops);
}

function dbGetAll() {
    Top.findAll().then(tops => {
        tops.forEach(top => {
			console.log(top.username, top.score);
		});
    });
}