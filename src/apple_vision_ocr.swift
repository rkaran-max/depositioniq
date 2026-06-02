import Foundation
import PDFKit
import Vision
import AppKit

if CommandLine.arguments.count < 2 {
    fputs("Usage: swift apple_vision_ocr.swift <pdf-path>\n", stderr)
    exit(2)
}

let pdfURL = URL(fileURLWithPath: CommandLine.arguments[1])
guard let document = PDFDocument(url: pdfURL) else {
    fputs("Could not open PDF\n", stderr)
    exit(1)
}

func renderedImage(for page: PDFPage, scale: CGFloat = 3.0) -> CGImage? {
    let bounds = page.bounds(for: .mediaBox)
    let width = Int(bounds.width * scale)
    let height = Int(bounds.height * scale)
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: width,
        pixelsHigh: height,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        return nil
    }

    bitmap.size = bounds.size
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    NSColor.white.set()
    NSBezierPath(rect: bounds).fill()
    page.draw(with: .mediaBox, to: NSGraphicsContext.current!.cgContext)
    NSGraphicsContext.restoreGraphicsState()
    return bitmap.cgImage
}

for pageIndex in 0..<document.pageCount {
    guard let page = document.page(at: pageIndex), let image = renderedImage(for: page) else {
        continue
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["en-US"]

    let handler = VNImageRequestHandler(cgImage: image, options: [:])
    try handler.perform([request])

    let lines = (request.results ?? []).compactMap { observation in
        observation.topCandidates(1).first?.string
    }

    print("[Page \(pageIndex + 1)]")
    print(lines.joined(separator: "\n"))
}
