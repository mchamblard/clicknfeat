(function() {
  angular.module('clickApp.services')
    .factory('terrainMode', terrainModeModelFactory);

  terrainModeModelFactory.$inject = [
    'elementMode',
    'modes',
    'settings',
    'terrain',
    'gameTerrains',
    'gameTerrainSelection',
  ];
  function terrainModeModelFactory(elementModeModel,
                                   modesModel,
                                   settingsModel,
                                   terrainModel,
                                   gameTerrainsModel,
                                   gameTerrainSelectionModel) {
    const terrain_mode = elementModeModel('terrain',
                                          terrainModel,
                                          gameTerrainsModel,
                                          gameTerrainSelectionModel);

    modesModel.registerMode(terrain_mode);
    settingsModel.register('Bindings',
                           terrain_mode.name,
                           terrain_mode.bindings,
                           (bs) => {
                             R.extend(terrain_mode.bindings, bs);
                           });
    return terrain_mode;
  }
})();
