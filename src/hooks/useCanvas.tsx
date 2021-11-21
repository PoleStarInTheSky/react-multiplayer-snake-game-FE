import { useRef, useEffect, useState } from 'react'
export interface OPTION {
  //初始宽度
  initialWidth: number
  //初始高度
  initialHeight: number
  //context 类型
  contextType: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer'
  //执行绘图之前的操作
  preDraw?: (ctx: RenderingContext) => void
  //执行绘图之后的操作
  postDraw?: (ctx: RenderingContext) => void
}
const useCanvas = (draw: (ctx: RenderingContext) => void, option: OPTION) => {
  console.log('useCanvas 执行')
  const canvasRef = useRef<null | HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<null | RenderingContext>(null)
  useEffect(() => {
    //如果canvasRef不为空
    //执行初始化操作
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = option.initialWidth
      canvas.height = option.initialHeight
      setCtx(canvas.getContext(option.contextType))
    }
  }, [option])

  useEffect(() => {
    if (ctx) {
      // 使用 requestAnimationFrame, 获得更流畅的动画
      requestAnimationFrame(() => {
        if (option.preDraw) option.preDraw(ctx)
        draw(ctx)
        if (option.postDraw) option.postDraw(ctx)
      })
    }
  }, [draw, ctx, option])
  return canvasRef
}

export default useCanvas
