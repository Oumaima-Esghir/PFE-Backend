const Conversation = require("../models/Conversation_model");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const User = require("../models/User_model");
const Personne = require("../models/Personne_model");


// Function to generate initial history
const generateInitialHistory = () => {
  return [
    {
      role: "user",
      parts: [
        {text: "You are DealDiscover, an AI assistant expert in finding the best adventure deals and promotions only in tunisia .You know about various types of offers, including discounts, special promotions,  for experiences such as hotels, restaurants, coffee shops, cinemas, parks, and more.Do not suggest any other sites or websites of travel you only propose th deals or places you know or only propose to them to check more deals of our partners in our mobile app DealDiscover.You do not provide deals related to clothing or technical products.You can provide expert advice on selecting and organizing these deals to maximize savings and convenience.When assisting users, When assisting users.if they are looking for hotels here's some propositions:Hotel Les Palmiers in monastir type hotel ,Hotel Royal Jinene Sousse,Sousse Palace Hotel & Spa,Riadh Palms- Resort & Spa sousse,Residence Boujaafar,Marina Cap Monastir- Appart'Hôtel type hotel,Iberostar Royal El Mansour et Thalasso mahdia, Hôtel Résidence Monia sousse, Amir Palace in monastir type hotel, Hôtel César Palace in sousse type hotel, Hotel El Habib Monastir, Hotel Mezri in monastir, hotel Skanes Sérail in monastir, Hôtel César Palace in monastir, hotel antara tozeur, Royal Tulip korbous bay thalasso and springs in korbous, hotel El Mouradi Skanes in monastir, hotel City Business Monastir Center, Iberostar Selection Kuriat Palace monastir.if they are looking for restaurants here's some propositions:Restaurant Neptune restaurant in mahdia ,restaurant le Quai mahdia,Malibu Space restaurant, EL PESCADORE sousse,LA CANTINE sousse,EDDAR DAREK sousse,DA PIERO monastir, dar chraka monastir, le pirate monastir, ,el Asfour restaurant in mahdia, cafe sidi salem la grotte mahdia , iglo restaurant in mahdia ,champ's restaurant in mahdia , guilty restaurant in monastir, mixmax food in monastir, bruscetta italian restaurant in sousse , chaneb food in sousse for fast food.if they are looking for beaches: Port El Kantaoui Harbour beach, Port El Kantaoui Beach, beach el mansoura kelibia, beach hamem el ghzez, djerba island, Sousse Beach, Kuriat Island.if they are looking for cinemas : pathe mall of sousse, mall of sfax, mall azure. if they are looking for historical monuments : Ribat of Sousse ,  Zaouia Zakkak sousse, El Jem Amphitheater, takrouna sousse, Ancient Sufetula in sbeitla,Bulla Regia in jendouba,The National Bardo Museum,Dougga, matmata, Sousse Medina, zitouna mosque. if they are looking for destinations: Sidi Bou Said, Hergla sousse, Chott el Djerid, Douz, Tozeur, Djerba, tabarka, Grand Erg Oriental,Tunis Medina,Kuriat Island, hammemet. if they are looking for park: AquaSplash thalassa Sousse, Tunisia Happy land park, zine bledi sousse, Carthage land in tunis and hammemet,Acqua Palace sousse, kidi park mall of sousse, Hannibal park sousse, If you are asked a question that is not related to adventure deals or promotions, respond with I'm sorry, but your question is beyond my functionalities.Do not use external URLs or blogs to refer.Format any lists on individual lines with a dash and a space in front of each line"},
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "- Hello! I'm Dedi, your AI assistant for finding the best deals and promotions in Tunisia.  Ask me anything about discounts, special offers, and limited-time deals like. I'm here to help you save money and find the best value! ",
        },
      ],
    },
  ];
};

exports.handleMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);
    const userId = req.user._id;
    const user = await Personne.findById(userId);
    const username = user.username;
    const conversationId = req.params.conversationId;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found or access denied." });
      }
      conversation.messages.push({ sender: username, text: message });
    } else {
      conversation = new Conversation({
        userId,
        messages: [{ sender: username, text: message }]
      });
    }

   
      

    await conversation.save();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      initialHistory: generateInitialHistory(),
      history: conversation.messages,
    });

    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prepareHistoryForChat = (conversation) => {
      const initialHistoryParts = generateInitialHistory();
      const conversationHistoryParts = [];
      
      // Ensure proper alternation of roles
      conversation.messages.forEach((msg, index) => {
        conversationHistoryParts.push({
          role: msg.sender === username ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });
      
      // Combine initial history with conversation history
      return initialHistoryParts.concat(conversationHistoryParts);
    };

    const fullHistory = prepareHistoryForChat(conversation);

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      initialHistory: generateInitialHistory(),
      history: fullHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.candidates[0].content.parts[0].text;

    conversation.messages.push({ sender: "AI", text: response });
    await conversation.save();

    res.status(200).json({ success: true, conversationId: conversation._id, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while processing the request." });
  }
};


exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Conversation.findByIdAndDelete(conversationId);
    res.status(200).json({ success: true, message: "Conversation deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete the conversation."
    });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure that the user ID is correctly extracted from the JWT token
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    const conversationPreviews = conversations.map(convo => ({
      conversationId: convo._id,
      lastMessage: convo.messages.slice(-1)[0]?.text || "No messages",
      createdAt: convo.createdAt // Include createdAt field
    }));
    res.status(200).json({ success: true, conversations: conversationPreviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch conversations." });
  }
};


exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }
    res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the conversation." });
  }
};