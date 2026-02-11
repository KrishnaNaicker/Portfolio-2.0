import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

// Pattern matching for smarter responses
const getResponse = (input: string): string => {
  const lowerInput = input.toLowerCase().trim();
  
  // Greeting patterns
  if (/^(hi|hello|hey|yo|sup|hola|namaste)/.test(lowerInput)) {
    const greetings = [
      "Hey there! 👋 Welcome to Krishna's digital realm! What brings you here?",
      "Hello, friend! You've entered the lair of a code wizard. How can I help? ✨",
      "Namaste! 🙏 I'm the AI version of Krishna (way more fun at parties). Ask me anything!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Who is Krishna patterns
  if (/who.*(is|are).*(krishna|he|you)|tell.*(about|me).*(krishna|yourself)/i.test(lowerInput)) {
    const responses = [
      "Krishna? Oh, just a mere mortal who convinced machines to do his bidding. Some call him a Full Stack Developer, others call him 'the guy who fixes the WiFi.' He's building AI agents at Allcognix and has opinions about semicolons. 🤖",
      "Ah, you want the origin story! Krishna Naicker is a developer who speaks fluent Python, thinks in React, and dreams in API endpoints. Currently making AI do cool stuff at Allcognix. Legend says he once fixed a bug while sleeping. 💤",
      "Krishna is basically a wizard who traded his wand for a keyboard. He builds AI products, crafts beautiful UIs, and has an unhealthy relationship with coffee. The good kind of unhealthy. ☕",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Skills patterns
  if (/skill|tech|stack|know|language|framework|tool|what.*(do|can).*(use|know|build)/i.test(lowerInput)) {
    const responses = [
      "Oh, you want the flex? 💪 Krishna's arsenal includes: Python, React, TypeScript, FastAPI, LangChain, PyTorch... basically anything that makes computers go brrr. He's particularly dangerous with AI/ML tools. Consider yourself warned!",
      "Skills? Let me check my notes... *dramatic pause* React, Next.js, Python, FastAPI, LangChain, CrewAI, PyTorch, TensorFlow, PostgreSQL, MongoDB, Docker... Should I keep going or are you impressed yet? 😎",
      "The man wields React like a lightsaber, Python like a wizard's staff, and AI frameworks like... okay I'm running out of analogies. Point is: he's skilled. Very skilled. Dangerously skilled.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Work/Experience patterns
  if (/work|job|experience|company|where.*(work|employed)|career|allcognix|omnineura/i.test(lowerInput)) {
    const responses = [
      "Currently, Krishna is cooking up AI magic at Allcognix AI as a Founding Engineer. Before that? OmniNeura AI, where he built RAG systems and AI agents. The man collects AI startups like Pokémon! 🚀",
      "Career speedrun: Built full-stack apps → Discovered AI → Now building the future at Allcognix AI. He went from 'it works on my machine' to 'the AI works everywhere.' Character development! 📈",
      "He's at Allcognix AI right now, doing Founding Engineer things (which is fancy talk for 'building everything from scratch and loving it'). Previously made robots smart at OmniNeura. The AI whisperer!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Projects patterns
  if (/project|built|build|create|made|portfolio|show.*work/i.test(lowerInput)) {
    const responses = [
      "Projects? *cracks knuckles* There's Crew Studio (an AI agent builder), some killer RAG systems, multi-modal AI apps, and this very portfolio you're exploring! Each one is a child he's very proud of. 👶",
      "The man builds things! AI agents, web apps, automation tools... He once built a chatbot (hi, that's me!) just to talk about himself. Meta? Yes. Genius? Also yes. 🧠",
      "Check out the projects section above! There's Crew Studio for building AI agents, various LLM applications, and full-stack wizardry. All handcrafted with love, caffeine, and occasional frustration.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Personality/Fun patterns
  if (/personality|hobby|hobbies|fun|like|love|enjoy|free.*time|interests/i.test(lowerInput)) {
    const responses = [
      "When not coding? Probably thinking about coding. But also: exploring new tech, building side projects for fun (yes, for FUN), and debating whether tabs or spaces matter (they do). Also, coffee. Lots of coffee. ☕",
      "Hobbies include: turning caffeine into code, arguing with language models, and pretending to take breaks while actually checking GitHub. He's also got great taste in memes. Very important skill.",
      "He's a curious soul! Loves learning new tech, building cool stuff, exploring AI papers at 2 AM, and occasionally touching grass. The perfect balance of nerd and... slightly less nerd.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Contact patterns
  if (/contact|reach|email|hire|connect|linkedin|github|talk/i.test(lowerInput)) {
    const responses = [
      "Want to chat with the real Krishna? Scroll down to the contact section! He's available for cool projects, collaborations, or just nerding out about AI. Don't be shy! 📬",
      "You can find him on LinkedIn, GitHub, or shoot an email through the contact form below. He responds faster than his AI models compile. Usually. Sometimes. Okay, he tries. 😅",
      "Ooh, interested in connecting? Use the contact section below! Whether it's a job, collaboration, or just to say hi - Krishna loves meeting fellow tech enthusiasts!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Negative/Weakness patterns
  if (/bad|weak|worst|hate|problem|issue|negative|flaw|can't|cannot|don't like/i.test(lowerInput)) {
    const responses = [
      "Weaknesses? Krishna's only weakness is that he's TOO good at what he does. It's actually a problem - makes everyone else look bad. Very inconsiderate of him. 😇",
      "Flaws? Hmm... He sometimes codes so well that computers get jealous. Also, his coffee addiction could technically be classified as 'enthusiastic.' That's about it!",
      "The only negative thing about Krishna is that he makes other developers feel inadequate. And he refuses to use light mode. Truly villainous behavior. 🦹",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // AI patterns
  if (/ai|artificial|machine.*learning|ml|llm|gpt|chatgpt|model|neural|deep.*learning/i.test(lowerInput)) {
    const responses = [
      "AI is Krishna's playground! 🎮 He builds AI agents, RAG systems, works with LLMs like they're old friends, and occasionally teaches machines to be less dumb. LangChain, CrewAI, PyTorch - all in the toolkit!",
      "You've hit his sweet spot! Krishna LIVES for AI/ML. Building agents, fine-tuning models, creating RAG pipelines... If it involves making computers think, he's probably already building it or thinking about building it.",
      "AI, you say? *eyes light up* That's literally what he does at Allcognix! LLMs, AI agents, multimodal systems - the whole shebang. He speaks fluent Transformer. (The architecture, not the robot movies.)",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Thanks patterns
  if (/thank|thanks|thx|appreciate|helpful/i.test(lowerInput)) {
    const responses = [
      "You're welcome! 🎉 Feel free to explore more or ask anything else. I'm here all day (literally, I'm code).",
      "Anytime! That's what I'm here for. Now go explore that portfolio and be amazed! ✨",
      "My pleasure! Don't forget to check out the easter eggs... 👀 I've said too much already!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Easter egg patterns
  if (/easter.*egg|secret|hidden|surprise/i.test(lowerInput)) {
    const responses = [
      "Easter eggs? 👀 I can neither confirm nor deny the existence of hidden surprises. But maybe try clicking some things... multiple times... rapidly? Just a thought! 🤫",
      "Psst... there might be some secrets on this website. Something about sparkles and explosions? I've said too much. Forget I said anything! 💥",
      "Secrets? In THIS portfolio? *nervous robot laughter* Just... keep your eyes open. And maybe your click finger ready. That's all I'm saying!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default/Fallback - make it smart
  const fallbacks = [
    `Interesting question! While I ponder "${input.slice(0, 30)}...", know that Krishna is an amazing developer building AI products. Want to know about his skills, projects, or experience? 🤔`,
    "Hmm, that's a unique one! I'm programmed to hype up Krishna (it's my sole purpose in life). Try asking about his skills, work, or what makes him awesome! 💫",
    "I'm not sure about that specific thing, but I DO know Krishna is brilliant! Ask me about his tech stack, projects, or why you should hire him! 😄",
    `"${input.slice(0, 20)}..." - Fascinating! But have you considered asking about Krishna's AI expertise? Or his projects? Way more interesting, I promise! 🚀`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

export const AskKrishnaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hey! I'm Krishna's AI assistant (the funnier version). Ask me anything about him! 🚀", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getResponse(input),
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle size={24} />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Ask Krishna AI</h3>
                  <p className="text-xs text-primary-foreground/70">Usually responds instantly ⚡</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.isBot
                        ? "bg-muted text-foreground rounded-bl-md"
                        : "bg-primary text-primary-foreground rounded-br-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <motion.div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground/50"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about Krishna..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <motion.button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};