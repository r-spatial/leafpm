if(interactive()) {
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
      drawOptions = pmDrawOptions(snappable = FALSE, allowSelfIntersection = FALSE),
      editOptions = pmEditOptions(preventMarkerRemoval = TRUE, draggable = FALSE),
      cutOptions = pmCutOptions(snappable = FALSE, allowSelfIntersection = FALSE)
    )

  # demonstrate that leaflet.pm can work with holes
  library(sf)
  library(leaflet)
  library(leafpm)

  outer1 = matrix(c(0,0,10,0,10,10,0,10,0,0),ncol=2, byrow=TRUE)
  hole1 = matrix(c(1,1,1,2,2,2,2,1,1,1),ncol=2, byrow=TRUE)
  hole2 = matrix(c(5,5,5,6,6,6,6,5,5,5),ncol=2, byrow=TRUE)
  outer2 = matrix(c(11,0,11,1,12,1,12,0,11,0),ncol=2, byrow=TRUE)

  pts1 = list(outer1, hole1, hole2)
  pts2 = list(outer2)

  pl1 = st_sf(geom = st_sfc(st_polygon(pts1)))
  pl2 = st_sf(geom = st_sfc(st_polygon(pts2)))

  mpl = st_sf(geom = st_combine(rbind(pl1, pl2)))

  if(requireNamespace("mapview")) {
    mapview::mapview(mpl)@map %>%
      addPmToolbar(targetGroup = "mpl", cutOptions = pmCutOptions(snappable = FALSE))
  } else {
    warning("Please install mapview to run this example", call. = FALSE)
  }

}
