#' Add 'leaflet-pm' Toolbar to a Leaflet 'htmlwidget'
#'
#' @param map
#' @param targetLayerId
#' @param targetGroup
#' @param toolbarOptions
#' @param drawOptions
#' @param editOptions
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
