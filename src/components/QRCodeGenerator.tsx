"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";

type ExportFormat = "png" | "jpeg" | "pdf" | "csv";

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<ExportFormat>("png");
  const qrRef = useRef<HTMLDivElement>(null);

  const getCanvas = () => qrRef.current?.querySelector("canvas");

  const downloadAsPNG = () => {
    const canvas = getCanvas();
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = url;
      link.click();
    }
  };

  const downloadAsJPEG = () => {
    const canvas = getCanvas();
    if (canvas) {
      const url = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = "qrcode.jpg";
      link.href = url;
      link.click();
    }
  };

  const downloadAsPDF = () => {
    const canvas = getCanvas();
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: size > 200 ? "landscape" : "portrait",
        unit: "px",
        format: [size + 40, size + 80],
      });

      // Add title
      pdf.setFontSize(14);
      pdf.text("QR Code", 20, 25);

      // Add QR code image
      pdf.addImage(imgData, "PNG", 20, 35, size, size);

      // Add the encoded text below
      pdf.setFontSize(8);
      const truncatedText = text.length > 60 ? text.substring(0, 60) + "..." : text;
      pdf.text(`Content: ${truncatedText}`, 20, size + 55);

      pdf.save("qrcode.pdf");
    }
  };

  const downloadAsCSV = () => {
    const timestamp = new Date().toISOString();
    const csvContent = [
      ["Field", "Value"],
      ["Content", text],
      ["Size", `${size}px`],
      ["QR Color", fgColor],
      ["Background Color", bgColor],
      ["Generated At", timestamp],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "qrcode-data.csv";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadQRCode = () => {
    switch (format) {
      case "png":
        downloadAsPNG();
        break;
      case "jpeg":
        downloadAsJPEG();
        break;
      case "pdf":
        downloadAsPDF();
        break;
      case "csv":
        downloadAsCSV();
        break;
    }
  };

  const formatLabels: Record<ExportFormat, string> = {
    png: "PNG Image",
    jpeg: "JPEG Image",
    pdf: "PDF Document",
    csv: "CSV Data",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-8">
        {/* Input Section */}
        <div className="space-y-2">
          <label
            htmlFor="qr-text"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Enter URL or Text
          </label>
          <input
            id="qr-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* QR Code Display */}
        <div
          ref={qrRef}
          className="flex justify-center p-8 rounded-xl"
          style={{ backgroundColor: bgColor }}
        >
          <QRCodeCanvas
            value={text || " "}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Size Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Size: {size}px
            </label>
            <input
              type="range"
              min="128"
              max="512"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Foreground Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              QR Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-mono"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Background
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Export Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(formatLabels) as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  format === fmt
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {format === "csv"
              ? "Exports QR code data and settings as a spreadsheet"
              : `Downloads the QR code as a ${formatLabels[format]}`}
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadQRCode}
          disabled={!text}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          Download as {format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
