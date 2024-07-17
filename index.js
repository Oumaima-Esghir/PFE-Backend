const express = require('express');
const app = express();
require('dotenv').config();


const DBCONNECT = require('./core/DB_CONNECT');
const cors = require('cors');

//DB Connection
DBCONNECT.connect();

// use middlewares
app.use(cors());
app.use(express.json());

// import and use routers
const pubrouter = require('./routers/Pub_router');
const userrouter = require('./routers/User_router');
const partenairerouter = require('./routers/Partenaire_router');
const planrouter = require('./routers/Plan_router');
const commentrouter = require('./routers/Comment_router');
const raterouter = require('./routers/Rate_router');
const conversationrouter = require('./routers/Conversation_router');

app.use('/pubs', pubrouter);
app.use('/users', userrouter);
app.use('/partenaires', partenairerouter);
app.use('/plans', planrouter);
app.use('/comments', commentrouter);
app.use('/rates', raterouter);
app.use('/conversations', conversationrouter);




app.listen(process.env.PORT, () => {
    console.log(`server working on port : http://10.0.2.2:${process.env.PORT}`);
});