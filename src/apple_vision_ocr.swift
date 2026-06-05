import Foundation
import PDFKit
import Vision
import AppKit
import CoreGraphics

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
    guard let pageRef = page.pageRef else {
        return nil
    }

    let bounds = pageRef.getBoxRect(.mediaBox)
    let width = max(1, Int(bounds.width * scale))
    let height = max(1, Int(bounds.height * scale))
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let context = CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: 0,
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    ) else {
        return nil
    }

    context.setFillColor(NSColor.white.cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.saveGState()
    context.translateBy(x: 0, y: CGFloat(height))
    context.scaleBy(x: scale, y: -scale)
    context.translateBy(x: -bounds.origin.x, y: -bounds.origin.y)
    context.drawPDFPage(pageRef)
    context.restoreGState()

    return context.makeImage()
}

func ocrLines(from image: CGImage) -> [String] {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(
        cgImage: image,
        orientation: .up,
        options: [:]
    )
    do {
        try handler.perform([request])
    } catch {
        return []
    }

    return (request.results ?? []).compactMap { observation in
        observation.topCandidates(1).first?.string
    }
}

for pageIndex in 0..<document.pageCount {
    guard let page = document.page(at: pageIndex), let image = renderedImage(for: page) else {
        continue
    }

    let lines = ocrLines(from: image)

    print("[Page \(pageIndex + 1)]")
    print(lines.joined(separator: "\n"))
}
