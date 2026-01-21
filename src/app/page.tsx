import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            QR Code Generator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Create custom QR codes instantly. Enter any URL or text and download
            your QR code in seconds.
          </p>
        </div>

        {/* QR Code Generator */}
        <QRCodeGenerator />

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-zinc-500 dark:text-zinc-500">
          <p>Built with Next.js and TypeScript</p>
        </footer>
      </main>
    </div>
  );
}
