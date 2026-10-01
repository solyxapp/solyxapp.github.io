# Planet Texture Sources

Solyx uses the files below as rendering inputs under shared Solyx lighting. No NASA or JPL branding is included in the app, and use of these public resources does not imply endorsement.

| Asset | Source | Credit | Notes |
| --- | --- | --- | --- |
| `mercury_surface.jpg` | [USGS Mercury MESSENGER enhanced-color global mosaic](https://astrogeology.usgs.gov/search/map/mercury_messenger_mdis_basemap_enhanced_color_global_mosaic_665m) | NASA, Johns Hopkins APL, Arizona State University, Carnegie Science; published by USGS Astrogeology | 1024px equirectangular sample. Solyx applies a restrained gray material response so the enhanced-color source does not read as false-color artwork. |
| `venus_surface.jpg` | [NASA Venus image texture](https://science.nasa.gov/3d-resources/venus/) | NASA/JPL/Caltech | Magellan radar global texture. A dense sulfuric cloud layer is rendered separately. |
| `earth_surface.jpg` | [NASA Scientific Visualization Studio Blue Marble](https://svs.gsfc.nasa.gov/2915/) | NASA/Goddard Space Flight Center Scientific Visualization Studio; Blue Marble data courtesy of Reto Stockli (NASA/GSFC) and NASA Earth Observatory | Cloudless June-September surface composite with proportionate northern snow and Antarctica. Separate procedural cloud and night-emissive layers are added by Solyx. |
| `mars_surface.jpg` | [NASA Mars image texture](https://science.nasa.gov/3d-resources/mars/) | NASA/JPL/Caltech; Viking imagery processed at USGS | Equirectangular global texture. |
| `jupiter_surface.jpg` | [NASA Jupiter image texture](https://science.nasa.gov/3d-resources/jupiter/) | NASA/JPL/Caltech | Equirectangular atmospheric texture. |
| `saturn_surface.jpg` | [NASA Saturn image texture](https://science.nasa.gov/3d-resources/saturn/) | NASA/JPL/Caltech | Equirectangular atmosphere reference; rings are rendered separately. |
| `uranus_reference.jpg` | [NASA Voyager 2 Uranus, PIA01391](https://science.nasa.gov/resource/uranus/) | NASA/JPL | Observational color reference, not sampled as a wrapping surface map. Uranus has little visible surface structure, so Solyx reconstructs its pale cyan atmosphere procedurally and preserves the observed color and haze character. |
| `neptune_surface.jpg` | [NASA Neptune image texture](https://science.nasa.gov/3d-resources/neptune/) | NASA/JPL/Caltech | Equirectangular atmosphere reference. |
| `pluto_surface.jpg` | [NASA Pluto global color map](https://science.nasa.gov/resource/pluto-global-color-map/) | NASA/JHUAPL/SwRI | New Horizons global enhanced-color map. Solyx fills the source's no-data region from matching mapped terrain, then seam-conditions the complete atlas while preserving the observed Tombaugh Regio geography. |

The original magenta Gas Giant material direction is informed by NASA's observations of [GJ 504 b](https://science.nasa.gov/exoplanet-catalog/gj-504-b/), which NASA classifies as a Gas Giant and describes as having a dark cherry-blossom or dull magenta color. Solyx does not reproduce or name the observed planet.

Usage was reviewed against [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) and [JPL Image Use Policy](https://www.jpl.nasa.gov/jpl-image-use-policy/).
