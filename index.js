const mongoose = require('mongoose');
const app = require('./app');
const keys = require('./config/keys');

const PORT = process.env.PORT || 5001;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

async function start() {
    try{
        await mongoose.connect(keys.MONGO_URI, mongooseOptions)
            .then(() => console.log('MongoDB conected...'));

        app.listen(PORT, (err) => console.log(`Server has been started on port ${PORT}...`));

    } catch(error) {
        console.log('Start error...:, ', error);
    }
}

start();

