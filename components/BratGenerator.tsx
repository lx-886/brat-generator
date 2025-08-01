'use client'

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

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
];

const MIN_IMAGE_SIZE = 200; // 最小图片尺寸
const DEFAULT_IMAGE_SIZE = 400; // 默认图片尺寸
const MAX_IMAGE_SIZE = 1200; // 最大图片尺寸
const PADDING_RATIO = 0.08; // 内边距比例
const MIN_FONT_SIZE = 12; // 最小字体大小
const LINE_HEIGHT_RATIO = 1.2; // 行高比例
const DEFAULT_BLUR_AMOUNT = 2; // 默认模糊程度
const MAX_BLUR_AMOUNT = 10; // 最大模糊程度

interface TextLayout {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  contentHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface TextShadow {
  enabled: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}

interface TextStroke {
  enabled: boolean;
  color: string;
  width: number;
}

interface GlowEffect {
  enabled: boolean;
  color: string;
  size: number;
  intensity: number;
}

interface BgGradient {
  enabled: boolean;
  type: 'linear' | 'radial';
  angle: number;
  colors: string[];
}

interface BgPattern {
  enabled: boolean;
  type: 'grid' | 'dots' | 'lines';
  size: number;
  color: string;
}

interface Preset {
  id: string;
  name: string;
  settings: {
    textColor: string;
    bgColor: string;
    fontFamily: string;
    textShadow?: TextShadow;
    textStroke?: TextStroke;
    glowEffect?: GlowEffect;
    textRotation?: number;
    flipHorizontal?: boolean;
    blurEnabled?: boolean;
    blurAmount?: number;
    bgGradient?: BgGradient;
    bgPattern?: BgPattern;
  };
}

export default function BratGenerator() {
  // 基本状态
  const [text, setText] = useState('brat');
  const [bgColor, setBgColor] = useState('#8BCF00');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [imgWidthInput, setImgWidthInput] = useState(DEFAULT_IMAGE_SIZE.toString());
  const [imgHeightInput, setImgHeightInput] = useState(DEFAULT_IMAGE_SIZE.toString());
  const [showOptions, setShowOptions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // 高级效果状态
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [blurEnabled, setBlurEnabled] = useState(true);
  const [blurAmount, setBlurAmount] = useState(DEFAULT_BLUR_AMOUNT);
  const [textShadow, setTextShadow] = useState<TextShadow>({
    enabled: false,
    color: '#000000',
    offsetX: 2,
    offsetY: 2,
    blur: 4
  });
  const [textStroke, setTextStroke] = useState<TextStroke>({
    enabled: false,
    color: '#000000',
    width: 1
  });
  const [glowEffect, setGlowEffect] = useState<GlowEffect>({
    enabled: false,
    color: '#ffffff',
    size: 10,
    intensity: 1
  });
  const [textRotation, setTextRotation] = useState(0);
  const [bgGradient, setBgGradient] = useState<BgGradient>({
    enabled: false,
    type: 'linear',
    angle: 90,
    colors: ['#8BCF00', '#6AA300']
  });
  const [bgPattern, setBgPattern] = useState<BgPattern>({
    enabled: false,
    type: 'grid',
    size: 20,
    color: '#00000020'
  });
  
  // 预设系统
  const [presets] = useState<Preset[]>([
    { 
      id: 'neon', 
      name: 'Neon Effect',
      settings: {
        textColor: '#ffffff',
        bgColor: '#000000',
        fontFamily: 'Arial, sans-serif',
        glowEffect: { enabled: true, color: '#ff00ff', size: 15, intensity: 1.5 },
        textShadow: { enabled: true, color: '#ff00ff', offsetX: 0, offsetY: 0, blur: 10 }
      }
    },
    {
      id: 'vintage',
      name: 'Vintage Style',
      settings: {
        textColor: '#8B4513',
        bgColor: '#F5F5DC',
        fontFamily: '"Times New Roman", serif',
        textStroke: { enabled: true, color: '#8B4513', width: 0.5 }
      }
    },
    {
      id: 'gradient',
      name: 'Gradient Background',
      settings: {
        textColor: '#000000',
        bgColor: '#8BCF00',
        fontFamily: 'Helvetica, sans-serif',
        bgGradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          colors: ['#8BCF00', '#6AA300', '#4C7A00']
        }
      }
    }
  ]);
  
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 计算图片宽度
  const imgWidth = useMemo(() => {
    const numValue = parseInt(imgWidthInput);
    return isNaN(numValue) ? DEFAULT_IMAGE_SIZE : 
      Math.min(MAX_IMAGE_SIZE, Math.max(MIN_IMAGE_SIZE, numValue));
  }, [imgWidthInput]);

  // 计算图片高度
  const imgHeight = useMemo(() => {
    const numValue = parseInt(imgHeightInput);
    return isNaN(numValue) ? DEFAULT_IMAGE_SIZE : 
      Math.min(MAX_IMAGE_SIZE, Math.max(MIN_IMAGE_SIZE, numValue));
  }, [imgHeightInput]);

  // 计算文本布局
  const calculateTextLayout = (
    text: string,
    fontFamily: string,
    containerWidth: number,
    containerHeight: number,
    maxFontSize: number
  ): TextLayout => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const padding = Math.min(containerWidth, containerHeight) * PADDING_RATIO;
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;
    
    let fontSize = Math.min(maxFontSize, availableHeight);
    let lines: string[] = [];
    let lineHeight = fontSize * LINE_HEIGHT_RATIO;
    let contentHeight = 0;

    // 分割文本行（支持中文）
    const splitLines = (text: string): string[] => {
      const paragraphs = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const allLines: string[] = [];
      
      // 检测是否为中文、日文等宽字符
      const canBreak = (char: string) => /[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/.test(char);
      
      for (const para of paragraphs) {
        let currentLine = '';
        
        for (const char of para) {
          const testLine = currentLine + char;
          ctx.font = `${fontSize}px ${fontFamily}`;
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width <= availableWidth) {
            currentLine = testLine;
          } else {
            if (currentLine.length > 0) allLines.push(currentLine);
            currentLine = canBreak(char) ? '' : char;
          }
        }
        
        if (currentLine.length > 0) allLines.push(currentLine);
      }
      
      return allLines;
    }

    // 自动调整字体大小以适应容器
    while (fontSize >= MIN_FONT_SIZE) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      lines = splitLines(text);
      lineHeight = fontSize * LINE_HEIGHT_RATIO;
      contentHeight = lines.length * lineHeight;
      
      if (contentHeight <= availableHeight * 0.9) break;
      fontSize -= 1;
    }

