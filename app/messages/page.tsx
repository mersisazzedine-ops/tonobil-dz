'use client'
import { useState } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { MOCK_MESSAGES } from '@/lib/mock-data'
import { getInitials } from '@/lib/utils'

export default function MessagesPage() {
  const [conversations, setConversations] = useState(MOCK_MESSAGES)
  const [activeConv, setActiveConv] = useState<string|null>(null)
  const [input, setInput] = useState('')
  const [showList, setShowList] = useState(true)

  const conv = conversations.find(c => c.id === activeConv)

  const send = () => {
    if (!input.trim() || !activeConv) return
    setConversations(prev => prev.map(c => c.id === activeConv ? {
      ...c,
      last_message: input,
      timestamp: new Date(),
      messages: [...c.messages, { id:`m${Date.now()}`, sender:'user', text:input, time:new Date() }]
    } : c))
    setInput('')
  }

  const openConv = (id: string) => { setActiveConv(id); setShowList(false) }

  const fmtTime = (d: Date) => new Intl.DateTimeFormat('fr', { hour:'2-digit', minute:'2-digit' }).format(d)

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-foreground mb-6">Messages</h1>
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm" style={{height:'65vh'}}>
          <div className="flex h-full">
            {/* Conv list */}
            <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-border flex-shrink-0`}>
              <div className="p-4 border-b border-border font-bold text-foreground">Conversations</div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(c => (
                  <button key={c.id} onClick={() => openConv(c.id)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors border-b border-border text-left ${activeConv===c.id?'bg-primary/5':''}`}>
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(c.host_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-foreground text-sm">{c.host_name}</p>
                        {c.unread > 0 && <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{c.unread}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.car_name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.last_message}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat thread */}
            <div className={`${!showList ? 'flex' : 'hidden'} md:flex flex-col flex-1`}>
              {conv ? (
                <>
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <button onClick={() => setShowList(true)} className="md:hidden mr-1"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{getInitials(conv.host_name)}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{conv.host_name}</p>
                      <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-green-600">En ligne</span></div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {conv.messages.map(m => (
                      <div key={m.id} className={`flex ${m.sender==='user'?'justify-end':'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${m.sender==='user' ? 'bg-primary text-white rounded-br-sm' : 'bg-secondary text-foreground rounded-bl-sm'}`}>
                          <p className="text-sm">{m.text}</p>
                          <p className={`text-xs mt-1 ${m.sender==='user'?'text-white/70':'text-muted-foreground'}`}>{fmtTime(m.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border flex gap-3">
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && send()}
                      placeholder="Écrivez un message..." className="flex-1 px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <button onClick={send} className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="font-bold text-foreground mb-2">Sélectionnez une conversation</h3>
                    <p className="text-muted-foreground text-sm">Choisissez une conversation dans la liste à gauche</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
