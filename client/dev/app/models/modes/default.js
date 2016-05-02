'use strict';

(function () {
  angular.module('clickApp.services').factory('defaultMode', defaultModeModelFactory);

  defaultModeModelFactory.$inject = ['appState', 'modes', 'settings', 'commonMode', 'gameModels', 'gameModelSelection', 'gameTemplateSelection', 'gameTerrainSelection'];
  var MODEL_SELECTION_LENS = R.lensPath(['game', 'model_selection']);
  var TERRAIN_SELECTION_LENS = R.lensPath(['game', 'terrain_selection']);
  var TEMPLATE_SELECTION_LENS = R.lensPath(['game', 'template_selection']);
  function defaultModeModelFactory(appStateService, modesModel, settingsModel, commonModeModel, gameModelsModel, gameModelSelectionModel, gameTemplateSelectionModel, gameTerrainSelectionModel) {
    var default_actions = Object.create(commonModeModel.actions);
    default_actions.setModelSelection = setModelSelection;
    default_actions.toggleModelSelection = toggleModelSelection;
    default_actions.modelSelectionDetail = modelSelectionDetail;
    default_actions.selectTemplate = selectTemplate;
    default_actions.templateSelectionDetail = templateSelectionDetail;
    default_actions.selectTerrain = selectTerrain;
    default_actions.enterRulerMode = enterRulerMode;
    default_actions.enterLosMode = enterLosMode;
    default_actions.dragStartMap = dragStartMap;
    default_actions.dragMap = dragMap;
    default_actions.dragEndMap = dragEndMap;

    var default_default_bindings = {
      enterRulerMode: 'ctrl+r',
      enterLosMode: 'ctrl+l',
      setModelSelection: 'clickModel',
      toggleModelSelection: 'ctrl+clickModel',
      modelSelectionDetail: 'rightClickModel',
      selectTemplate: 'clickTemplate',
      templateSelectionDetail: 'rightClickTemplate',
      selectTerrain: 'clickTerrain'
    };
    var default_bindings = R.extend(Object.create(commonModeModel.bindings), default_default_bindings);
    var default_buttons = [];
    var default_mode = {
      name: 'Default',
      actions: default_actions,
      buttons: default_buttons,
      bindings: default_bindings
    };
    modesModel.registerMode(default_mode);
    settingsModel.register('Bindings', default_mode.name, default_default_bindings, function (bs) {
      R.extend(default_mode.bindings, bs);
    });
    return default_mode;

    function setModelSelection(state, event) {
      var stamp = event['click#'].target.state.stamp;
      appStateService.chainReduce('Game.command.execute', 'setModelSelection', ['set', [stamp]]);
      return R.thread(state)(clearTemplateSelection, clearTerrainSelection);
    }
    function toggleModelSelection(state, event) {
      var stamp = event['click#'].target.state.stamp;
      var is_in_local = gameModelSelectionModel.in('local', stamp, R.view(MODEL_SELECTION_LENS, state));
      if (is_in_local) {
        appStateService.chainReduce('Game.command.execute', 'setModelSelection', ['removeFrom', [stamp]]);
      } else {
        appStateService.chainReduce('Game.command.execute', 'setModelSelection', ['addTo', [stamp]]);
      }
      return R.threadP(state)(clearTemplateSelection, clearTerrainSelection);
    }
    function modelSelectionDetail(state, event) {
      appStateService.emit('Game.selectionDetail.open', 'model', event['click#'].target);
      return setModelSelection(state, event);
    }
    function selectTemplate(state, event) {
      return R.thread(state)(clearTerrainSelection, R.over(TEMPLATE_SELECTION_LENS, gameTemplateSelectionModel.set$('local', [event['click#'].target.state.stamp])));
    }
    function templateSelectionDetail(state, event) {
      appStateService.emit('Game.selectionDetail.open', 'template', event['click#'].target);
      return selectTemplate(state, event);
    }
    function selectTerrain(state, event) {
      return R.thread(state)(clearTemplateSelection, R.over(TERRAIN_SELECTION_LENS, gameTerrainSelectionModel.set$('local', [event['click#'].target.state.stamp])));
    }
    function enterRulerMode(_state_) {
      return appStateService.chainReduce('Modes.switchTo', 'Ruler');
    }
    function enterLosMode(_state_) {
      return appStateService.chainReduce('Modes.switchTo', 'Los');
    }
    function dragStartMap(_state_, event) {
      appStateService.emit('Game.dragBox.enable', event.start, event.now);
    }
    function dragMap(_state_, event) {
      appStateService.emit('Game.dragBox.enable', event.start, event.now);
    }
    function dragEndMap(state, event) {
      appStateService.emit('Game.dragBox.disable');
      var top_left = {
        x: Math.min(event.now.x, event.start.x),
        y: Math.min(event.now.y, event.start.y)
      };
      var bottom_right = {
        x: Math.max(event.now.x, event.start.x),
        y: Math.max(event.now.y, event.start.y)
      };
      R.thread(state.game)(R.prop('models'), function (models) {
        return gameModelsModel.findStampsBetweenPoints(top_left, bottom_right, models);
      }, function (stamps) {
        if (R.isEmpty(stamps)) return;
        appStateService.chainReduce('Game.command.execute', 'setModelSelection', ['set', stamps]);
      });
    }
    function clearTemplateSelection(state) {
      return R.over(TEMPLATE_SELECTION_LENS, R.unless(gameTemplateSelectionModel.isEmpty$('local'), gameTemplateSelectionModel.clear$('local')), state);
    }
    function clearTerrainSelection(state) {
      return R.over(TERRAIN_SELECTION_LENS, R.unless(gameTerrainSelectionModel.isEmpty$('local'), gameTerrainSelectionModel.clear$('local')), state);
    }
  }
})();
//# sourceMappingURL=default.js.map
