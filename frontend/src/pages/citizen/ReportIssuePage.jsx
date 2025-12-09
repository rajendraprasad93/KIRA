import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Bot, FileText, Send, Mic, MapPin, Camera, X } from 'lucide-react';
import VoiceInput from '../../components/VoiceInput';
import MapComponent from '../../components/MapComponent';
import PhotoUpload from '../../components/PhotoUpload';
import { mockCategories } from '../../data/mock';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [reportMode, setReportMode] = useState('selection'); // 'selection', 'ai', 'manual'
  
  // Shared State
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [photos, setPhotos] = useState([]);

  // Manual Form State
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [locationText, setLocationText] = useState('');

  // AI Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your Grievance Assistant. Please describe the issue you are facing, or send a voice note.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Backend API Calls ---
  const analyzeText = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      });
      return await response.json();
    } catch (error) {
      console.error('Analysis Error:', error);
      return null;
    }
  };

  const submitIssue = async (payload) => {
    try {
      const response = await fetch('http://localhost:5000/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error('Submission Error:', error);
      return null;
    }
  };

  // --- Chat Logic ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create local preview URL
      setPhotos(prev => [...prev, imageUrl]);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'user', 
        text: 'Sent a photo', 
        image: imageUrl 
      }]);
      
      // AI acknowledges photo
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: "I've received the photo. This will help with verification. Anything else to add?" 
        }]);
      }, 1000);
    }
  };

  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    // Call Backend AI
    const result = await analyzeText(userText);
    setIsTyping(false);

    if (result && result.success) {
      const data = result.data;
      const newData = { ...extractedData, ...data };
      setExtractedData(newData); // Update state
      
      // Smart Questioning Logic
      let botReply = '';
      
      const hasCategory = newData.category && newData.category !== 'others';
      const hasLocation = newData.location && newData.location !== 'Unknown Location';
      const hasPhoto = photos.length > 0;

      if (!hasCategory) {
        botReply = "I'm not sure which department this belongs to. Is it related to Roads, Water, Garbage, or Electricity?";
      } else if (!hasLocation) {
        botReply = `I understand this is a ${data.categoryName || data.category} issue. Please tell me the specific location (e.g., "Near City Market").`;
      } else if (!hasPhoto) {
        botReply = `I have the location: "${newData.location}". Do you have a photo of the issue? It increases the priority. If not, you can say "No".`;
      } else {
        botReply = `Great! I have all the details:\n- Type: ${newData.categoryName || newData.department}\n- Location: ${newData.location}\n- Evidence: ${photos.length} Photo(s)\n\nReady to submit?`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "I'm having trouble connecting to the server. Please check your connection." }]);
    }
  };

  const handleChatSubmit = async () => {
    const payload = {
      citizenName: 'Anonymous (AI Chat)',
      description: messages.filter(m => m.sender === 'user').map(m => m.text).join('. '),
      category: extractedData.category || 'others',
      categoryName: mockCategories.find(c => c.id === extractedData.category)?.name || 'Others',
      severity: extractedData.severity || 'Medium',
      location: extractedData.location || 'Unknown',
      coordinates: location,
      photos: photos,
      source: 'ai_assistant'
    };

    const result = await submitIssue(payload);
    if (result && result.success) {
      toast.success('Report Submitted!');
      navigate(`/confirmation/${result.issue.id}`);
    } else {
      toast.error('Submission failed');
    }
  };

  // --- Manual Form Logic (Existing) ---
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const payload = {
       citizenName: 'Anonymous (Manual)',
       description,
       category: selectedCategory,
       categoryName: mockCategories.find(c => c.id === selectedCategory)?.name || 'Others',
       severity: selectedSeverity || 'Medium',
       location: locationText,
       coordinates: location,
       photos: photos,
       source: 'manual'
    };
    
    const result = await submitIssue(payload);
    if (result && result.success) {
      toast.success('Report Submitted!');
      navigate(`/confirmation/${result.issue.id}`);
    } else {
      toast.error('Submission failed');
    }
  };

  // --- Render ---

  if (reportMode === 'selection') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="py-4 px-6 bg-white shadow-sm flex items-center gap-4">
          <button onClick={() => navigate('/citizen')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-blue-900">New Complaint</h1>
        </header>
        <div className="flex-1 container max-w-4xl mx-auto p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
            How do you want to report?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <button 
              onClick={() => setReportMode('ai')}
              className="card p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 text-left group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Bot className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Talk to AI Assistant</h3>
              <p className="text-gray-500">
                Interactive chat mode. Just describe the problem naturally, and our AI will file the report for you.
              </p>
            </button>

            <button 
              onClick={() => setReportMode('manual')}
              className="card p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-gray-500 text-left group"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-700 transition-colors">
                <FileText className="w-8 h-8 text-gray-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Fill Form Manually</h3>
              <p className="text-gray-500">
                Traditional form. Select categories, type details, and upload photos step-by-step yourself.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reportMode === 'ai') {
    return (
      <div className="fixed inset-0 bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md flex items-center justify-between">
           <div className="flex items-center gap-3">
             <button onClick={() => setReportMode('selection')} className="hover:bg-blue-700 p-1 rounded">
               <ArrowLeft className="w-6 h-6" />
             </button>
             <div className="flex items-center gap-2">
               <Bot className="w-6 h-6" />
               <div>
                  <h1 className="font-bold">Grievance Assistant</h1>
                  <p className="text-xs text-blue-200">AI Powered</p>
               </div>
             </div>
           </div>
           {Object.keys(extractedData).length > 2 && (
             <button onClick={handleChatSubmit} className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold shadow hover:bg-blue-50">
               Confirm & Submit
             </button>
           )}
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-1">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="w-full h-32 object-cover rounded-lg mb-2" />
                  )}
                  {msg.text}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                 <span className="animate-pulse">...</span>
               </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Extracted Data Preview (Optional, floating or bottom) */}
        {Object.keys(extractedData).length > 0 && (
           <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex gap-2 overflow-x-auto text-xs">
              {extractedData.category && (
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-md whitespace-nowrap">
                   🏷️ {extractedData.department}
                </span>
              )}
              {extractedData.severity && (
                <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-md whitespace-nowrap">
                   🚨 {extractedData.severity}
                </span>
              )}
              {extractedData.location && extractedData.location !== 'Unknown Location' && (
                 <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md whitespace-nowrap">
                    📍 {extractedData.location}
                 </span>
              )}
              {photos.length > 0 && (
                 <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-md whitespace-nowrap">
                    📷 {photos.length} Photo(s)
                 </span>
              )}
           </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
           <div className="flex items-center gap-2">
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef}
               onChange={handlePhotoUpload}
             />
             <button 
               onClick={() => fileInputRef.current.click()}
               className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
             >
               <Camera className="w-6 h-6" />
             </button>
             <input
               type="text"
               value={inputMessage}
               onChange={(e) => setInputMessage(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
               placeholder="Type your issue..."
               className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
             />
             <button 
               onClick={handleSendMessage}
               disabled={!inputMessage.trim()}
               className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    );
  }

  // --- Report Mode: Manual ---
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="py-4 px-6 bg-white shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => setReportMode('selection')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Manual Report Form</h1>
      </header>

      {/* Re-using previous form logic but cleaned up */}
      <div className="container max-w-2xl mx-auto p-6 space-y-6">
         <div className="card">
            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[120px]"
              placeholder="Describe the issue in detail..."
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="card">
               <label className="block mb-2 font-medium text-gray-700">Category</label>
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                     {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
               </Select>
            </div>
            <div className="card">
               <label className="block mb-2 font-medium text-gray-700">Severity</label>
               <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Low">Low</SelectItem>
                     <SelectItem value="Medium">Medium</SelectItem>
                     <SelectItem value="High">High</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         <div className="card">
            <label className="block mb-2 font-medium text-gray-700">Location</label>
            <input 
              type="text" 
              value={locationText} 
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Enter address"
              className="input-field mb-4"
            />
            <div className="h-48 rounded-lg overflow-hidden border">
               <MapComponent position={location} onLocationSelect={setLocation} interactive={true} />
            </div>
         </div>

         <button 
           onClick={handleManualSubmit}
           className="btn-primary w-full py-4 text-lg font-bold shadow-lg"
         >
           Submit Report
         </button>
      </div>
    </div>
  );
};

export default ReportIssuePage;