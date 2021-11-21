import React, { createContext, ReactNode, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

//初始化 SocketContext
const SocketIOContex = createContext<
  | {
      addSocketEvtListener: (
        evtName: string,
        handler: (...args: any[]) => void,
      ) => void
      emitEvent: (evtName: string, ...args: any[]) => void
    }
  | undefined
>(undefined)
SocketIOContex.displayName = 'SocketIOContex'

// 包装 Context 的 Provider
export const SocketIOProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<null | Socket>(null)
  //初始化 socket
  useEffect(() => {
    setSocket(io(import.meta.env.VITE_SERVER_URI as string))
  }, [])
  //给 socket 绑定事件
  const addSocketEvtListener = (
    evtName: string,
    handler: (...args: any[]) => void,
  ) => {
    if (!socket) {
      throw new Error('请初始化后再绑定！')
    }
    socket.on(evtName, handler)
  }
  //给 socket 发送事件
  const emitEvent = (evtName: string, ...args: any[]) => {
    if (!socket) {
      throw new Error('请初始化后再触发事件!')
    }
    socket.emit(evtName, ...args)
  }

  return (
    <SocketIOContex.Provider
      children={children}
      value={{ addSocketEvtListener, emitEvent }}
    />
  )
}

//暴露钩子函数的形式使用 Socket
export const useSocketIO = () => {
  const context = React.useContext(SocketIOContex)
  if (!context) {
    throw new Error('useSocketIO必须在SocketIOContex中使用')
  }
  return context
}
