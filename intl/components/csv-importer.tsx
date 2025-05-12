"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Papa from "papaparse"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CSVImporterProps {
  onDataImported: (data: any[]) => void
}

export default function CSVImporter({ onDataImported }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError("File CSV tidak mengandung data")
          return
        }

        // Check if file has required columns
        const firstRow = results.data[0] as any
        if (!firstRow.ppm || !firstRow.ph) {
          setError("File CSV harus memiliki kolom 'ppm' dan 'ph'")
          return
        }

        // Show preview (first 5 rows)
        setPreviewData(results.data.slice(0, 5) as any[])
      },
      error: (error) => {
        setError(`Error membaca file CSV: ${error.message}`)
      },
    })
  }

  const handleImport = () => {
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Process data - convert string values to numbers
        const processedData = results.data
          .map((row: any) => ({
            ...row,
            ppm: Number.parseFloat(row.ppm),
            ph: Number.parseFloat(row.ph),
            temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
            timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
          }))
          .filter((row: any) => !isNaN(row.ppm) && !isNaN(row.ph))

        onDataImported(processedData)
        alert(`Berhasil import ${processedData.length} data dari CSV`)
      },
      error: (error) => {
        setError(`Error importing file: ${error.message}`)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-emerald-50 file:text-emerald-700
                    hover:file:bg-emerald-100"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {previewData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Preview Data:</h4>
          <div className="border rounded-md overflow-x-auto max-h-60">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(previewData[0]).map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              {file?.name} • {previewData.length} dari {file ? "banyak" : "0"} baris
            </p>
            <Button onClick={handleImport} disabled={!file}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
