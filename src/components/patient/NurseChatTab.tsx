import React, { useState, useRef, useEffect } from 'react';
import { PatientProfile, ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/geminiService';
import { 
  Send, 
  Sparkles, 
  Wind, 
  BookOpen, 
  AlertCircle, 
  Bot, 
  User, 
  CornerDownLeft,
  Volume2
} from 'lucide-react';

interface NurseChatTabProps {
  patient: PatientProfile;
  onOpenRelaxationModal: () => void;
  isLargeFont: boolean;
  isAudioEnabled: boolean;
}

export const NurseChatTab: React.FC<NurseChatTabProps> = ({
  patient,
  onOpenRelaxationModal,
  isLargeFont,
  isAudioEnabled,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `您好呀，${patient.name} 糖友！我是您的 AI 虚拟糖尿病护士“糖糖”。
无论是指南用药咨询、食物升糖指数(GI)、运动安排，还是测糖过程中感到烦躁压力，都可以随时跟我聊聊。糖糖一直在这里陪伴您！🌸`,
      timestamp: '刚刚',
      source: '奉贤区中医医院内分泌科AI知识库 (CDS 2024)',
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '🍉 西瓜和苹果哪个升糖快？',
    '⚠️ 低血糖3.5手抖心慌怎么办？',
    '💊 二甲双胍吃完恶心能停药吗？',
    '🧘 每天测血糖压力好大好心烦...',
    '🏃 餐后散步走多少步合适？',
    '🍵 奉贤中医有推荐的降糖茶吗？',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(q, messages, patient);

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source === 'gemini-3.8-flash' 
          ? 'Gemini 3.8 Flash + 奉贤中医内分泌临床知识库' 
          : '《中国2型糖尿病防治指南(2024版)》临床规范',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '糖糖护士网络开小差了，请稍后再试一下哦。如果有任何身体不适，请直接联系科室护士！',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-175px)] max-h-[720px] bg-slate-50/60 rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative">
      {/* Top mini-bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            👩‍⚕️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-800">
                糖糖护士 (AI虚拟护士)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-slate-400">
              奉贤中医内分泌科指导 · 24小时贴身陪伴
            </span>
          </div>
        </div>

        <button
          onClick={onOpenRelaxationModal}
          className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200/80 px-2.5 py-1.5 rounded-xl hover:bg-teal-100 transition font-medium"
        >
          <Wind className="w-3.5 h-3.5" />
          <span>正念放松</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed space-y-1.5 ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              } ${isLargeFont ? 'text-sm' : 'text-xs'}`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.source && (
                <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  <span>依据：{m.source}</span>
                </div>
              )}

              <div
                className={`text-[9px] text-right ${
                  m.role === 'user' ? 'text-emerald-100' : 'text-slate-300'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl p-3 text-slate-400 text-xs border border-slate-100 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>糖糖正在结合内分泌指南与中医辨证为您分析...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-2.5 bg-white/80 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.replace(/^[^\s]+\s*/, ''))}
            className="px-2.5 py-1 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-800 text-[11px] hover:bg-emerald-100 transition shrink-0 active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="问问糖糖：饮食、用药、低血糖处置..."
            className={`flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs ${
              isLargeFont ? 'text-sm' : 'text-xs'
            }`}
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-40 hover:from-emerald-700 hover:to-teal-700 transition shadow-xs active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
