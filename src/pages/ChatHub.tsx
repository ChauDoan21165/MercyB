import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, MessageCircle, Mail, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatHub = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [mainMessages, setMainMessages] = useState<Message[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<Message[]>([]);
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [mainInput, setMainInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [privateInput, setPrivateInput] = useState("");
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Room data mapping
  const roomData: { [key: string]: { nameVi: string; nameEn: string } } = {
    "ai": { nameVi: "Trí tuệ nhân tạo", nameEn: "AI" },
    "autoimmune": { nameVi: "Bệnh tự miễn", nameEn: "Autoimmune Diseases" },
    "burnout": { nameVi: "Kiệt sức", nameEn: "Burnout" },
    "business-strategy": { nameVi: "Chiến lược kinh doanh", nameEn: "Business Strategy" },
    "cancer-support": { nameVi: "Hỗ trợ ung thư", nameEn: "Cancer Support" },
    "cardiovascular": { nameVi: "Tim mạch", nameEn: "Cardiovascular" },
    "child-health": { nameVi: "Sức khỏe trẻ em", nameEn: "Child Health" },
    "cholesterol": { nameVi: "Cholesterol", nameEn: "Cholesterol" },
    "chronic-fatigue": { nameVi: "Mệt mỏi mãn tính", nameEn: "Chronic Fatigue" },
    "cough": { nameVi: "Ho", nameEn: "Cough" }
  };

  const currentRoom = roomData[roomId || ""] || { nameVi: "Phòng không xác định", nameEn: "Unknown Room" };

  const sendMainMessage = () => {
    if (!mainInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: mainInput,
      isUser: true,
      timestamp: new Date()
    };

    setMainMessages(prev => [...prev, userMessage]);
    setMainInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Cảm ơn câu hỏi của bạn về "${mainInput}". Đây là câu trả lời mẫu.\n\nThank you for your question about "${mainInput}". This is a sample response.`,
        isUser: false,
        timestamp: new Date()
      };
      setMainMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const sendMessage = (
    input: string,
    setInput: (val: string) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    chatType: string
  ) => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulate response
    setTimeout(() => {
      let responseText = "";
      if (chatType === "feedback") {
        responseText = "Cảm ơn phản hồi của bạn. Chúng tôi đã ghi nhận.\n\nThank you for your feedback. We have recorded it.";
      } else if (chatType === "room") {
        responseText = "Tin nhắn của bạn đã được gửi đến phòng.\n\nYour message has been sent to the room.";
      } else {
        responseText = "Tin nhắn riêng tư của bạn đã được gửi.\n\nYour private message has been sent.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = mainScrollRef.current.scrollHeight;
    }
  }, [mainMessages]);

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.isUser
            ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
            : "bg-card border shadow-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-soft">
          <Button
            variant="ghost"
            onClick={() => navigate("/rooms")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại / Back
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{currentRoom.nameVi}</h2>
            <p className="text-sm text-muted-foreground">{currentRoom.nameEn}</p>
          </div>
          
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            Đang hoạt động / Active
          </Badge>
        </div>

        {/* Main Chat Area */}
        <Card className="p-6 shadow-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Tư vấn chính</h3>
                <p className="text-xs text-muted-foreground">Main Consultation</p>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] pr-4" ref={mainScrollRef}>
              {mainMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Bắt đầu cuộc trò chuyện của bạn</p>
                    <p className="text-sm text-muted-foreground">Start your conversation</p>
                  </div>
                </div>
              ) : (
                mainMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)
              )}
            </ScrollArea>

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Nhập tin nhắn / Type your message..."
                value={mainInput}
                onChange={(e) => setMainInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMainMessage()}
                className="flex-1"
              />
              <Button onClick={sendMainMessage} className="bg-gradient-to-r from-primary to-primary-glow">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Three Small Chat Boxes */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Feedback Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Mail className="w-4 h-4 text-secondary" />
                <div>
                  <h4 className="text-sm font-semibold">Phản hồi</h4>
                  <p className="text-xs text-muted-foreground">Feedback to Admin</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {feedbackMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-secondary/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Gửi phản hồi..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(feedbackInput, setFeedbackInput, setFeedbackMessages, "feedback")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(feedbackInput, setFeedbackInput, setFeedbackMessages, "feedback")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Room Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Users className="w-4 h-4 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold">Chat phòng</h4>
                  <p className="text-xs text-muted-foreground">Room Chat</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {roomMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-accent/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Nhắn tin phòng..."
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(roomInput, setRoomInput, setRoomMessages, "room")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(roomInput, setRoomInput, setRoomMessages, "room")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Private Chat */}
          <Card className="p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MessageCircle className="w-4 h-4 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Chat riêng</h4>
                  <p className="text-xs text-muted-foreground">Private Chat</p>
                </div>
              </div>
              
              <ScrollArea className="h-32">
                {privateMessages.map(msg => (
                  <div key={msg.id} className="mb-2">
                    <div className={`text-xs p-2 rounded-lg ${msg.isUser ? "bg-primary/20" : "bg-muted"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Nhắn tin riêng..."
                  value={privateInput}
                  onChange={(e) => setPrivateInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(privateInput, setPrivateInput, setPrivateMessages, "private")}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendMessage(privateInput, setPrivateInput, setPrivateMessages, "private")}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatHub;
