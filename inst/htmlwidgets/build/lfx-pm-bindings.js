/* global LeafletWidget, $, L, Shiny, HTMLWidgets */

LeafletWidget.methods.addPmToolbar = function(targetLayerId, targetGroup, options) {
  (function(){

    var map = this;

    var editCallback = function(e) {
      var layer = e.sourceTarget;
      var featureId = L.stamp(layer);
      if(!layer.feature) {
        layer.feature = {'type' : 'Feature'};
      }
      if(!layer.feature.properties) {
        layer.feature.properties = {};
      }
      // if layer has properties._leaflet_id then use that as our featureId
      //   this will happen  since cut replaces the original and generates a new id
      if(!layer.feature.properties.hasOwnProperty("_leaflet_id")) {
        layer.feature.properties._leaflet_id = featureId;
      }
      // as above if layerId already exists then keep it
      if(!layer.feature.properties.hasOwnProperty("layerId")) {
        layer.feature.properties.layerId = layer.options.layerId;
      }

      if(typeof layer.getRadius === 'function') {
        layer.feature.properties.radius = layer.getRadius();
      }

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_edited_features',
        layer.toGeoJSON());
    };

    var enablePm = function(layer, options) {
      // set pmIgnore to false so we can not disable later
      layer.options.pmIgnore = false;
      if(layer.hasOwnProperty("pm") && typeof(layer.pm.enable) === "function") {
        layer.pm.enable(options.editOptions);
        layer.pm.disable();
      }
    };

    if(map.pm.controlsVisible()) {
      map.pm.removeControls();
    }

    // disable pm on all layers so that we can target a group or id
    // as specified by the user
    var editableFeatureGroup;
    if(targetLayerId) {
      // If we're given an existing GeoJSON layer find it and use it
      editableFeatureGroup = map.layerManager.getLayer('geojson', targetLayerId);
      if(editableFeatureGroup) {
        map._editableGeoJSONLayerId = targetLayerId;
        enablePm(editableFeatureGroup, options);
      } else {
        // throw an error if we can't find the target GeoJSON layer
        throw 'GeoJSON layer with ID '+targetLayerId+' not Found';
      }
    } else {
      // If we're given an existing FeatureLayer use that.
      // In this case we don't throw an error if the specified FeatureGroup is not found,
      // we silently create a new one.
      if(!targetGroup) {
        targetGroup = 'editableFeatureGroup';
      }
      editableFeatureGroup = map.layerManager.getLayerGroup(targetGroup, true);
      map._editableFeatureGroupName = targetGroup;

      if(editableFeatureGroup) {
        // enable pm for the group
        enablePm(editableFeatureGroup, options);
        editableFeatureGroup.eachLayer(function(layer) {
          enablePm(layer, options);
        });
      }
    }

    function removePm(layer) {
      // messy but seems to be the only way based on https://github.com/codeofsumit/leaflet.pm/issues/160
      // seems to still allow snapping to ignored layers

      // we will start by looking to see if we already set pmIgnore
      // in previous steps based on targetLayerId or targetGroup
      // and return if so
      if(layer.options.hasOwnProperty('pmIgnore')) {
        return;
      }

      // delete pm if it has already been added
      if(layer.pm) {
        delete layer.pm;
      }
      // also add pmIgnore to the editable feature group
      layer.options.pmIgnore = true;
    }

    map.eachLayer(function(layer) {
      removePm(layer);
    });

    // we will also need to ignore added Tile layers
    map.on("layeradd", function(e) {
      var layer = e.layer;
      if(layer instanceof L.TileLayer) {
        removePm(layer);
      }
      // we will also need to ignore layer group with tile layers
      if(layer.hasOwnProperty('groupname')) {
        var isTile = [];
        layer.eachLayer(function(sublayer) {
          isTile.push(sublayer instanceof L.TileLayer);
        });
        if(isTile.some(function(d){return d;})) {
          removePm(layer);
        }
      }
    });

    // this is the only way I could find to set drawing options
    //   enable with options and then disable
    map.pm.enableDraw('Poly', options.drawOptions);
    map.pm.enableDraw('Rectangle', options.drawOptions);
    map.pm.enableDraw('Line', options.drawOptions);
    map.pm.enableDraw('Marker', options.drawOptions);
    map.pm.enableDraw('Circle', options.drawOptions);
    map.pm.disableDraw();

    // set cut options
    map.pm.Draw.Cut.enable(options.cutOptions);
    map.pm.Draw.Cut.disable(options.cutOptions);

    map.pm.addControls(options.toolbarOptions);

    // Event Listeners
    map.on('pm:drawstart', function(e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_start', {'shape': e.shape});
    });

    map.on('pm:drawend', function(e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_stop', {'shape': e.shape});
    });

    map.on('pm:create', function(e) {
      var layer = e.layer;
      var featureId = L.stamp(layer);
      if(!layer.feature) {
        layer.feature = {'type' : 'Feature'};
      }
      if(!layer.feature.properties) {
        layer.feature.properties = {};
      }
      // add id so we can trace edit and remove events later
      layer.feature.properties._leaflet_id = featureId;
      layer.feature.properties.layerId = layer.options.layerId;
      // mapedit joins by "id" and "layerId" so set "id" as well
      if(typeof(layer.options.layerId) !== "undefined") {
        layer.feature.properties.edit_id = layer.options.layerId;
        layer.feature.properties.layerId = layer.options.layerId;
      } else {
        layer.feature.properties.edit_id = String(featureId);
        layer.feature.properties.layerId = String(featureId);
      }
      // circles are just Points and toGeoJSON won't store radius by default
      // so we store it inside the properties.
      if(typeof layer.getRadius === 'function') {
        layer.feature.properties.radius = layer.getRadius();
      }

      layer.pm.enable(options.editOptions);
      layer.pm.disable();

      layer.on("pm:edit", editCallback);

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_new_feature',
        layer.toGeoJSON());

      // do we need _draw_all_features as provided in leaflet.extras draw?
    });

    map.on('pm:remove', function(e) {
      var layer = e.layer;

      var featureId = L.stamp(layer);
      if(!layer.feature) {
        layer.feature = {'type' : 'Feature'};
      }
      if(!layer.feature.properties) {
        layer.feature.properties = {};
      }
      layer.feature.properties._leaflet_id = featureId;
      layer.feature.properties.layerId = layer.options.layerId;
      if(typeof layer.getRadius === 'function') {
        layer.feature.properties.radius = layer.getRadius();
      }

      //editableFeatureGroup.remove(layer);

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_deleted_features',
        layer.toGeoJSON());
    });

    // handle cut events
    //  leaflet.pm replaces the layer with a new layer which contains results
    map.on("pm:cut", function(e) {
      // attach the editCallback to the new layer
      e.layer.on("pm:edit", editCallback);

      // for now we will communicate cut through edited
      e.layer.eachLayer(function(lyr) {
        editCallback({sourceTarget: lyr});
      });
    });

    // pm edit does not bubble to the map level
    // so we have to add the event handler to the layer group
    editableFeatureGroup.on('pm:edit', editCallback);

  }).call(this);

};

LeafletWidget.methods.removePmToolbar = function(clearFeatures) {
  (function(){
    // remember to add clearFeatures here
    var map = this;

    map.pm.removeControls();
  }).call(this);

};
