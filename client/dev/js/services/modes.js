'use strict';

angular.module('clickApp.services').factory('modes', [function modesServiceFactory() {
  var MODES_REG = {};
  var modesService = {
    registerMode: function registerMode(mode) {
      console.log('modes: registering ' + mode.name, mode);
      MODES_REG[mode.name] = mode;
    },
    init: function modesInit(scope) {
      var modes = {
        register: MODES_REG
      };
      // TODO : import customized bindings
      return enterMode('Default', scope, modes);
    },
    currentModeName: function currentModeName(modes) {
      return currentMode(modes).name;
    },
    currentModeBindings: function currentModeBindings(modes) {
      return currentMode(modes).bindings;
    },
    currentModeBindingsPairs: function currentModeBindingsPairs(modes) {
      return R.pipe(R.toPairsIn, R.sortBy(R.head))(currentMode(modes).bindings);
    },
    currentModeAction: function currentModeAction(action) /*, modes*/{
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var modes = R.last(args);
      var mode = currentMode(modes);
      return R.pipePromise(function () {
        if (R.isNil(mode.actions[action])) {
          console.log('modes: unknown mode ' + mode.name + ' action ' + action);
          return self.Promise.reject('Unknown action ' + action);
        }
        return null;
      }, function () {
        return mode.actions[action].apply(null, R.init(args));
      })();
    },
    switchToMode: function switchToMode(name, scope, modes) {
      var previous_mode = currentMode(modes);
      return R.pipePromise(
      // () => {
      //   if(next === mode) {
      //     console.log('modes: already in '+name+' mode');
      //     return self.Promise.reject('already in '+name+' mode');
      //   }
      // return null;
      // },
      function () {
        if (R.isNil(R.prop(name, modes.register))) {
          console.log('modes: error switching to mode ' + name + ' : does not exists');
          return self.Promise.reject('mode ' + name + ' does not exists');
        }
        return modes;
      }, leaveMode(scope), enterMode(name, scope), function (modes) {
        console.log('modes: switch mode from ' + previous_mode.name + ' to ' + name);
        scope.gameEvent('switchMode');
        return modes;
      })();
    }
  };

  function currentMode(modes) {
    return modes.register[modes.current];
  }
  var enterMode = R.curry(function _enterMode(name, scope, modes) {
    return R.pipePromise(function () {
      var next_mode = modes.register[name];
      return R.exists(next_mode.onEnter) ? next_mode.onEnter(scope) : null;
    }, function () {
      modes.current = name;
      return modes;
    }, setupCurrentModeBindings(scope), setupCurrentModeButtons(scope))();
  });
  var leaveMode = R.curry(function _leaveMode(scope, modes) {
    var mode = currentMode(modes);
    if (R.exists(mode.onLeave)) {
      return self.Promise.resolve(mode.onLeave(scope)).then(R.always(modes));
    }
    return modes;
  });
  var setupCurrentModeButtons = R.curry(function _setupCurrentModeButtons(scope, modes) {
    scope.action_buttons = currentMode(modes).buttons;
    scope.action_bindings = modesService.currentModeBindings(modes);
    return modes;
  });
  var setupCurrentModeBindings = R.curry(function _setupCurrentModeBindings(scope, modes) {
    Mousetrap.reset();
    setupBindings(currentMode(modes), scope);
    return modes;
  });
  function setupBindings(mode, scope) {
    var own_bindings = R.keys(mode.bindings);
    var all_bindings = R.keysIn(mode.bindings);
    var inherited_bindings = R.difference(all_bindings, own_bindings);
    R.forEach(function (action) {
      Mousetrap.bind(mode.bindings[action], actionBinding(mode.actions, action, scope));
    }, inherited_bindings);
    R.forEach(function (action) {
      Mousetrap.bind(mode.bindings[action], actionBinding(mode.actions, action, scope));
    }, own_bindings);
  }
  function actionBinding(actions, name, scope) {
    return function binding(event, keys) {
      console.log('binding', actions, name, keys, event);
      var res = actions[name](scope, event);
      event.preventDefault();
      return self.Promise.resolve(res).catch(function (reason) {
        scope.gameEvent('modeActionError', reason);
      });
    };
  }
  R.curryService(modesService);
  return modesService;
}]).factory('allModes', ['defaultMode', 'rulerMode', 'losMode', 'createModelMode', 'modelsMode', 'modelMode', 'modelChargeMode', 'modelPlaceMode', 'createTemplateMode', 'aoeTemplateMode', 'sprayTemplateMode', 'wallTemplateMode', function () {
  return {};
}]);
//# sourceMappingURL=modes.js.map