import React, { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

interface Message {
    role: "user" | "ai";
    content: string;
    photoUrl?: string;
}

const SupportChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hi there! I'm your AI support agent. How can I help you today? (e.g. 'Where is my order?' or 'I got the wrong item')" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const user = useSelector((state: any) => state.user.userData);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if ((!input.trim() && !selectedFile) || loading) return;

        const userMessage = input.trim();
        const file = selectedFile;
        
        // Optimistically add user message
        const newMessages: Message[] = [
            ...messages,
            { role: "user", content: userMessage, photoUrl: file ? URL.createObjectURL(file) : undefined }
        ];
        
        setMessages(newMessages);
        setInput("");
        setSelectedFile(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("message", userMessage);
            
            // Format history for the AI:
            // The backend expects an array of { role: "user" | "assistant", content: [{ type: "text", text: string }] }
            const history = messages.slice(1).map(msg => ({
                role: msg.role === "ai" ? "assistant" : "user",
                content: [{ type: "text", text: msg.content }]
            }));
            
            formData.append("history", JSON.stringify(history));

            if (file) {
                formData.append("photo", file);
            }

            const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/support/chat`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setMessages(prev => [
                    ...prev,
                    { role: "ai", content: response.data.response }
                ]);
            }
        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages(prev => [
                ...prev,
                { role: "ai", content: "Sorry, I am having trouble connecting to the server right now." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // If user is not logged in, don't show the chat
    if (!user || user.role === "deliveryBoy") return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
                >
                    <FaCommentDots size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">AI Support</h3>
                            <p className="text-xs text-orange-100">Typically replies instantly</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-orange-100 hover:text-white">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div 
                                    className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                                        msg.role === "user" 
                                            ? "bg-orange-600 text-white rounded-br-none" 
                                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                                    }`}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {msg.content}
                                    {msg.photoUrl && (
                                        <img src={msg.photoUrl} alt="Attached" className="mt-2 rounded-lg max-w-full h-auto" />
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                        <input 
                            type="file" 
                            id="support-file-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setSelectedFile(e.target.files[0]);
                                }
                            }}
                        />
                        <label 
                            htmlFor="support-file-upload" 
                            className={`p-2 rounded-full cursor-pointer transition-colors ${selectedFile ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <FaPaperclip size={18} />
                        </label>
                        
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={selectedFile ? "Add a message..." : "Type your message..."}
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            disabled={loading}
                        />
                        
                        <button 
                            onClick={handleSend}
                            disabled={(!input.trim() && !selectedFile) || loading}
                            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                    {selectedFile && (
                        <div className="px-4 pb-2 bg-white text-xs text-orange-600 flex justify-between items-center">
                            <span>Attached: {selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500">Remove</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupportChat;
