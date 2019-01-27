#' Set Options for 'leaflet.pm' Toolbar
#'
#' @param drawMarker \code{logical} add button to draw a marker. Default is \code{TRUE}.
#' @param drawPolygon \code{logical} add button to draw a polygon. Default is \code{TRUE}.
#' @param drawPolyline \code{logical} add button to draw a polyline. Default is \code{TRUE}.
#' @param drawCircle \code{logical} add button to draw a circle. Default is \code{TRUE}.
#' @param drawRectangle \code{logical} add button to draw a rectangle. Default is \code{TRUE}.
#' @param editMode \code{logical} add button to edit features. Default is \code{TRUE}.
#' @param cutPolygon \code{logical} add button to cut a hole. Default is \code{TRUE}.
#' @param removalMode \code{logical} add button to remove features. Default is \code{TRUE}.
#' @param position \code{string} toolbar position. Options are 'topleft', 'topright', 'bottomleft', 'bottomright'.
#'         Default is \code{'topleft'}.
#'
#' @return \code{leaflet} htmlwidget with added toolbar
#' @export
pmToolbarOptions <- function(
  drawMarker = TRUE,
  drawPolygon = TRUE,
  drawPolyline = TRUE,
  drawCircle = TRUE,
  drawRectangle = TRUE,
  editMode = TRUE,
  cutPolygon = TRUE,
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
    removalMode = removalMode,
    position = position
  ))
}

#' Set Options for 'leaflet.pm' Draw Mode
#'
#' @param snappable \code{logical} to snap while drawing. Default is \code{TRUE}.
#' @param snapDistance \code{integer} for the distance within which snapping will occur.  Default is \code{20}.
#' @param snapMiddle \code{logical} to snap in the middle of segments. Default is \code{TRUE}.
#' @param tooltips \code{logical} to show tooltips.  Default is \code{TRUE}.
#' @param cursorMarker \code{logical} to show a marker at the cursor.  Default is \code{TRUE}.
#' @param finishOn \code{string} type of layer event to finish the drawn shape.  Example events are
#'          'mouseout', 'dblclick', 'contextmenu'.  Default is \code{NULL}.
#' @param allowSelfIntersection \code{logical} to allow self-intersection.  Default is \code{TRUE}.
#' @param templineStyle \code{list} to customize the styling of the lines between coordinates and markers.
#' @param hintlineStyle \code{list} to customize the styling of the line between the last marker and the cursor.
#' @param markerStyle \code{list} to customize the styling of the added marker.
#'
#' @return \code{list} of options
#' @export
pmDrawOptions <- function(
  snappable = TRUE,
  snapDistance = 20,
  snapMiddle = TRUE,
  tooltips = TRUE,
  cursorMarker = TRUE,
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
    snapMiddle = snapMiddle,
    tooltips = tooltips,
    cursorMarker = cursorMarker,
    finishOn = finishOn,
    allowSelfIntersection = allowSelfIntersection,
    templineStyle = templineStyle,
    hintlineStyle = hintlineStyle,
    markerStyle = markerStyle
  ))
}

#' Set Options for 'leaflet.pm' Edit Mode
#'
#' @param snappable \code{logical} to snap while drawing. Default is \code{TRUE}.
#' @param snapDistance \code{integer} for the distance within which snapping will occur.  Default is \code{20}.
#' @param allowSelfIntersection \code{logical} to allow self-intersection.  Default is \code{TRUE}.
#' @param draggable \code{logical} make the layer draggable.  Default is \code{TRUE}.
#' @param preventMarkerRemoval \code{logical} to disable removal via right-click.  Default is \code{FALSE}.
#' @param preventVertexEdit \code{logical} to disable editing of vertices.  Default is \code{FALSE}.
#'
#' @return \code{list} of options
#' @export
pmEditOptions <- function(
  snappable = TRUE,
  snapDistance = 20,
  allowSelfIntersection = TRUE,
  draggable = TRUE,
  preventMarkerRemoval = FALSE,
  preventVertexEdit = FALSE
) {
  leaflet::filterNULL(list(
    snappable = snappable,
    snapDistance = snapDistance,
    allowSelfIntersection = allowSelfIntersection,
    draggable = draggable,
    preventMarkerRemoval = preventMarkerRemoval,
    preventVertexEdit = preventVertexEdit
  ))
}


#' Set Options for 'leaflet.pm' Cut Mode
#'
#' @param snappable \code{logical} to snap while drawing. Default is \code{TRUE}.
#' @param allowSelfIntersection \code{logical} to allow self-intersection.  Default is \code{TRUE}.
#' @param cursorMarker \code{logical} to show a marker at the cursor.  Default is \code{TRUE}.
#'
#' @return \code{list} of options
#' @export
pmCutOptions <- function(
  snappable = FALSE,
  allowSelfIntersection = TRUE,
  cursorMarker = FALSE
) {
  leaflet::filterNULL(list(
    snappable = snappable,
    allowSelfIntersection = allowSelfIntersection,
    cursorMarker = cursorMarker
  ))
}