    return {
      fontSize,
      lineHeight,
      lines,
      contentHeight,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight
    };
  }

  // 处理镜像文字
  const applyFlipEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  // 应用模糊效果
  const applyBlurEffect = (ctx: CanvasRenderingContext2D) => {
    if (blurEnabled && blurAmount > 0) {
      ctx.filter = `blur(${blurAmount}px) contrast(${100 + blurAmount * 10}%)`;
    } else {
      ctx.filter = 'none';
    }
  }

  // 创建线性渐变
  const createLinearGradient = (ctx: CanvasRenderingContext2D, angle: number, colors: string[], width: number, height: number) => {
    const radians = (angle * Math.PI) / 180;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 计算渐变方向
    const x1 = centerX - Math.cos(radians) * width;
    const y1 = centerY - Math.sin(radians) * height;
    const x2 = centerX + Math.cos(radians) * width;
    const y2 = centerY + Math.sin(radians) * height;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const step = 1 / (colors.length - 1);
    
    colors.forEach((color, i) => {
      gradient.addColorStop(i * step, color);
    });
    
    return gradient;
  };

  // 创建径向渐变
  const createRadialGradient = (ctx: CanvasRenderingContext2D, colors: string[], width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) / 2;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    const step = 1 / (colors.length - 1);
    
    colors.forEach((color, i) => {
      gradient.addColorStop(i * step, color);
    });
    
    return gradient;
  };

  // 绘制图案背景
  const drawPatternBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = bgPattern.color;
    
    switch (bgPattern.type) {
      case 'grid':
        for (let x = 0; x < width; x += bgPattern.size) {
          ctx.fillRect(x, 0, 1, height);
        }
        for (let y = 0; y < height; y += bgPattern.size) {
          ctx.fillRect(0, y, width, 1);
        }
        break;
        
      case 'dots':
        for (let x = bgPattern.size / 2; x < width; x += bgPattern.size) {
          for (let y = bgPattern.size / 2; y < height; y += bgPattern.size) {
            ctx.beginPath();
            ctx.arc(x, y, bgPattern.size / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'lines':
        for (let y = 0; y < height; y += bgPattern.size) {
          ctx.fillRect(0, y, width, 1);
        }
        break;
    }
  };

  // 应用文字效果
  const applyTextEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    // 文字描边
    if (textStroke.enabled) {
      ctx.strokeStyle = textStroke.color;
      ctx.lineWidth = textStroke.width;
      ctx.strokeText(text, x, y);
    }
    
    // 文字阴影
    if (textShadow.enabled) {
      ctx.shadowColor = textShadow.color;
      ctx.shadowBlur = textShadow.blur;
      ctx.shadowOffsetX = textShadow.offsetX;
      ctx.shadowOffsetY = textShadow.offsetY;
    }
    
    // 发光效果
    if (glowEffect.enabled) {
      ctx.shadowColor = glowEffect.color;
      ctx.shadowBlur = glowEffect.size * glowEffect.intensity;
    }
    
    // 绘制文字
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    
    // 重置效果
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // 应用背景效果
  const applyBackgroundEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 渐变背景
    if (bgGradient.enabled) {
      const gradient = bgGradient.type === 'linear'
        ? createLinearGradient(ctx, bgGradient.angle, bgGradient.colors, width, height)
        : createRadialGradient(ctx, bgGradient.colors, width, height);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } 
    // 图案背景
    else if (bgPattern.enabled) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      drawPatternBackground(ctx, width, height);
    }
    // 纯色背景
    else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }
  };

  // 应用文字旋转
  const applyTextRotation = (ctx: CanvasRenderingContext2D, rotation: number, width: number, height: number) => {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
  };

  // 计算预览布局 - 直接使用用户设置的尺寸
  const previewLayout = useMemo(() => {
    if (!isMounted) return null;
    
    return calculateTextLayout(text, fontFamily, imgWidth, imgHeight, imgHeight);
  }, [text, fontFamily, imgWidth, imgHeight, isMounted]);

  // 更新预览画布
  useEffect(() => {
    if (!previewLayout || !previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = previewLayout.canvasWidth;
    canvas.height = previewLayout.canvasHeight;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 保存当前画布状态
    ctx.save();
    
    // 如果需要镜像效果，先应用变换
    if (flipHorizontal) {
      applyFlipEffect(ctx, canvas);
    }
    
    // 绘制背景
    applyBackgroundEffects(ctx, canvas.width, canvas.height);
    
    // 应用文字旋转
    if (textRotation !== 0) {
      applyTextRotation(ctx, textRotation, canvas.width, canvas.height);
    }
    
    // 应用模糊效果
    applyBlurEffect(ctx);
    
    // 设置文本样式
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${previewLayout.fontSize}px ${fontFamily}`;
    
    // 计算文本起始位置
    const startY = (canvas.height - previewLayout.contentHeight) / 2 + previewLayout.lineHeight / 2;
    
    // 绘制文本行
    previewLayout.lines.forEach((line, i) => {
      const y = startY + i * previewLayout.lineHeight;
      applyTextEffects(ctx, canvas.width / 2, y, line);
    });
    
    // 恢复画布状态
    ctx.restore();
  }, [
    previewLayout, bgColor, textColor, fontFamily, flipHorizontal, 
    blurEnabled, blurAmount, textShadow, textStroke, glowEffect, 
    textRotation, bgGradient, bgPattern
  ]);

  // 处理宽度输入
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgWidthInput(e.target.value);
  }

  // 处理高度输入
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgHeightInput(e.target.value);
  }

  // 处理宽度输入框失去焦点
  const handleWidthBlur = () => {
    const numValue = parseInt(imgWidthInput);
    if (isNaN(numValue)) {
      setImgWidthInput(DEFAULT_IMAGE_SIZE.toString());
    } else if (numValue < MIN_IMAGE_SIZE) {
      setImgWidthInput(MIN_IMAGE_SIZE.toString());
    } else if (numValue > MAX_IMAGE_SIZE) {
      setImgWidthInput(MAX_IMAGE_SIZE.toString());
    }
  }

  // 处理高度输入框失去焦点
  const handleHeightBlur = () => {
    const numValue = parseInt(imgHeightInput);
    if (isNaN(numValue)) {
      setImgHeightInput(DEFAULT_IMAGE_SIZE.toString());
    } else if (numValue < MIN_IMAGE_SIZE) {
      setImgHeightInput(MIN_IMAGE_SIZE.toString());
    } else if (numValue > MAX_IMAGE_SIZE) {
      setImgHeightInput(MAX_IMAGE_SIZE.toString());
    }
  }

  // 处理模糊程度变化
  const handleBlurChange = (value: number[]) => {
    setBlurAmount(value[0]);
  }

  // 应用预设
  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    
    setCurrentPreset(presetId);
    
    // 应用预设中的各项设置
    const { settings } = preset;
    if (settings.textColor) setTextColor(settings.textColor);
    if (settings.bgColor) setBgColor(settings.bgColor);
    if (settings.fontFamily) setFontFamily(settings.fontFamily);
    
    if (settings.textShadow) setTextShadow(settings.textShadow);
    if (settings.textStroke) setTextStroke(settings.textStroke);
    if (settings.glowEffect) setGlowEffect(settings.glowEffect);
    if (settings.textRotation) setTextRotation(settings.textRotation);
    if (settings.flipHorizontal !== undefined) setFlipHorizontal(settings.flipHorizontal);
    if (settings.blurEnabled !== undefined) setBlurEnabled(settings.blurEnabled);
    if (settings.blurAmount !== undefined) setBlurAmount(settings.blurAmount);
    if (settings.bgGradient) setBgGradient(settings.bgGradient);
    if (settings.bgPattern) setBgPattern(settings.bgPattern);
  };

  // 生成图片
  const handleGenerate = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext('2d')!;
      
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 保存当前画布状态
      ctx.save();
      
      // 如果需要镜像效果，先应用变换
      if (flipHorizontal) {
        applyFlipEffect(ctx, canvas);
      }
      
      // 绘制背景
      applyBackgroundEffects(ctx, canvas.width, canvas.height);
      
      // 应用文字旋转
      if (textRotation !== 0) {
        applyTextRotation(ctx, textRotation, canvas.width, canvas.height);
      }
      
      // 应用模糊效果
      applyBlurEffect(ctx);
      
      // 设置文本样式
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 使用实际尺寸计算文本布局
      const layout = calculateTextLayout(
        text, 
        fontFamily, 
        canvas.width, 
        canvas.height, 
        canvas.height
      );
      
      ctx.font = `${layout.fontSize}px ${fontFamily}`;
      
      // 计算文本起始位置
      const startY = (canvas.height - layout.contentHeight) / 2 + layout.lineHeight / 2;
      
      // 绘制文本行
      layout.lines.forEach((line, i) => {
        const y = startY + i * layout.lineHeight;
        applyTextEffects(ctx, canvas.width / 2, y, line);
      });
      
      // 恢复画布状态
      ctx.restore();
      
      // 生成PNG图片
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'brat-image.png';
      link.click();
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Image generation failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-start justify-center p-4 gap-6">
      {/* 左侧预览区域 */}
      <div className="w-full lg:w-[60%] flex flex-col">
        <Card className="w-full h-full border border-gray-200">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-green-800">Brat Preview ({imgWidth}×{imgHeight}px)</h2>
          </CardHeader>
          <CardContent className="flex-grow">
            <div 
              ref={previewContainerRef}
              className="flex items-center justify-center h-full bg-gray-100 rounded-lg py-4 overflow-hidden"
              style={{ minHeight: '400px' }} // 确保预览区域有最小高度
            >
              <canvas
                id="previewCanvas"
                ref={previewCanvasRef}
                className="max-w-full max-h-full"
                style={{
                  backgroundColor: bgColor,
                  aspectRatio: `${imgWidth}/${imgHeight}`,
                  filter: blurEnabled ? `blur(${Math.min(blurAmount / 2, 3)}px)` : 'none'
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Preview updates as you adjust settings</p>
          </CardFooter>
        </Card>
      </div>

      {/* 右侧控制面板 */}
      <div className="w-full lg:w-[40%]">
        <Card className="w-full border border-gray-200">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-green-800">Brat Generator</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold">Text Content</Label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-24 px-4 py-3 border rounded-md resize-none"
                placeholder="Enter your text here"
              />
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between py-3"
                onClick={() => setShowOptions(!showOptions)}
              >
                <div className="flex items-center">
                  <span>{showOptions ? 'Hide' : 'Show'} Advanced Options</span>
                </div>
                {showOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>

              {showOptions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* 基本设置 */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-bold text-lg pb-2 border-b">Basic Settings</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)} 
                        className="h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)} 
                        className="h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Font Family</Label>
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
                      className="w-full"
                      min={MIN_IMAGE_SIZE}
                      max={MAX_IMAGE_SIZE}
                      placeholder={`${MIN_IMAGE_SIZE}-${MAX_IMAGE_SIZE}`}
                    />
                    <p className="text-xs text-muted-foreground">Range: {MIN_IMAGE_SIZE}-{MAX_IMAGE_SIZE}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Image Height (px)</Label>
                    <Input 
                      type="number"
                      value={imgHeightInput}
                      onChange={handleHeightChange}
                      onBlur={handleHeightBlur}
                      className="w-full"
                      min={MIN_IMAGE_SIZE}
                      max={MAX_IMAGE_SIZE}
                      placeholder={`${MIN_IMAGE_SIZE}-${MAX_IMAGE_SIZE}`}
                    />
                    <p className="text-xs text-muted-foreground">Range: {MIN_IMAGE_SIZE}-{MAX_IMAGE_SIZE}</p>
                  </div>

                  {/* 文字效果 */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-bold text-lg pb-2 border-b">Text Effects</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Flip Text Horizontally</Label>
                      <Switch 
                        id="flip-horizontal" 
                        checked={flipHorizontal} 
                        onCheckedChange={setFlipHorizontal}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Blur Effect</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="blur-enabled" 
                          checked={blurEnabled} 
                          onCheckedChange={setBlurEnabled}
                        />
                        <Label htmlFor="blur-enabled">{blurEnabled ? 'Enabled' : 'Disabled'}</Label>
                      </div>
                    </div>
                    
                    {blurEnabled && (
                      <div className="space-y-1 px-2">
                        <Label>Blur Amount: {blurAmount}px</Label>
                        <Slider 
                          defaultValue={[blurAmount]}
                          min={0}
                          max={MAX_BLUR_AMOUNT}
                          step={0.5}
                          onValueChange={handleBlurChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Text Shadow</Label>
                      <Switch 
                        id="text-shadow" 
                        checked={textShadow.enabled} 
                        onCheckedChange={checked => setTextShadow({...textShadow, enabled: checked})}
                      />
                    </div>
                    {textShadow.enabled && (
                      <div className="space-y-2 pl-4">
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            value={textShadow.color} 
                            onChange={e => setTextShadow({...textShadow, color: e.target.value})}
                            className="h-8 w-10 p-1"
                          />
                          <div className="flex-1 space-y-1">
                            <Label>Offset X: {textShadow.offsetX}px</Label>
                            <Slider 
                              value={[textShadow.offsetX]}
                              min={-20}
                              max={20}
                              step={1}
                              onValueChange={val => setTextShadow({...textShadow, offsetX: val[0]})}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Offset Y: {textShadow.offsetY}px</Label>
                          <Slider 
                            value={[textShadow.offsetY]}
                            min={-20}
                            max={20}
                            step={1}
                            onValueChange={val => setTextShadow({...textShadow, offsetY: val[0]})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Blur Radius: {textShadow.blur}px</Label>
                          <Slider 
                            value={[textShadow.blur]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={val => setTextShadow({...textShadow, blur: val[0]})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Text Stroke</Label>
                      <Switch 
                        id="text-stroke" 
                        checked={textStroke.enabled} 
                        onCheckedChange={checked => setTextStroke({...textStroke, enabled: checked})}
                      />
                    </div>
                    {textStroke.enabled && (
                      <div className="flex gap-2 pl-4">
                        <Input 
                          type="color" 
                          value={textStroke.color} 
                          onChange={e => setTextStroke({...textStroke, color: e.target.value})}
                          className="h-8 w-10 p-1"
                        />
                        <div className="flex-1 space-y-1">
                          <Label>Stroke Width: {textStroke.width}px</Label>
                          <Slider 
                            value={[textStroke.width]}
                            min={0.5}
                            max={5}
                            step={0.5}
                            onValueChange={val => setTextStroke({...textStroke, width: val[0]})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Glow Effect</Label>
                      <Switch 
                        id="glow-effect" 
                        checked={glowEffect.enabled} 
                        onCheckedChange={checked => setGlowEffect({...glowEffect, enabled: checked})}
                      />
                    </div>
                    {glowEffect.enabled && (
                      <div className="space-y-2 pl-4">
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            value={glowEffect.color} 
                            onChange={e => setGlowEffect({...glowEffect, color: e.target.value})}
                            className="h-8 w-10 p-1"
                          />
                          <div className="flex-1 space-y-1">
                            <Label>Glow Size: {glowEffect.size}px</Label>
                            <Slider 
                              value={[glowEffect.size]}
                              min={1}
                              max={30}
                              step={1}
                              onValueChange={val => setGlowEffect({...glowEffect, size: val[0]})}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Glow Intensity: {glowEffect.intensity}</Label>
                          <Slider 
                            value={[glowEffect.intensity]}
                            min={0.1}
                            max={3}
                            step={0.1}
                            onValueChange={val => setGlowEffect({...glowEffect, intensity: val[0]})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Text Rotation: {textRotation}°</Label>
                    <Slider 
                      value={[textRotation]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={val => setTextRotation(val[0])}
                    />
                  </div>
                  
                  {/* 背景效果 */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-bold text-lg pb-2 border-b">Background Effects</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Gradient Background</Label>
                      <Switch 
                        id="bg-gradient" 
                        checked={bgGradient.enabled} 
                        onCheckedChange={checked => setBgGradient({...bgGradient, enabled: checked})}
                      />
                    </div>
                    {bgGradient.enabled && (
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center gap-2">
                          <Label>Type:</Label>
                          <Select 
                            value={bgGradient.type} 
                            onValueChange={type => setBgGradient({...bgGradient, type: type as "linear" | "radial"})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="radial">Radial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {bgGradient.type === 'linear' && (
                          <div className="space-y-1">
                            <Label>Angle: {bgGradient.angle}°</Label>
                            <Slider 
                              value={[bgGradient.angle]}
                              min={0}
                              max={360}
                              step={1}
                              onValueChange={val => setBgGradient({...bgGradient, angle: val[0]})}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label>Gradient Colors</Label>
                          <div className="flex gap-2 flex-wrap">
                            {bgGradient.colors.map((color, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <Input 
                                  type="color" 
                                  value={color} 
                                  onChange={e => {
                                    const newColors = [...bgGradient.colors];
                                    newColors[index] = e.target.value;
                                    setBgGradient({...bgGradient, colors: newColors});
                                  }}
                                  className="h-8 w-8 p-1"
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const newColors = [...bgGradient.colors];
                                    newColors.splice(index, 1);
                                    setBgGradient({...bgGradient, colors: newColors});
                                  }}
                                >
                                  -
                                </Button>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const newColors = [...bgGradient.colors, '#ffffff'];
                                setBgGradient({...bgGradient, colors: newColors});
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Pattern Background</Label>
                      <Switch 
                        id="bg-pattern" 
                        checked={bgPattern.enabled} 
                        onCheckedChange={checked => setBgPattern({...bgPattern, enabled: checked})}
                      />
                    </div>
                    {bgPattern.enabled && (
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center gap-2">
                          <Label>Type:</Label>
                          <Select 
                            value={bgPattern.type} 
                            onValueChange={type => setBgPattern({...bgPattern, type: type as "grid" | "dots" | "lines"})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid">Grid</SelectItem>
                              <SelectItem value="dots">Dots</SelectItem>
                              <SelectItem value="lines">Lines</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            value={bgPattern.color} 
                            onChange={e => setBgPattern({...bgPattern, color: e.target.value})}
                            className="h-8 w-10 p-1"
                          />
                          <div className="flex-1 space-y-1">
                            <Label>Pattern Size: {bgPattern.size}px</Label>
                            <Slider 
                              value={[bgPattern.size]}
                              min={5}
                              max={50}
                              step={1}
                              onValueChange={val => setBgPattern({...bgPattern, size: val[0]})}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 预设系统 */}
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-bold text-lg pb-2 border-b">Presets</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map(preset => (
                        <Button
                          key={preset.id}
                          variant={currentPreset === preset.id ? "default" : "outline"}
                          onClick={() => applyPreset(preset.id)}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleGenerate} 
                className="w-full text-lg py-5 hover:scale-[1.02] transition-transform duration-200 ease-in-out bg-green-600 hover:bg-green-700"
              >
                Generate and Download PNG Image
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground text-center">
              Image size: {imgWidth}×{imgHeight}px
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}