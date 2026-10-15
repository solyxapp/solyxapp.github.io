import SwiftUI
import UIKit
import XCTest
@testable import Solyx

@MainActor
final class WebsitePlanetExportTests: XCTestCase {
    func testExportWebsitePortraits() throws {
        let directory = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("website-planets")
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        var manifest: [[String: String]] = []
        for entry in PlanetCatalog.entries where [.rare, .superRare].contains(entry.archetype.definition.rarity) {
            let definition = entry.archetype.definition
            _ = PlanetSurfaceAtlasCache.shared.atlas(recipe: PlanetRenderRecipe.recipe(for: entry.archetype), seed: entry.seed, detail: .compact)
            let renderer = ImageRenderer(content: PlanetView(
                colorHex: definition.palette.bodyHex,
                variant: definition.variant.rawValue,
                size: min(160, 300 / definition.externalScale),
                glowStrength: 0.2,
                seed: entry.seed,
                rarity: definition.rarity,
                spinDegrees: 37,
                renderDetail: .compact,
                archetype: entry.archetype
            ).frame(width: 360, height: 300))
            renderer.scale = 1.5
            let data = try XCTUnwrap(renderer.uiImage?.pngData())
            let filename = "planet-\(entry.archetype.rawValue).png"
            try data.write(to: directory.appendingPathComponent(filename))
            manifest.append(["name": entry.name, "rarity": definition.rarity == .rare ? "Rare" : "Legendary", "file": filename])
        }
        try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys]).write(to: directory.appendingPathComponent("manifest.json"))
        print("WEBSITE_PLANETS_EXPORT=\(directory.path)")
        XCTAssertGreaterThan(manifest.count, 12)
    }
}
