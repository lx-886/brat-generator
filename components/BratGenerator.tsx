'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
]

const MAX_PREVIEW_SIZE = 500
const DEFAULT_IMAGE_SIZE = 1000
const MAX_IMAGE_SIZE = 5000
const MIN_IMAGE_SIZE = 200
const PADDING_RATIO = 0.08
const MIN_FONT_SIZE = 12
const LINE_HEIGHT_RATIO = 1.2

interface TextLayout {
  fontSize: number
  lineHeight: number
  lines: string[]
  contentHeight: number
  canvasWidth: number
  canvasHeight: number
}

export default function BratGenerator() {
  const [text, setText] = useState('brat')
  const [bgColor, setBgColor] = useState('#8BCF00')
  const [textColor, setTextColor] = useState('#000000')
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')
  const [imgWidthInput, setImgWidthInput] = useState(DEFAULT_IMAGE_SIZE.toString())
  const [imgHeightInput, setImgHeightInput] = useState(DEFAULT_IMAGE_SIZE.toString())
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [showOptions, setShowOptions] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const imgWidth = useMemo(() => {
    const numValue = parseInt(imgWidthInput)
    return isNaN(numValue) ? DEFAULT_IMAGE_SIZE : 
      Math.min(MAX_IMAGE_SIZE, Math.max(MIN_IMAGE_SIZE, numValue))
  }, [imgWidthInput])

  const imgHeight = useMemo(() => {
    const numValue = parseInt(imgHeightInput)
    return isNaN(numValue) ? DEFAULT_IMAGE_SIZE : 
      Math.min(MAX_IMAGE_SIZE, Math.max(MIN_IMAGE_SIZE, numValue))
  }, [imgHeightInput])

  const calculateTextLayout = (
    text: string,
    fontFamily: string,
    containerWidth: number,
    containerHeight: number,
    maxFontSize: number
  ): TextLayout => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    const padding = Math.min(containerWidth, containerHeight) * PADDING_RATIO
    const availableWidth = containerWidth - padding * 2
    const availableHeight = containerHeight - padding * 2
    
    let fontSize = Math.min(maxFontSize, availableHeight)
    let lines: string[] = []
    let lineHeight = fontSize * LINE_HEIGHT_RATIO
    let contentHeight = 0

    const splitLines = (text: string): string[] => {
      const paragraphs = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
      const allLines: string[] = []
      
      const canBreak = (char: string) => /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/.test(char)
      
      for (const para of paragraphs) {
        let currentLine = ''
        
        for (const char of para) {
          const testLine = currentLine + char
          ctx.font = `${fontSize}px ${fontFamily}`
          const metrics = ctx.measureText(testLine)
          
          if (metrics.width <= availableWidth) {
            currentLine = testLine
          } else {
            if (currentLine.length > 0) allLines.push(currentLine)
            currentLine = canBreak(char) ? '' : char
          }
        }
        
        if (currentLine.length > 0) allLines.push(currentLine)
      }
      
      return allLines
    }

    while (fontSize >= MIN_FONT_SIZE) {
      ctx.font = `${fontSize}px ${fontFamily}`
      lines = splitLines(text)
      lineHeight = fontSize * LINE_HEIGHT_RATIO
      contentHeight = lines.length * lineHeight
      
      if (contentHeight <= availableHeight * 0.9) break
      fontSize -= 1
    }

    return {
      fontSize,
      lineHeight,
      lines,
      contentHeight,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight
    }
  }

  const previewLayout = useMemo(() => {
    if (!previewContainerRef.current || !isMounted) return null
    
    const containerWidth = previewContainerRef.current.clientWidth
    const containerHeight = previewContainerRef.current.clientHeight
    const maxPreviewWidth = Math.min(MAX_PREVIEW_SIZE, containerWidth * 0.9)
    const maxPreviewHeight = Math.min(MAX_PREVIEW_SIZE, containerHeight * 0.9)
    
    const aspectRatio = imgWidth / imgHeight
    const previewWidth = Math.min(maxPreviewWidth, maxPreviewHeight * aspectRatio)
    const previewHeight = previewWidth / aspectRatio
    
    return calculateTextLayout(text, fontFamily, previewWidth, previewHeight, 150)
  }, [text, fontFamily, imgWidth, imgHeight, isMounted])

  useEffect(() => {
    if (!previewLayout || !previewCanvasRef.current) return
    
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')!
    
    canvas.width = previewLayout.canvasWidth
    canvas.height = previewLayout.canvasHeight
    
    // 绘制背景
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 设置模糊效果
    ctx.filter = 'blur(2px) contrast(120%)'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `${previewLayout.fontSize}px ${fontFamily}`
    
    const padding = Math.min(canvas.width, canvas.height) * PADDING_RATIO
    const startY = (canvas.height - previewLayout.contentHeight) / 2 + previewLayout.lineHeight / 2
    
    // 第一层模糊文本
    previewLayout.lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * previewLayout.lineHeight)
    })
    
    // 第二层轻微模糊增强可读性
    ctx.filter = 'blur(0.5px)'
    previewLayout.lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * previewLayout.lineHeight)
    })
    
    ctx.filter = 'none'
  }, [previewLayout, bgColor, textColor, fontFamily])

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgWidthInput(e.target.value)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgHeightInput(e.target.value)
  }

  const handleWidthBlur = () => {
    const numValue = parseInt(imgWidthInput)
    if (isNaN(numValue)) {
      setImgWidthInput(DEFAULT_IMAGE_SIZE.toString())
    } else if (numValue < MIN_IMAGE_SIZE) {
      setImgWidthInput(MIN_IMAGE_SIZE.toString())
    } else if (numValue > MAX_IMAGE_SIZE) {
      setImgWidthInput(MAX_IMAGE_SIZE.toString())
    }
  }

  const handleHeightBlur = () => {
    const numValue = parseInt(imgHeightInput)
    if (isNaN(numValue)) {
      setImgHeightInput(DEFAULT_IMAGE_SIZE.toString())
    } else if (numValue < MIN_IMAGE_SIZE) {
      setImgHeightInput(MIN_IMAGE_SIZE.toString())
    } else if (numValue > MAX_IMAGE_SIZE) {
      setImgHeightInput(MAX_IMAGE_SIZE.toString())
    }
  }

  const handleGenerate = () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')
      
      const finalLayout = calculateTextLayout(text, fontFamily, imgWidth, imgHeight, 200)
      canvas.width = finalLayout.canvasWidth
      canvas.height = finalLayout.canvasHeight
      
      // 绘制背景
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 第一层 - 强模糊
      ctx.filter = 'blur(3px) contrast(130%)'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${finalLayout.fontSize}px ${fontFamily}`
      
      const startY = (canvas.height - finalLayout.contentHeight) / 2 + finalLayout.lineHeight / 2
      finalLayout.lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + i * finalLayout.lineHeight)
      })
      
      // 第二层 - 轻微模糊增强可读性
      ctx.filter = 'blur(1px)'
      finalLayout.lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + i * finalLayout.lineHeight)
      })
      
      // 导出图片
      const link = document.createElement('a')
      link.download = `brat.${exportFormat}`
      link.href = canvas.toDataURL(`image/${exportFormat}`, 1.0)
      link.click()
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Image generation failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="w-full border border-gray-200">
          <CardHeader>
            <h2 className="text-4xl font-bold text-center text-green-800">Brat Generator</h2>
          </CardHeader>

          <CardContent className="space-y-6">
            <div 
              ref={previewContainerRef}
              className="flex items-center justify-center mx-auto bg-gray-100 rounded-lg"
              style={{ height: '400px' }}
            >
              <canvas 
                ref={previewCanvasRef}
                className="max-w-full max-h-full"
                style={{
                  backgroundColor: bgColor,
                  aspectRatio: `${imgWidth}/${imgHeight}`
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Text</Label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-20 text-xl px-4 py-3 border rounded-md resize-none"
                placeholder="Enter your text here"
              />
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => setShowOptions(!showOptions)}
              >
                Advanced Options
                {showOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>

              {showOptions && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 p-1" />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 p-1" />
                  </div>

                  <div className="space-y-2">
                    <Label>Font</Label>
                    <Select value={fontFamily} onValueChange={(value) => setFontFamily(value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Image Width (px)</Label>
                    <Input 
                      type="number"
                      value={imgWidthInput}
                      onChange={handleWidthChange}
                      onBlur={handleWidthBlur}
                      placeholder={`${MIN_IMAGE_SIZE}-${MAX_IMAGE_SIZE}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image Height (px)</Label>
                    <Input 
                      type="number"
                      value={imgHeightInput}
                      onChange={handleHeightChange}
                      onBlur={handleHeightBlur}
                      placeholder={`${MIN_IMAGE_SIZE}-${MAX_IMAGE_SIZE}`}
                    />
                  </div>

                  <div className="space-y-2 col-span-full">
                    <Label>Export Format</Label>
                    <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'png' | 'jpeg' | 'webp')}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (default)</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Button 
                onClick={handleGenerate} 
                className="w-full text-base py-3 hover:scale-105 transition"
              >
                Generate Image
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Click to download your image</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}