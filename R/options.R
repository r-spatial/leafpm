#' Title
#'
#' @param drawMarker
#' @param drawPolygon
#' @param drawPolyline
#' @param drawCircle
#' @param drawRectangle
#' @param editMode
#' @param cutPolygon
#' @param dragPolygon
#' @param removalMode
#' @param position
#'
#' @return
#' @export
pmToolbarOptions <- function(
  drawMarker = TRUE,
  drawPolygon = TRUE,
  drawPolyline = TRUE,
  drawCircle = TRUE,
  drawRectangle = TRUE,
  editMode = TRUE,
  cutPolygon = TRUE,
  dragPolygon = FALSE,
  removalMode = TRUE,
  position = 'topleft'
) {
  leaflet::filterNULL(list(
    drawMarker = drawMarker,
    drawPolygon = drawPolygon,
    drawPolyline = drawPolyline,
    drawCircle = drawCircle,
    drawRectangle = drawRectangle,
    editMode = editMode,
    cutPolygon = cutPolygon,
    dragPolygon = dragPolygon,
    removalMode = removalMode,
    position = position
  ))
}

#' Title
#'
#' @param snappable
#' @param snapDistance
#' @param tooltips
#' @param cursorMarker
#' @param finishOnDoubleClick
#' @param finishOn
#' @param allowSelfIntersection
#' @param templineStyle
#' @param hintlineStyle
#' @param markerStyle
#'
#' @return
#' @export
pmDrawOptions <- function(
  snappable = TRUE,
  snapDistance = 20,
  tooltips = TRUE,
  cursorMarker = TRUE,
  finishOnDoubleClick = FALSE,
  finishOn = NULL,
  allowSelfIntersection = TRUE,
  templineStyle = list(),
  hintlineStyle = list(
    color = '#3388ff',
    dashArray = '5,5'
  ),
  markerStyle = list(
    draggable = TRUE
  )
) {
  leaflet::filterNULL(list(
    snappable = snappable,
    snapDistance = snapDistance,
    tooltips = tooltips,
    cursorMarker = cursorMarker,
    finishOnDoubleClick = finishOnDoubleClick,
    finishOn = finishOn,
    allowSelfIntersection = allowSelfIntersection,
    templineStyle = templineStyle,
    hintlineStyle = hintlineStyle,
    markerStyle = markerStyle
  ))
}

#' Title
#'
#' @param snappable
#' @param snapDistance
#' @param allowSelfIntersection
#' @param draggable
#'
#' @return
#' @export
pmEditOptions <- function(
  snappable = TRUE,
  snapDistance = 20,
  allowSelfIntersection = TRUE,
  draggable = TRUE
) {
  leaflet::filterNULL(list(
    snappable = snappable,
    snapDistance = snapDistance,
    allowSelfIntersection = allowSelfIntersection,
    draggable = draggable
  ))
}


#' Title
#'
#' @param snappable
#' @param cursorMarker
#'
#' @return
#' @export
#'
#' @examples
pmCutOptions <- function(
  snappable = FALSE,
  cursorMarker = FALSE
) {
  leaflet::filterNULL(list(
    snappable = snappable,
    cursorMarker = cursorMarker
  ))
}
