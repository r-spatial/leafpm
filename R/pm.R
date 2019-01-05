#' Add 'leaflet-pm' Toolbar to a Leaflet 'htmlwidget'
#'
#' @param map \code{leaflet} map htmlwidget to which the toolbar should be added
#' @param targetLayerId \code{string} id of the feature to edit
#' @param targetGroup \code{string} name of the group to edit
#' @param toolbarOptions \code{pmToolbarOptions()}
#' @param drawOptions \code{pmDrawOptions()}
#' @param editOptions \code{pmEditOptions()}
#' @param cutOptions \code{pmCutOptions()}
#'
#' @return leaflet htmlwidget
#' @export
addPmToolbar <- function(
  map = NULL,
  targetLayerId = NULL,
  targetGroup = NULL,
  toolbarOptions = pmToolbarOptions(),
  drawOptions = pmDrawOptions(),
  editOptions = pmEditOptions(),
  cutOptions = pmCutOptions()
) {
  if(is.null(map)) {
    stop("Please add required map argument.  This should be a leaflet htmlwidget.")
  }

  map$dependencies <- c(map$dependencies, pmDependencies())

  leaflet::invokeMethod(
    map,
    leaflet::getMapData(map),
    "addPmToolbar",
    targetLayerId,
    targetGroup,
    list(
      toolbarOptions = toolbarOptions,
      drawOptions = drawOptions,
      editOptions = editOptions,
      cutOptions = cutOptions
    )
  )
}

#' Removes the 'leaflet.pm' toolbar
#' @param clearFeatures whether to clear the map of drawn features. currently not working
#' @export
removePmToolbar <- function(map, clearFeatures = FALSE) {
  leaflet::invokeMethod(map, leaflet::getMapData(map), "removePmToolbar", clearFeatures)
}
