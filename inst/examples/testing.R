library(sf)
library(leaflet)
library(leaflet.extras)
library(mapview)
library(leafpm)
library(shiny)

options(shiny.trace = TRUE)

(map <- mapview()@map %>% addPmToolbar(drawOptions = pmDrawOptions(allowSelfIntersection = FALSE)))

shinyApp(ui=map, server=function(input,output){})

# to listen to edit start and end
# map.on('pm:globaleditmodetoggled', function(e) {debugger});

# to listen to draw start and end
# but I don't think this gives us the specificity to track the change
# but leaflet.draw does not either
# map.on('pm:drawstart',function(e){debugger})
# map.on('pm:drawend',function(e){debugger})
# create event gives us the details we need
# map.on('pm:create',function(e){debugger})

# to listen to remove/delete
# map.on("pm:remove",function(e){debugger})
# where e.layer is the layer being removed

# tracking edit events is much trickier since it does not seem
# the edit event bubbles to the map level
# rather the edit event only happens at the layer/layer group level


# try to target a specific layer and disable edit of other features
# should not edit trails
mapview(trails)@map %>% addPmToolbar()
# limit trails to 1
trl1 = trails[1:2,]
(map2 <- mapview(trl1)@map %>% addPmToolbar(targetGroup = "trl1"))
shinyApp(ui=map2, server=function(input,output){})

# try with multiple feaure groups
(map3 <- mapview(trl1)@map %>% addFeatures(franconia[1,], group="franconia") %>% addPmToolbar(targetGroup = "trl1"))
shinyApp(ui=map3, server=function(input,output){})


# test removePmToolbar
map4 <- mapview(trl1)@map %>% addPmToolbar(targetGroup = "trl1") %>% removePmToolbar()
ui <- leafletOutput("map")
server <- function(input, output, session) {
  output$map <- renderLeaflet(map4)
  observe({
    invalidateLater(2000, session)
  })
}

shinyApp(ui=ui, server=server)
