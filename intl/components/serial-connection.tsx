"use client"

import { useState, useEffect } from "react"
import { Usb, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SerialConnectionProps {
  onConnected: (isConnected: boolean) => void
}

export default function SerialConnection({ onConnected }: SerialConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [serialSupported, setSerialSupported] = useState(true)
  const [port, setPort] = useState<any>(null)
  const [log, setLog] = useState<string[]>([])

  // Check if Web Serial API is supported
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setSerialSupported("serial" in navigator)
    }
  }, [])

  // Update parent component when connection status changes
  useEffect(() => {
    onConnected(isConnected)
  }, [isConnected, onConnected])

  const connect = async () => {
    if (!serialSupported) return

    try {
      // Request a serial port
      const selectedPort = await (navigator as any).serial.requestPort()

      // Open the port with appropriate settings for ESP
      await selectedPort.open({
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      })

      addToLog(`Terhubung ke port serial`)
      setPort(selectedPort)
      setIsConnected(true)

      // Start reading from the port
      startReading(selectedPort)
    } catch (error: any) {
      if (error.name !== "NotFoundError") {
        addToLog(`Error: ${error.message}`)
        console.error("Error connecting to serial port:", error)
      }
    }
  }

  const disconnect = async () => {
    if (!port) return

    try {
      // Close readers and writers
      await port.close()
      setPort(null)
      setIsConnected(false)
      addToLog("Koneksi diputus")
    } catch (error: any) {
      addToLog(`Error saat memutus koneksi: ${error.message}`)
      console.error("Error disconnecting:", error)
    }
  }

  const startReading = async (selectedPort: any) => {
    while (selectedPort.readable) {
      try {
        const reader = selectedPort.readable.getReader()

        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            // Convert the received data to a string
            const decoder = new TextDecoder()
            const text = decoder.decode(value)
            addToLog(text)
          }
        } catch (error) {
          console.error("Error reading from serial port:", error)
        } finally {
          reader.releaseLock()
        }
      } catch (error) {
        break
      }
    }
  }

  const addToLog = (message: string) => {
    setLog((prev) => {
      const newLog = [...prev, message]
      // Keep log manageable
      if (newLog.length > 50) {
        return newLog.slice(newLog.length - 50)
      }
      return newLog
    })
  }

  return (
    <div className="space-y-4">
      {!serialSupported && (
        <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Browser Anda tidak mendukung Web Serial API. Gunakan Chrome, Edge, atau Opera.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Usb className="h-4 w-4 text-gray-500" />
          <span>Status Serial:</span>
          {isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Terhubung
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              <AlertCircle className="h-3 w-3 mr-1" /> Tidak Terhubung
            </Badge>
          )}
        </div>

        <Button
          variant={isConnected ? "outline" : "default"}
          size="sm"
          onClick={isConnected ? disconnect : connect}
          disabled={!serialSupported}
        >
          {isConnected ? "Putuskan Koneksi" : "Hubungkan Serial"}
        </Button>
      </div>

      {isConnected && log.length > 0 && (
        <div className="border rounded-md p-2 mt-2 bg-black text-white font-mono text-xs h-20 overflow-y-auto">
          {log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  )
}
