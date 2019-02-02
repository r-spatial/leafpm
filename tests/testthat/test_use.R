context("add to leaflet map")

map <- leaflet::leaflet()
map_pm <- map %>% addPmToolbar()
map_pm_options <- map %>% addPmToolbar(
  targetLayerId = "test_id",
  targetGroup = "test_group",
  toolbarOptions = pmToolbarOptions(drawMarker = FALSE, removalMode = FALSE),
  editOptions = pmEditOptions(allowSelfIntersection = FALSE),
  drawOptions = pmDrawOptions(cursorMarker = FALSE),
  cutOptions = pmCutOptions(snappable = FALSE)
)

test_that("map still a map after addPmToolbar", {
  expect_is(map_pm, "leaflet")
  expect_is(map_pm, "htmlwidget")
})

test_that("leaflet.pm added to map", {
  expect_true("addPmToolbar" %in% lapply(map_pm$x$calls, function(x) x$method))
})

test_that("leaflet.pm options working", {
  pm_call <- Filter(function(x) x$method == "addPmToolbar", map_pm_options$x$calls)[[1]]

  expect_equal("test_id", pm_call$args[[1]])
  expect_equal("test_group", pm_call$args[[2]])
  #changed
  expect_equal(pm_call$args[[3]]$toolbarOptions$drawMarker, FALSE)
  expect_equal(pm_call$args[[3]]$toolbarOptions$removalMode, FALSE)
  expect_equal(pm_call$args[[3]]$drawOptions$cursorMarker, FALSE)
  expect_equal(pm_call$args[[3]]$editOptions$allowSelfIntersection, FALSE)
  expect_equal(pm_call$args[[3]]$cutOptions$snappable, FALSE)
  # not changed so make sure still default
  expect_equal(pm_call$args[[3]]$toolbarOptions$position, "topleft")
  expect_equal(pm_call$args[[3]]$drawOptions$snappable, TRUE)
  expect_equal(pm_call$args[[3]]$editOptions$draggable, TRUE)
  expect_equal(pm_call$args[[3]]$cutOptions$cursorMarker, FALSE)
})
