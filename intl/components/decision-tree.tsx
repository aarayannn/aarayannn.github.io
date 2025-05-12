"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DecisionTreeProps {
  optimizationResults: any
  parameters: any
}

export default function DecisionTree({ optimizationResults, parameters }: DecisionTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !optimizationResults) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 350

    // Draw decision tree
    drawDecisionTree(ctx, canvas.width, canvas.height, optimizationResults, parameters)
  }, [optimizationResults, parameters])

  // Draw decision tree visualization
  const drawDecisionTree = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    results: any,
    params: any,
  ) => {
    const week = results.week
    const weekParams = params[week]

    // Colors
    const nodeColor = "#10b981"
    const textColor = "#1f2937"
    const lineColor = "#d1d5db"
    const highlightColor = "#047857"

    // Font settings
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // Draw title
    ctx.font = "bold 14px sans-serif"
    ctx.fillStyle = textColor
    ctx.fillText(`Decision Tree untuk Minggu ${week} (${weekParams.stage})`, width / 2, 20)

    // Root node position
    const rootX = width / 2
    const rootY = 60

    // Draw root node
    drawNode(ctx, rootX, rootY, "Parameter Dalam Range?", nodeColor)

    // Draw first level branches
    const level1Y = rootY + 60
    const level1LeftX = rootX - 120
    const level1RightX = rootX + 120

    // Draw lines to children
    drawLine(ctx, rootX, rootY + 15, level1LeftX, level1Y - 15, lineColor)
    drawLine(ctx, rootX, rootY + 15, level1RightX, level1Y - 15, lineColor)

    // Add text to lines
    ctx.font = "11px sans-serif"
    ctx.fillStyle = textColor
    ctx.fillText("Tidak", (rootX + level1LeftX) / 2, rootY + 30)
    ctx.fillText("Ya", (rootX + level1RightX) / 2, rootY + 30)

    // Draw left branch (not in range)
    drawNode(ctx, level1LeftX, level1Y, "Terlalu Tinggi/Rendah?", nodeColor)

    // Draw right branch (in range)
    drawNode(ctx, level1RightX, level1Y, "Parameter Stabil?", nodeColor)

    // Draw second level branches
    const level2Y = level1Y + 60
    const level2LeftLeftX = level1LeftX - 80
    const level2LeftRightX = level1LeftX + 80
    const level2RightLeftX = level1RightX - 80
    const level2RightRightX = level1RightX + 80

    // Draw lines to children - left branch
    drawLine(ctx, level1LeftX, level1Y + 15, level2LeftLeftX, level2Y - 15, lineColor)
    drawLine(ctx, level1LeftX, level1Y + 15, level2LeftRightX, level2Y - 15, lineColor)

    // Add text to lines - left branch
    ctx.fillText("Rendah", (level1LeftX + level2LeftLeftX) / 2, level1Y + 30)
    ctx.fillText("Tinggi", (level1LeftX + level2LeftRightX) / 2, level1Y + 30)

    // Draw lines to children - right branch
    drawLine(ctx, level1RightX, level1Y + 15, level2RightLeftX, level2Y - 15, lineColor)
    drawLine(ctx, level1RightX, level1Y + 15, level2RightRightX, level2Y - 15, lineColor)

    // Add text to lines - right branch
    ctx.fillText("Tidak", (level1RightX + level2RightLeftX) / 2, level1Y + 30)
    ctx.fillText("Ya", (level1RightX + level2RightRightX) / 2, level1Y + 30)

    // Draw second level nodes
    drawNode(ctx, level2LeftLeftX, level2Y, "Naikkan", getDecisionColor(results, "rendah"))
    drawNode(ctx, level2LeftRightX, level2Y, "Turunkan", getDecisionColor(results, "tinggi"))
    drawNode(ctx, level2RightLeftX, level2Y, "Stabilkan", getDecisionColor(results, "tidak stabil"))
    drawNode(ctx, level2RightRightX, level2Y, "Pertahankan", getDecisionColor(results, "optimal"))

    // Draw third level - leaf nodes with recommendations
    const level3Y = level2Y + 70

    // PPM recommendation
    drawLeafNode(
      ctx,
      width / 4,
      level3Y,
      `PPM: ${results.ppm.toFixed(1)}`,
      results.ppmAnalysis.decision,
      getPPMColor(results),
    )

    // pH recommendation
    drawLeafNode(
      ctx,
      (width * 3) / 4,
      level3Y,
      `pH: ${results.ph.toFixed(2)}`,
      results.phAnalysis.decision,
      getPHColor(results),
    )

    // Add legend
    drawLegend(ctx, width, height)
  }

  // Utility function to draw a node
  const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) => {
    // Draw circle
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // Draw text
    ctx.fillStyle = "white"
    ctx.font = "10px sans-serif"
    ctx.fillText(text, x, y + 3)
  }

  // Utility function to draw a line
  const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw a leaf node with recommendation
  const drawLeafNode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    title: string,
    description: string,
    color: string,
  ) => {
    // Draw rectangle
    const width = 180
    const height = 50
    const radius = 5

    ctx.beginPath()
    ctx.roundRect(x - width / 2, y - height / 2, width, height, radius)
    ctx.fillStyle = color
    ctx.fill()

    // Draw text
    ctx.fillStyle = "white"
    ctx.font = "bold 12px sans-serif"
    ctx.fillText(title, x, y - 10)

    ctx.font = "10px sans-serif"

    // Handle long text
    if (description.length > 30) {
      const words = description.split(" ")
      let line = ""
      let lineY = y + 8

      for (const word of words) {
        const testLine = line + word + " "
        if (ctx.measureText(testLine).width > width - 20) {
          ctx.fillText(line, x, lineY)
          line = word + " "
          lineY += 15
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, x, lineY)
    } else {
      ctx.fillText(description, x, y + 8)
    }
  }

  // Draw legend
  const drawLegend = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const legendY = height - 30
    const legendX = width / 2
    const itemWidth = 90

    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#64748b"

    // Legend title
    ctx.fillText("Confidence Level:", legendX, legendY - 15)

    // Legend items
    const items = [
      { color: "#059669", text: "Tinggi" },
      { color: "#0891b2", text: "Sedang" },
      { color: "#9333ea", text: "Rendah" },
    ]

    items.forEach((item, index) => {
      const x = legendX - ((items.length - 1) * itemWidth) / 2 + index * itemWidth

      // Draw circle
      ctx.beginPath()
      ctx.arc(x - 20, legendY, 5, 0, Math.PI * 2)
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw text
      ctx.fillStyle = "#64748b"
      ctx.fillText(item.text, x, legendY + 3)
    })
  }

  // Get color based on decision
  const getDecisionColor = (results: any, type: string) => {
    // Default color
    const defaultColor = "#10b981"

    // PPM decision
    if (results.ppmAnalysis.decision.toLowerCase().includes("terlalu rendah") && type === "rendah") {
      return "#059669"
    }
    if (results.ppmAnalysis.decision.toLowerCase().includes("terlalu tinggi") && type === "tinggi") {
      return "#059669"
    }
    if (results.ppmAnalysis.decision.toLowerCase().includes("tidak stabil") && type === "tidak stabil") {
      return "#0891b2"
    }
    if (results.ppmAnalysis.decision.toLowerCase().includes("dalam range") && type === "optimal") {
      return "#059669"
    }

    // pH decision
    if (results.phAnalysis.decision.toLowerCase().includes("terlalu rendah") && type === "rendah") {
      return "#059669"
    }
    if (results.phAnalysis.decision.toLowerCase().includes("terlalu tinggi") && type === "tinggi") {
      return "#059669"
    }
    if (results.phAnalysis.decision.toLowerCase().includes("tidak stabil") && type === "tidak stabil") {
      return "#0891b2"
    }
    if (results.phAnalysis.decision.toLowerCase().includes("dalam range") && type === "optimal") {
      return "#059669"
    }

    return defaultColor
  }

  // Get PPM color based on analysis
  const getPPMColor = (results: any) => {
    const confidence = results.ppmAnalysis.confidence

    if (confidence === "tinggi") return "#059669"
    if (confidence === "sedang") return "#0891b2"
    return "#9333ea"
  }

  // Get pH color based on analysis
  const getPHColor = (results: any) => {
    const confidence = results.phAnalysis.confidence

    if (confidence === "tinggi") return "#059669"
    if (confidence === "sedang") return "#0891b2"
    return "#9333ea"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualisasi Decision Tree</CardTitle>
        <CardDescription>Algoritma machine learning yang digunakan untuk optimasi parameter</CardDescription>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} style={{ width: "100%", height: "350px" }} />
      </CardContent>
    </Card>
  )
}
