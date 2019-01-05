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
      layer.feature.properties._leaflet_id = featureId;
      layer.feature.properties.layerId = layer.options.layerId;
      if(typeof layer.getRadius === 'function') {
        layer.feature.properties.radius = layer.getRadius();
      }

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_edited_features',
        layer.toGeoJSON());
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
        // set pmIgnore to false so we can not disable later
        editableFeatureGroup.options.pmIgnore = false;
        editableFeatureGroup.pm.enable(options.editOptions);
        editableFeatureGroup.pm.disable();
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
        editableFeatureGroup.eachLayer(function(layer) {
          layer.options.pmIgnore = false;
          layer.pm.enable(options.editOptions);
          layer.pm.disable();
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

    // FeatureGroup that will hold our drawn shapes/markers
    // This can be an existing GeoJSON layer whose features can be edited/deleted or new ones added.
    // OR an existing FeatureGroup whose features can be edited/deleted or new ones added.
    // OR a new FeatureGroup to hold drawn shapes.
/*
    var editableFeatureGroup;

    if(targetLayerId) {
      // If we're given an existing GeoJSON layer find it and use it
      editableFeatureGroup = map.layerManager.getLayer('geojson', targetLayerId);
      if(editableFeatureGroup) {
        map._editableGeoJSONLayerId = targetLayerId;
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
    }

    // Create appropriate Marker Icon.
    if(options && options.draw && options.draw.marker) {
      if(options.draw.marker.markerIcon &&
        options.draw.marker.markerIconFunction) {
        options.draw.marker.icon =
          options.draw.marker.markerIconFunction(
            options.draw.marker.markerIcon);
      }
    }

    // create appropriate options
    if(!$.isEmptyObject(options.edit)) {
      var editOptions = {};
      if(!options.edit.remove) {
        editOptions.remove = false;
      }
      if(!options.edit.edit) {
        editOptions.edit = false;
      } else if(!$.isEmptyObject(options.edit.selectedPathOptions)) {
        editOptions.edit = {};
        editOptions.edit.selectedPathOptions =
          options.edit.selectedPathOptions;
      }

      if(!$.isEmptyObject(options.edit.poly)) {
        editOptions.poly = options.edit.poly;
      }

      editOptions.featureGroup = editableFeatureGroup;
      options.edit = editOptions;
    }
*/
    //map.drawToolbar =  new L.Control.Draw(options);
    //map.drawToolbar.addTo(map);

    // this is the only way I could find to set drawing options
    map.pm.enableDraw('Poly', options.drawOptions);
    map.pm.enableDraw('Rectangle', options.drawOptions);
    map.pm.enableDraw('Line', options.drawOptions);
    map.pm.enableDraw('Marker', options.drawOptions);
    map.pm.enableDraw('Circle', options.drawOptions);
    map.pm.disableDraw();

    // set cut options
    map.pm.Draw.Cut.enable(options);
    map.pm.Draw.Cut.disable(options);

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

    // pm edit does not bubble to the map level
    // so we have to add the event handler to the layer group
    editableFeatureGroup.on('pm:edit', editCallback);
/*
    map.on(L.Draw.Event.CREATED, function (e) {
      if (options.draw.singleFeature){
        if (editableFeatureGroup.getLayers().length > 0) {
          editableFeatureGroup.clearLayers();
        }
      }

      var layer = e.layer;
      editableFeatureGroup.addLayer(layer);

      // assign a unique key to the newly created feature
      var featureId = L.stamp(layer);
      layer.feature = {
        'type' : 'Feature',
        'properties' : {
          '_leaflet_id' : featureId,
          'feature_type' : e.layerType
        }
      };

      // circles are just Points and toGeoJSON won't store radius by default
      // so we store it inside the properties.
      if(typeof layer.getRadius === 'function') {
        layer.feature.properties.radius = layer.getRadius();
      }

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_new_feature',
        layer.toGeoJSON());
      Shiny.onInputChange(map.id+'_draw_all_features',
        editableFeatureGroup.toGeoJSON());
    });

    map.on(L.Draw.Event.EDITSTART, function (e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_editstart', true);
    });
    map.on(L.Draw.Event.EDITSTOP, function (e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_editstop', true);
    });

    map.on(L.Draw.Event.EDITED, function (e) {
      var layers = e.layers;
      layers.eachLayer(function(layer){
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
      });

      if (!HTMLWidgets.shinyMode) return;

      Shiny.onInputChange(map.id+'_draw_edited_features',
        layers.toGeoJSON());
      Shiny.onInputChange(map.id+'_draw_all_features',
        editableFeatureGroup.toGeoJSON());
    });

    map.on(L.Draw.Event.DELETESTART, function (e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_deletestart', true);
    });

    map.on(L.Draw.Event.DELETESTOP, function (e) {
      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_deletestop', true);
    });

    map.on(L.Draw.Event.DELETED, function (e) {
      var layers = e.layers;
      layers.eachLayer(function(layer){
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
      });

      if (!HTMLWidgets.shinyMode) return;
      Shiny.onInputChange(map.id+'_draw_deleted_features',
        layers.toGeoJSON());
      Shiny.onInputChange(map.id+'_draw_all_features',
        editableFeatureGroup.toGeoJSON());
    });
*/
  }).call(this);

};

LeafletWidget.methods.removeDrawToolbar = function(clearFeatures) {
  (function(){

    var map = this;

    if(map.drawToolbar) {
      map.drawToolbar.removeFrom(map);
      delete map.drawToolbar;
    }
    if(map._editableFeatureGroupName && clearFeatures) {
      var featureGroup = map.layerManager.getLayerGroup(map._editableFeatureGroupName, false);
      featureGroup.clearLayers();
    }
    map._editableFeatureGroupName = null;
    if(map._editableGeoJSONLayerId && clearFeatures) {
      map.layerManager.removeLayer('geojson', map._editableGeoJSONLayerId);
    }
    map._editableGeoJSONLayerId = null;
  }).call(this);

};

LeafletWidget.methods.getDrawnItems = function() {
  var map = this;

  var featureGroup;
  if(map._editableGeoJSONLayerId) {
    featureGroup = map.layerManager.getLayer('geojson', map._editableGeoJSONLayerId);
  } else if(map._editableFeatureGroupName) {
    featureGroup = map.layerManager.getLayerGroup(map._editableFeatureGroupName, false);
  }
  if(featureGroup) {
    return featureGroup.toGeoJSON();
  } else {
    return null;
  }

};
