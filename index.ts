// Load environmental variables
require ('dotenv').config();

// Start App
import app from './api/app';
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express is now running on port ${process.env.PORT}`);
});