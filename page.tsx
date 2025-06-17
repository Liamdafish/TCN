'use client'

import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io()

export default function Home() {
  const [room, setRoom] = useState('')
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setChat(prev => [...prev, msg])
    })
  }, [])

  const joinRoom = () => {
    if (room.trim() !== '') {
      socket.emit('join room', room)
      setJoined(true)
    }
  }

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { room, msg: message })
      setChat(prev => [...prev, `You: ${message}`])
      setMessage('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!joined ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Join Chat Room</h1>
          <input
            className="border px-2 py-1"
            placeholder="Enter room code"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={joinRoom}>
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-2">
          <h2 className="text-xl">Room: {room}</h2>
          <div className="h-64 overflow-y-scroll border p-2 bg-gray-100">
            {chat.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              className="flex-1 border px-2 py-1"
              placeholder="Type your message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="bg-green-500 text-white px-4" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
