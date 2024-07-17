const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
        sender: { type: Schema.Types.Mixed, required: true }, // Permettre différents types de valeurs pour le sender
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
     createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Conversation', ConversationSchema);