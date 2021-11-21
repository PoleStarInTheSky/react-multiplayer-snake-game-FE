import useCanvas from '../../hooks/useCanvas'
import React, { useCallback, useEffect, useState } from 'react'
import { OPTION } from '../../hooks/useCanvas'
import { useSocketIO } from '../../context/socketIOContext'
//canvas 的初始化配置
const option: OPTION = {
  initialWidth: 600,
  initialHeight: 600,
  contextType: '2d',
  //这里设置的绘制前行为， 内容是把整个 canvas 都涂成背景色
  preDraw: (ctx: RenderingContext) => {
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle = '#231f20'
      ctx.fillRect(0, 0, 600, 600)
    }
  },
}
// 坐标点的接口
interface Coord {
  x: number
  y: number
}
// 蛇信息的本质就是一个坐标数组，表示它身体的不同部分
type Snake = Coord[]
// 当前帧的画面信息接口
interface GameState {
  // 食物
  food: Coord
  // 要绘制的蛇数组
  players: Snake[]
}
const SnakeColor = ['#E3170D', '#1E90FF']
//游戏主组件
const Game = () => {
  // gameState 保存当前这一帧的游戏画面
  const [gameState, setGameState] = useState<null | GameState>(null)
  // 表示实际游戏逻辑中一个单元格占的像素大小
  const [unit, setUnit] = useState<number | null>(null)
  //使用 socket.io 的context
  const { addSocketEvtListener, emitEvent } = useSocketIO()

  // draw 函数绘制每一帧的画面
  const draw = useCallback(
    (ctx: RenderingContext) => {
      if (gameState && ctx instanceof CanvasRenderingContext2D && unit) {
        const food = gameState.food
        //绘制水果位置
        ctx.fillStyle = '#FFFF00'
        ctx.fillRect(food.x * unit, food.y * unit, unit, unit)
        //绘制蛇位置
        gameState.players.forEach((snake, index) => {
          ctx.fillStyle = SnakeColor[index]
          //一格一格地绘制蛇的身体
          for (const cell of snake) {
            ctx.fillRect(cell.x * unit, cell.y * unit, unit, unit)
          }
        })
      }
    },
    [gameState, unit],
  )
  const canvasRef = useCanvas(draw, option)
  return <canvas ref={canvasRef} />
}
export default Game
