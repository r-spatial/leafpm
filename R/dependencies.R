#' Dependencies for 'leaflet-pm'
#'
#' @return htmltools::htmlDependency
#' @export
pmDependencies <- function() {
  list(
    htmltools::htmlDependency(
      name = "leaflet-pm",
      version = "2.0.2",
      src = "htmlwidgets/build",
      script = c("leaflet.pm.min.js", "lfx-pm-bindings.js"),
      stylesheet = "leaflet.pm.css",
      package = "leafpm"
    )
  )
}
