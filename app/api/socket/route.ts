import { Server } from 'socket.io'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)

    io.on('connection', socket => {
      socket.on('join room', room => {
        socket.join(room)
      })

      socket.on('chat message', ({ room, msg }) => {
        socket.to(room).emit('chat message', msg)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}
