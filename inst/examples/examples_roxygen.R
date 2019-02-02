\dontrun{
  library(leaflet)
  library(leafpm)

  # quick example
  leaflet() %>%
    addTiles() %>%
    addPmToolbar()

  # customizing with options
  leaflet() %>%
    addTiles() %>%
    addPmToolbar(
      toolbarOptions = pmToolbarOptions(drawMarker = FALSE, position = "topright"),
      drawOptions = pmDrawOptions(snappable = FALSE, allowSelfIntersection = FALSE)
      #editOptions = pmEditOptions(...)
      #cutOptions = pmCutOptions(...)
    )
}
