import React from 'react'
import { Link } from 'react-router-dom'
import { MessagesSquare } from "lucide-react"

const ChatButton = () => {
  return (
    <Link to="/HomePage" className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-50">
      <MessagesSquare size={40} />
    </Link>
  )
}

export default ChatButton;
