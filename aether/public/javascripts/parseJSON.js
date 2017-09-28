$.getJSON("filledData.json", function(data) {

  // set document version value
  $('#docver-val').html(data.DocumentVersion);

  // set id value
  $('#id-val').html(data.ID);

  /********** STAGED USER SETTINGS **********/
  // map all staged user settings keys
  var stagedUserSettingsKeys = $.map(Object.keys(data.StagedUserSettings), function(el) {
    return el;
  });

  // map all staged user settings values
  var stagedUserSettingsVals = $.map(data.StagedUserSettings, function(el) {
    return el;
  })

  // set keys+values for each StagedUserSettings
  createKeysValues(stagedUserSettingsKeys, stagedUserSettingsVals, stagedUserSettingsKeys.length, $('#separation'));


  /********** TOOLS **********/
  // map all tools values
  var toolsData = $.map(data.Tools, function(el) {
    return el;
  });

  // add # of tools to tools header
  if (toolsData.length != 0) {
    $('.tools-header').append(" - " + toolsData.length);
  }

  // loop through all Tools[]
  for (var i = 0; i < toolsData.length; i++) {
    // map all tool keys in Tools[i]
    var toolsKeys = $.map(Object.keys(toolsData[i]), function(el) {
      return el;
    });

    // map all tool values in Tools[i]
    var toolsVals = $.map(toolsData[i], function(el) {
      return el;
    });

    // set all keys+values for each Tools[i]
    createUniqueKeysValues(toolsKeys, toolsVals, i, toolsKeys.length, $('#separation0'));
  }

  /********** MACROS **********/
  // map all macros values
  var macrosData = $.map(data.Macros, function(el) {
    return el;
  });

  // loop through Macros[]
  for (var i = 0; i < macrosData.length; i++) {
    // map all macros keys in Macros[i]
    var macrosKeys = $.map(Object.keys(macrosData[i]), function(el) {
      return el;
    });

    // map all macros values in Macros[i]
    var macrosVals = $.map(macrosData[i], function(el) {
      return el;
    });

    // set all keys+values for each Macros[i]
    createUniqueKeysValues(macrosKeys, macrosVals, i, macrosKeys.length, $('#separation1'));
  }

  /********** OEMLAYER **********/
  // put keys of OemLayer in array
  var oemLayerKeys = $.map(Object.keys(data.OemLayer), function(el) {
    return el;
  })

  // put values of OemLayer in array
  var oemLayerVals = $.map(data.OemLayer, function(el) {
      return el;
  });

  // set all keys+values for each OemLayer
  createKeysValues(oemLayerKeys, oemLayerVals, oemLayerKeys.length, $('#separation2'));


  /********** ACTIVEQUALITYKEY **********/
  if (data.ActiveQualityKey == "") {
    $('#ActiveQualityKey_val').html("N/A");
  }
  else {
    $('#ActiveQualityKey_val').html(data.ActiveQualityKey);
  }

  /********** MATERIAL SETTINGS KEYS **********/

  for (var i = 0; i < data.MaterialSettingsKeys.length; i++) {
    $('<div/>', {
      'class': 'value',
      'id': data.MaterialSettingsKeys[i] + '_val',
      text: data.MaterialSettingsKeys[i]
    }).appendTo($('#separation3'));

    // break floats
    $('<div/>', {
      'class': 'break element'
    }).appendTo($('#separation3'));
  }



  /********** USER LAYER **********/
  // put keys of UserLayer in array
  var userLayerKeys = $.map(Object.keys(data.UserLayer), function(el) {
    return el;
  })

  // put values of OemLayer in array
  var userLayerVals = $.map(data.UserLayer, function(el) {
      return el;
  });

  //for (var i = 0; i < userLayerKeys.length; i++) {
  createKeysValues(userLayerKeys, userLayerVals, userLayerKeys.length, $('#separation4'));
  //}


  /********** MATERIAL LAYERS **********/
  // get all material layers values
  var materialLayersData = $.map(data.MaterialLayers, function(el) {
    return el;
  });

  // loop through materialLayersData[]
  for (var i = 0; i < materialLayersData.length; i++) {
    // map all materialLayersKeys in materialLayersData[i]
    var materialLayersKeys = $.map(Object.keys(materialLayersData[i]), function(el) {
      return el;
    });

    // map all materialLayersVals in materialLayersData[i]
    var materialLayersVals = $.map(materialLayersData[i], function(el) {
      return el;
    });

    // set all keys+values for each materialLayersData[i]
    createUniqueKeysValues(materialLayersKeys, materialLayersVals, i, materialLayersKeys.length, $('#separation5'));
  }

  /********** QUALITY LAYERS **********/
  // get all quality layers values
  var qualityLayersData = $.map(data.QualityLayers, function(el) {
    return el;
  });

  // loop through qualityLayersData[]
  for (var i = 0; i < qualityLayersData.length; i++) {
    // map all qualityLayersKeys in qualityLayersData[i]
    var qualityLayersKeys = $.map(Object.keys(qualityLayersData[i]), function(el) {
      return el;
    });

    // map all qualityLayersVals in qualityLayersData[i]
    var qualityLayersVals = $.map(qualityLayersData[i], function(el) {
      return el;
    });

    // set all keys+values for each materialLayersData[i]
    createUniqueKeysValues(qualityLayersKeys, qualityLayersVals, i, qualityLayersKeys.length, $('#separation6'));
  }
});

// this is for regular objects
function createKeysValues (key, value, length, appendID) {
  for (var i = 0; i < length; i++) {

    // remove _ and capitalze
    var text = key[i].replace(/_/g, " ");
    text = titleCase(text);

    // insert key
    $('<div/>', {
      'class': 'key',
      'id': key[i],
      text: text + ':'
    }).appendTo(appendID);

    // handle empty value case
    if (value[i] == "") {
      value[i] = "N/A"
    }

    // insert value
    $('<div/>', {
      'class': 'value',
      'id': key[i] + '_val',
      text: value[i]
    }).appendTo(appendID);

    // break floats
    $('<div/>', {
      'class': 'break element'
    }).appendTo(appendID);
  }
}

// this is for objects that are arrays
function createUniqueKeysValues (key, value, i, length, appendID) {
  for (var j = 0; j < length; j++) {

    // remove _ and capitalze
    var text = key[j].replace(/_/g, " ");
    text = titleCase(text);

    // inset key
    $('<div/>', {
      'class': 'key',
      'id': key[j]+i,
      text: text + ':'
    }).appendTo(appendID);

    // inset value
    $('<div/>', {
      'class': 'value',
      'id': key[j]+"_val"+i,
      text: value[j]
    }).appendTo(appendID);

    // break floats
    $('<div/>', {
      'class': 'break element'
    }).appendTo(appendID);
  }

  // create spacing
  $('<br>').appendTo(appendID);
}

// capitalize first letter of every word
function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   // Directly return the joined string
   return splitStr.join(' ');
}
