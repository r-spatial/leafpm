#' Add 'leaflet-pm' Toolbar to a Leaflet 'htmlwidget'
#'
#' @param map
#' @param targetLayerId
#' @param targetGroup
#'
#' @return leaflet htmlwidget
#' @export
addPmToolbar <- function(
  map = NULL,
  targetLayerId = NULL,
  targetGroup = NULL
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
    targetGroup#,
    #options
  )
}
