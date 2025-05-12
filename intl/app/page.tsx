"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Droplet, ThermometerIcon, FileText, Upload, Database, BarChart2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ParameterChart from "@/components/parameter-chart"
import CSVImporter from "@/components/csv-importer"
import SerialConnection from "@/components/serial-connection"
import DecisionTree from "@/components/decision-tree"

// Default parameter ranges for each growth week
const DEFAULT_PARAMETERS = {
  1: { ppmMin: 400, ppmMax: 500, phMin: 5.5, phMax: 6.0, temp: 23, stage: "Semai" },
  2: { ppmMin: 600, ppmMax: 800, phMin: 5.8, phMax: 6.2, temp: 25, stage: "Vegetatif" },
  3: { ppmMin: 800, ppmMax: 1000, phMin: 6.0, phMax: 6.3, temp: 25, stage: "Vegetatif" },
  4: { ppmMin: 1000, ppmMax: 1200, phMin: 6.0, phMax: 6.5, temp: 23, stage: "Generatif" },
}

export default function Home() {
  // State for the selected tab
  const [activeTab, setActiveTab] = useState("dashboard")

  // State for parameter settings
  const [parameters, setParameters] = useState(DEFAULT_PARAMETERS)
  const [currentWeek, setCurrentWeek] = useState(1)

  // State for monitoring data
  const [monitoringData, setMonitoringData] = useState<any[]>([])

  // State for sensor readings
  const [sensors, setSensors] = useState({
    ppm: 0,
    ph: 0,
    temperature: 0,
    lastUpdated: null as Date | null,
  })

  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("")

  // State for CSV data
  const [csvData, setCsvData] = useState<any[]>([])

  // State for optimization results
  const [optimizationResults, setOptimizationResults] = useState<any>(null)

  // State for serial connection
  const [serialConnected, setSerialConnected] = useState(false)

  // Load saved parameters on initial load
  useEffect(() => {
    const savedParams = localStorage.getItem("insaf-parameters")
    if (savedParams) {
      try {
        setParameters(JSON.parse(savedParams))
      } catch (e) {
        console.error("Error loading saved parameters:", e)
      }
    }

    // Mock sensor readings
    const interval = setInterval(() => {
      mockSensorReadings()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Mock sensor readings for demo purposes
  const mockSensorReadings = () => {
    const week = parameters[currentWeek]

    // Generate random values within optimal range with slight variations
    const ppm = Math.random() * (week.ppmMax - week.ppmMin) + week.ppmMin
    const ph = Math.random() * (week.phMax - week.phMin) + week.phMin
    const temp = week.temp + (Math.random() * 2 - 1)

    setSensors({
      ppm: Math.round(ppm * 10) / 10,
      ph: Math.round(ph * 100) / 100,
      temperature: Math.round(temp * 10) / 10,
      lastUpdated: new Date(),
    })

    // Add to monitoring data
    setMonitoringData((prev) => {
      const newData = [
        ...prev,
        {
          timestamp: new Date(),
          ppm,
          ph,
          temperature: temp,
          week: currentWeek,
        },
      ]

      // Keep only the last 100 readings
      if (newData.length > 100) {
        return newData.slice(newData.length - 100)
      }
      return newData
    })
  }

  // Save parameters to local storage
  const saveParameters = () => {
    localStorage.setItem("insaf-parameters", JSON.stringify(parameters))
    alert("Parameter berhasil disimpan!")
  }

  // Reset parameters to default
  const resetParameters = () => {
    if (confirm("Apakah Anda yakin ingin mereset parameter ke nilai default?")) {
      setParameters(DEFAULT_PARAMETERS)
      localStorage.setItem("insaf-parameters", JSON.stringify(DEFAULT_PARAMETERS))
    }
  }

  // Handle parameter change
  const handleParameterChange = (week: number, param: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [week]: {
        ...prev[week],
        [param]: value,
      },
    }))
  }

  // Handle week selection
  const handleWeekSelection = (week: string) => {
    setCurrentWeek(Number.parseInt(week))
  }

  // Handle CSV data import
  const handleCSVImport = (data: any[]) => {
    setCsvData(data)
  }

  // Handle optimization
  const handleOptimize = () => {
    // Use the DecisionTree component to analyze the data
    const ppmValues = monitoringData.map((d) => d.ppm)
    const phValues = monitoringData.map((d) => d.ph)

    if (ppmValues.length === 0 || phValues.length === 0) {
      alert("Tidak ada data monitoring yang cukup untuk dianalisis!")
      return
    }

    // Get current week parameters
    const weekParams = parameters[currentWeek]

    // Run decision tree analysis
    const ppmAnalysis = analyzeWithDecisionTree(currentWeek, ppmValues, "ppm")
    const phAnalysis = analyzeWithDecisionTree(currentWeek, phValues, "ph")

    // Calculate median values
    const medianPpm = calculateMedian(ppmValues)
    const medianPh = calculateMedian(phValues)

    // Adjust to optimal range with decision tree recommendations
    const optimalPpm = Math.max(weekParams.ppmMin, Math.min(weekParams.ppmMax, medianPpm + ppmAnalysis.adjustment))

    const optimalPh = Math.max(weekParams.phMin, Math.min(weekParams.phMax, medianPh + phAnalysis.adjustment))

    // Set optimization results
    setOptimizationResults({
      ppm: optimalPpm,
      ph: optimalPh,
      temp: weekParams.temp,
      ppmAnalysis,
      phAnalysis,
      week: currentWeek,
    })

    // Open the results tab
    setActiveTab("results")
  }

  // Analysis with decision tree
  const analyzeWithDecisionTree = (week: number, values: number[], parameter: string) => {
    const params = parameters[week]
    const min = parameter === "ppm" ? params.ppmMin : params.phMin
    const max = parameter === "ppm" ? params.ppmMax : params.phMax

    // Calculate statistics
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const range = Math.max(...values) - Math.min(...values)
    const stability = range / (max - min)

    // Decision tree rules
    if (values.some((v) => v < min * 0.8 || v > max * 1.2)) {
      return {
        decision: "Terdapat nilai ekstrim yang perlu diperiksa",
        adjustment: 0,
        confidence: "rendah",
      }
    } else if (stability > 0.5) {
      return {
        decision: "Parameter tidak stabil, perlu penyesuaian",
        adjustment: (avg - (min + max) / 2) * 0.5,
        confidence: "sedang",
      }
    } else if (avg < min) {
      return {
        decision: "Parameter terlalu rendah, perlu dinaikkan",
        adjustment: (min - avg) * 0.7,
        confidence: "tinggi",
      }
    } else if (avg > max) {
      return {
        decision: "Parameter terlalu tinggi, perlu diturunkan",
        adjustment: (max - avg) * 0.7,
        confidence: "tinggi",
      }
    } else {
      return {
        decision: "Parameter dalam range optimal",
        adjustment: 0,
        confidence: "tinggi",
      }
    }
  }

  // Calculate median
  const calculateMedian = (values: number[]) => {
    if (values.length === 0) return 0

    const sorted = [...values].sort((a, b) => a - b)
    const half = Math.floor(sorted.length / 2)

    if (sorted.length % 2) {
      return sorted[half]
    }
    return (sorted[half - 1] + sorted[half]) / 2
  }

  // Export monitoring data to CSV
  const exportDataToCSV = () => {
    if (monitoringData.length === 0) {
      alert("Tidak ada data untuk diexport!")
      return
    }

    // Prepare CSV content
    const headers = ["timestamp", "week", "ppm", "ph", "temperature"]
    const csvRows = [headers.join(",")]

    monitoringData.forEach((data) => {
      const row = [
        data.timestamp.toISOString(),
        data.week,
        data.ppm.toFixed(1),
        data.ph.toFixed(2),
        data.temperature.toFixed(1),
      ]
      csvRows.push(row.join(","))
    })

    // Create download link
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `insaf-hydroponics-data-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Generate Arduino/ESP firmware code
  const generateFirmwareCode = () => {
    // Use the current optimized parameters or defaults
    const ppmTarget = optimizationResults
      ? optimizationResults.ppm
      : parameters[currentWeek].ppmMin + (parameters[currentWeek].ppmMax - parameters[currentWeek].ppmMin) / 2
    const phTarget = optimizationResults
      ? optimizationResults.ph
      : parameters[currentWeek].phMin + (parameters[currentWeek].phMax - parameters[currentWeek].phMin) / 2
    const tempTarget = parameters[currentWeek].temp

    // For simplicity, this is a snippet of what would be generated
    // In a real implementation, this would generate the full Arduino code
    const code = `
// INSAF Hidroponik Pakcoy - Auto Generated Parameters
// Week ${currentWeek} - ${parameters[currentWeek].stage}

// Target parameters from machine learning optimization
#define PPM_TARGET ${ppmTarget.toFixed(1)}
#define PH_TARGET ${phTarget.toFixed(2)}
#define TEMP_TARGET ${tempTarget}

// Min/Max range for this growth stage
#define PPM_MIN ${parameters[currentWeek].ppmMin}
#define PPM_MAX ${parameters[currentWeek].ppmMax}
#define PH_MIN ${parameters[currentWeek].phMin}
#define PH_MAX ${parameters[currentWeek].phMax}
    `

    return code
  }

  // Simulate firmware upload
  const simulateUpload = () => {
    setUploadProgress(0)
    setUploadStatus("Memulai upload...")

    const intervalId = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10

        if (newProgress >= 100) {
          clearInterval(intervalId)
          setUploadStatus("Upload berhasil! ESP akan restart dengan parameter baru.")
          return 100
        }

        const messages = [
          "Memulai upload...",
          "Menghubungkan ke ESP...",
          "Mempersiapkan firmware...",
          "Menghapus flash...",
          "Mengupload firmware...",
          "Memverifikasi firmware...",
          "Menyelesaikan upload...",
          "Memulai ulang ESP...",
        ]

        setUploadStatus(messages[Math.floor(newProgress / 15)])
        return newProgress
      })
    }, 500)
  }

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
          <Droplet className="h-7 w-7 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">INSAF - Smart Hidroponik Pakcoy</h1>
        <p className="text-gray-500 max-w-2xl">
          Sistem monitoring dan kontrol hidroponik dengan machine learning untuk mengoptimalkan parameter pertumbuhan
          pakcoy.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="parameters">Parameter</TabsTrigger>
          <TabsTrigger value="monitor">Monitoring</TabsTrigger>
          <TabsTrigger value="upload">ESP Upload</TabsTrigger>
          <TabsTrigger value="results">Hasil Analisis</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PPM/EC</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensors.ppm.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Range: {parameters[currentWeek].ppmMin} - {parameters[currentWeek].ppmMax}
                </p>
                <Progress
                  className="mt-2"
                  value={Math.min(
                    100,
                    Math.max(
                      0,
                      ((sensors.ppm - parameters[currentWeek].ppmMin) /
                        (parameters[currentWeek].ppmMax - parameters[currentWeek].ppmMin)) *
                        100,
                    ),
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensors.ph.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Range: {parameters[currentWeek].phMin} - {parameters[currentWeek].phMax}
                </p>
                <Progress
                  className="mt-2"
                  value={Math.min(
                    100,
                    Math.max(
                      0,
                      ((sensors.ph - parameters[currentWeek].phMin) /
                        (parameters[currentWeek].phMax - parameters[currentWeek].phMin)) *
                        100,
                    ),
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suhu</CardTitle>
                <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensors.temperature.toFixed(1)}°C</div>
                <p className="text-xs text-muted-foreground">Optimal: {parameters[currentWeek].temp}°C ± 2°C</p>
                <Progress
                  className="mt-2"
                  value={Math.min(
                    100,
                    Math.max(0, 100 - Math.abs(sensors.temperature - parameters[currentWeek].temp) * 20),
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Minggu Pertumbuhan</CardTitle>
                <CardDescription>Siklus pertumbuhan pakcoy 25 hari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((week) => (
                    <div
                      key={week}
                      className={`p-3 border rounded-md text-center cursor-pointer transition-colors ${
                        currentWeek === week ? "bg-emerald-100 border-emerald-500 text-emerald-800" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleWeekSelection(week.toString())}
                    >
                      <h3 className="font-semibold">Minggu {week}</h3>
                      <p className="text-xs text-gray-500">
                        {week === 1 ? "Hari 1-7" : week === 2 ? "Hari 8-14" : week === 3 ? "Hari 15-21" : "Hari 22-25"}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {parameters[week].stage}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend PPM & pH</CardTitle>
                <CardDescription>Data 24 jam terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ParameterChart data={monitoringData.slice(-24)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Machine Learning Analysis</CardTitle>
                <CardDescription>Parameter optimal berdasarkan analisis decision tree</CardDescription>
              </CardHeader>
              <CardContent>
                {monitoringData.length < 10 ? (
                  <Alert>
                    <AlertTitle>Data Tidak Cukup</AlertTitle>
                    <AlertDescription>
                      Butuh minimal 10 data monitoring untuk melakukan analisis. Saat ini terdapat{" "}
                      {monitoringData.length} data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Sistem dapat menganalisis data monitoring menggunakan algoritma machine learning untuk menentukan
                      parameter optimal yang disesuaikan dengan kondisi aktual tanaman Anda.
                    </p>
                    <Button onClick={handleOptimize}>Analisis Parameter Optimal</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parameters">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Parameter Minggu {currentWeek}</CardTitle>
                <CardDescription>
                  {currentWeek === 1
                    ? "Hari 1-7 (Semai)"
                    : currentWeek === 2
                      ? "Hari 8-14 (Vegetatif)"
                      : currentWeek === 3
                        ? "Hari 15-21 (Vegetatif)"
                        : "Hari 22-25 (Generatif)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ppm-min">PPM Minimal</Label>
                    <Input
                      id="ppm-min"
                      type="number"
                      value={parameters[currentWeek].ppmMin}
                      onChange={(e) => handleParameterChange(currentWeek, "ppmMin", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ppm-max">PPM Maksimal</Label>
                    <Input
                      id="ppm-max"
                      type="number"
                      value={parameters[currentWeek].ppmMax}
                      onChange={(e) => handleParameterChange(currentWeek, "ppmMax", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ph-min">pH Minimal</Label>
                    <Input
                      id="ph-min"
                      type="number"
                      step="0.1"
                      value={parameters[currentWeek].phMin}
                      onChange={(e) => handleParameterChange(currentWeek, "phMin", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ph-max">pH Maksimal</Label>
                    <Input
                      id="ph-max"
                      type="number"
                      step="0.1"
                      value={parameters[currentWeek].phMax}
                      onChange={(e) => handleParameterChange(currentWeek, "phMax", Number.parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="temp">Suhu Optimal (°C)</Label>
                    <Input
                      id="temp"
                      type="number"
                      value={parameters[currentWeek].temp}
                      onChange={(e) => handleParameterChange(currentWeek, "temp", Number.parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={resetParameters}>
                  Reset Default
                </Button>
                <Button onClick={saveParameters}>Simpan Parameter</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tabel Parameter Semua Minggu</CardTitle>
                <CardDescription>Perbandingan parameter optimal tiap minggu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Minggu</TableHead>
                        <TableHead>PPM Min-Max</TableHead>
                        <TableHead>pH Min-Max</TableHead>
                        <TableHead>Suhu (°C)</TableHead>
                        <TableHead>Fase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4].map((week) => (
                        <TableRow key={week} className={currentWeek === week ? "bg-emerald-50" : ""}>
                          <TableCell className="font-medium">{week}</TableCell>
                          <TableCell>
                            {parameters[week].ppmMin}-{parameters[week].ppmMax}
                          </TableCell>
                          <TableCell>
                            {parameters[week].phMin}-{parameters[week].phMax}
                          </TableCell>
                          <TableCell>{parameters[week].temp}</TableCell>
                          <TableCell>{parameters[week].stage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Import/Export Data</CardTitle>
              <CardDescription>Import data CSV atau export parameter saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Import Data CSV</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Import data monitoring dari file CSV untuk analisis. File harus memiliki kolom: timestamp, ppm, ph,
                    temperature
                  </p>
                  <CSVImporter onDataImported={handleCSVImport} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Export Data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Export data monitoring saat ini ke file CSV untuk backup atau analisis lanjutan.
                  </p>
                  <Button onClick={exportDataToCSV} disabled={monitoringData.length === 0}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Data ke CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monitoring Real-Time</CardTitle>
                <CardDescription>Data pengukuran parameter real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ParameterChart data={monitoringData.slice(-100)} fullWidth />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Log</CardTitle>
                <CardDescription>100 data pengukuran terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>PPM</TableHead>
                        <TableHead>pH</TableHead>
                        <TableHead>Suhu</TableHead>
                        <TableHead>Minggu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monitoringData
                        .slice()
                        .reverse()
                        .map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="whitespace-nowrap">{data.timestamp.toLocaleTimeString()}</TableCell>
                            <TableCell>{data.ppm.toFixed(1)}</TableCell>
                            <TableCell>{data.ph.toFixed(2)}</TableCell>
                            <TableCell>{data.temperature.toFixed(1)}°C</TableCell>
                            <TableCell>{data.week}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <p className="text-sm text-gray-500">Total: {monitoringData.length} pengukuran</p>
                <Button variant="outline" onClick={exportDataToCSV} disabled={monitoringData.length === 0}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistik Parameter</CardTitle>
                <CardDescription>Analisis statistik data monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoringData.length === 0 ? (
                    <Alert>
                      <AlertTitle>Belum Ada Data</AlertTitle>
                      <AlertDescription>Belum ada data monitoring untuk dianalisis.</AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold mb-1">PPM/EC</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Min</p>
                            <p className="font-medium">{Math.min(...monitoringData.map((d) => d.ppm)).toFixed(1)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Avg</p>
                            <p className="font-medium">
                              {(monitoringData.reduce((sum, d) => sum + d.ppm, 0) / monitoringData.length).toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Max</p>
                            <p className="font-medium">{Math.max(...monitoringData.map((d) => d.ppm)).toFixed(1)}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-1">pH</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Min</p>
                            <p className="font-medium">{Math.min(...monitoringData.map((d) => d.ph)).toFixed(2)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Avg</p>
                            <p className="font-medium">
                              {(monitoringData.reduce((sum, d) => sum + d.ph, 0) / monitoringData.length).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Max</p>
                            <p className="font-medium">{Math.max(...monitoringData.map((d) => d.ph)).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-1">Suhu Air (°C)</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Min</p>
                            <p className="font-medium">
                              {Math.min(...monitoringData.map((d) => d.temperature)).toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Avg</p>
                            <p className="font-medium">
                              {(
                                monitoringData.reduce((sum, d) => sum + d.temperature, 0) / monitoringData.length
                              ).toFixed(1)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Max</p>
                            <p className="font-medium">
                              {Math.max(...monitoringData.map((d) => d.temperature)).toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2">
                    <Button onClick={handleOptimize} disabled={monitoringData.length < 10}>
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analisis dengan Machine Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload ke ESP8266/ESP32</CardTitle>
                <CardDescription>Transfer firmware dan parameter ke mikrokontroler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>Informasi</AlertTitle>
                    <AlertDescription>
                      Pastikan ESP Anda terhubung ke komputer melalui USB dan browser Anda mendukung Web Serial API
                      (Chrome, Edge, atau Opera).
                    </AlertDescription>
                  </Alert>

                  <SerialConnection onConnected={(isConnected) => setSerialConnected(isConnected)} />

                  <div className="space-y-2 mt-4">
                    <h3 className="text-md font-semibold">Parameter yang akan diupload:</h3>
                    <div className="bg-gray-50 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <p>
                        PPM:{" "}
                        {optimizationResults
                          ? optimizationResults.ppm.toFixed(1)
                          : (parameters[currentWeek].ppmMin + parameters[currentWeek].ppmMax) / 2}
                      </p>
                      <p>
                        pH:{" "}
                        {optimizationResults
                          ? optimizationResults.ph.toFixed(2)
                          : (parameters[currentWeek].phMin + parameters[currentWeek].phMax) / 2}
                      </p>
                      <p>Suhu: {parameters[currentWeek].temp}°C</p>
                      <p>
                        Minggu: {currentWeek} ({parameters[currentWeek].stage})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board-type">Tipe Board:</Label>
                    <Select defaultValue="esp8266">
                      <SelectTrigger id="board-type">
                        <SelectValue placeholder="Pilih tipe board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esp8266">ESP8266 (NodeMCU, Wemos D1 Mini)</SelectItem>
                        <SelectItem value="esp32">ESP32</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={simulateUpload}
                    disabled={!serialConnected || (uploadProgress > 0 && uploadProgress < 100)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadProgress > 0 && uploadProgress < 100 ? "Uploading..." : "Upload ke ESP"}
                  </Button>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-sm text-center text-gray-500">{uploadStatus}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Firmware Preview</CardTitle>
                <CardDescription>Preview kode yang akan diupload ke ESP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
                  {generateFirmwareCode()}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-500">
                  Kode di atas adalah snippet parameter yang akan diterapkan. Firmware lengkap berisi kode untuk membaca
                  sensor dan mengontrol aktuator.
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Panduan Koneksi Hardware</CardTitle>
                <CardDescription>Petunjuk menghubungkan sensor dan aktuator ke ESP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sensor/Aktuator</TableHead>
                          <TableHead>Pin ESP8266</TableHead>
                          <TableHead>Pin ESP32</TableHead>
                          <TableHead>Deskripsi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Sensor Suhu (DS18B20)</TableCell>
                          <TableCell>D2</TableCell>
                          <TableCell>GPIO4</TableCell>
                          <TableCell>Pin data sensor suhu</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sensor PPM/TDS/EC</TableCell>
                          <TableCell>A0</TableCell>
                          <TableCell>GPIO36</TableCell>
                          <TableCell>Pin analog sensor PPM</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sensor pH</TableCell>
                          <TableCell>D1</TableCell>
                          <TableCell>GPIO5</TableCell>
                          <TableCell>Pin analog/digital sensor pH</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Relay Pompa Nutrisi</TableCell>
                          <TableCell>D5</TableCell>
                          <TableCell>GPIO14</TableCell>
                          <TableCell>Pin relay untuk pompa nutrisi</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Relay pH Up</TableCell>
                          <TableCell>D6</TableCell>
                          <TableCell>GPIO12</TableCell>
                          <TableCell>Pin relay untuk pompa pH Up</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Relay pH Down</TableCell>
                          <TableCell>D7</TableCell>
                          <TableCell>GPIO13</TableCell>
                          <TableCell>Pin relay untuk pompa pH Down</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Relay Pendingin</TableCell>
                          <TableCell>D8</TableCell>
                          <TableCell>GPIO15</TableCell>
                          <TableCell>Pin relay untuk pendingin</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <h3 className="font-semibold">Cara Upload:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Pastikan ESP terhubung ke komputer melalui kabel USB</li>
                    <li>Klik "Hubungkan Serial" dan pilih port yang sesuai</li>
                    <li>Verifikasi parameter yang akan diupload</li>
                    <li>Klik "Upload ke ESP" dan tunggu hingga proses selesai</li>
                    <li>ESP akan restart otomatis dengan parameter baru</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Hasil Analisis Machine Learning</CardTitle>
                <CardDescription>Parameter optimal berdasarkan algoritma decision tree</CardDescription>
              </CardHeader>
              <CardContent>
                {!optimizationResults ? (
                  <div className="text-center py-12">
                    <Database className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum Ada Hasil Analisis</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                      Gunakan tombol "Analisis Parameter Optimal" di tab Dashboard atau Monitor untuk menganalisis data
                      dengan algoritma machine learning.
                    </p>
                    <Button className="mt-4" onClick={() => setActiveTab("dashboard")}>
                      Kembali ke Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2">PPM/EC Optimal</h3>
                        <p className="text-3xl font-bold text-emerald-600">{optimizationResults.ppm.toFixed(1)}</p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Range minggu {optimizationResults.week}: {parameters[optimizationResults.week].ppmMin}-
                          {parameters[optimizationResults.week].ppmMax}
                        </p>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2">pH Optimal</h3>
                        <p className="text-3xl font-bold text-emerald-600">{optimizationResults.ph.toFixed(2)}</p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Range minggu {optimizationResults.week}: {parameters[optimizationResults.week].phMin}-
                          {parameters[optimizationResults.week].phMax}
                        </p>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2">Suhu Optimal</h3>
                        <p className="text-3xl font-bold text-emerald-600">
                          {parameters[optimizationResults.week].temp}°C
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">Toleransi: ±2°C</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-semibold text-blue-800 mb-2">Hasil Analisis Decision Tree</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">PPM/EC:</h4>
                          <p className="mb-1">{optimizationResults.ppmAnalysis.decision}</p>
                          <p className="text-sm text-blue-600">
                            Confidence:{" "}
                            <span className="font-medium">{optimizationResults.ppmAnalysis.confidence}</span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-700">pH:</h4>
                          <p className="mb-1">{optimizationResults.phAnalysis.decision}</p>
                          <p className="text-sm text-blue-600">
                            Confidence: <span className="font-medium">{optimizationResults.phAnalysis.confidence}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <DecisionTree optimizationResults={optimizationResults} parameters={parameters} />

                    <div className="flex flex-col md:flex-row gap-4">
                      <Button onClick={() => setActiveTab("upload")}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload ke ESP
                      </Button>
                      <Button variant="outline" onClick={exportDataToCSV}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export Data ke CSV
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
        <p>© 2025 INSAF - Smart Hidroponik Pakcoy. Dibuat dengan ❤️ untuk petani hidroponik.</p>
      </footer>
    </main>
  )
}
