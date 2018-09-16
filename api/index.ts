// Load environmental variables
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env.dev'});

// Start App
import app from './app';
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express is now running on port ${process.env.PORT}`);
});
