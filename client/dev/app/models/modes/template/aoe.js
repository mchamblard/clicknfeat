'use strict';

(function () {
  angular.module('clickApp.services').factory('aoeTemplateMode', aoeTemplateModeModelFactory);

  aoeTemplateModeModelFactory.$inject = ['modes', 'settings', 'templateMode', 'game', 'gameTemplates', 'gameTemplateSelection',
  // 'gameRuler',
  'prompt'];
  function aoeTemplateModeModelFactory(modesModel, settingsModel, templateModeModel, gameModel, gameTemplatesModel, gameTemplateSelectionModel,
  // gameRulerModel,
  promptService) {
    var template_actions = Object.create(templateModeModel.actions);
    template_actions.aoeSize3 = aoeSize3;
    template_actions.aoeSize4 = aoeSize4;
    template_actions.aoeSize5 = aoeSize5;
    template_actions.setTargetModel = setTargetModel;
    template_actions.setMaxDeviation = setMaxDeviation;
    template_actions.deviate = deviate;
    // template_actions.setToRulerTarget = setToRulerTarget;

    var template_default_bindings = {
      setTargetModel: 'shift+clickModel',
      aoeSize3: '3',
      aoeSize4: '4',
      aoeSize5: '5',
      deviate: 'd',
      setMaxDeviation: 'shift+d'
    };
    // setToRulerTarget: 'shift+r'
    var template_bindings = R.extend(Object.create(templateModeModel.bindings), template_default_bindings);
    var template_buttons = R.concat([['Size', 'toggle', 'size'], ['Aoe3', 'aoeSize3', 'size'], ['Aoe4', 'aoeSize4', 'size'], ['Aoe5', 'aoeSize5', 'size'], ['Deviate', 'deviate']],
    // [ 'Set to Ruler' , 'setToRulerTarget' ],
    templateModeModel.buttons);

    var template_mode = {
      onEnter: function onEnter() /*state*/{},
      onLeave: function onLeave() /*state*/{},
      name: 'aoe' + templateModeModel.name,
      actions: template_actions,
      buttons: template_buttons,
      bindings: template_bindings
    };
    modesModel.registerMode(template_mode);
    settingsModel.register('Bindings', template_mode.name, template_default_bindings, function (bs) {
      R.extend(template_mode.bindings, bs);
    });
    return template_mode;

    function aoeSize3(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [3], stamps]);
    }
    function aoeSize4(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [4], stamps]);
    }
    function aoeSize5(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [5], stamps]);
    }
    function setTargetModel(state, event) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setTargetP', [state.factions, null, event['click#'].target], stamps]);
    }
    function setMaxDeviation(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return R.threadP(state.game)(R.prop('templates'), gameTemplatesModel.fromStampsP$('maxDeviation', [], stamps), askForMax, function (value) {
        return value === 0 ? null : value;
      }, function (value) {
        return state.eventP('Game.update', R.lensProp('templates'), gameTemplatesModel.onStampsP$('setMaxDeviation', [value], stamps));
      });

      function askForMax(maxes) {
        var max = maxes[0];
        return promptService.promptP('prompt', 'Set AoE max deviation :', max).catch(R.spyAndDiscardError());
      }
    }
    function deviate(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return R.threadP()(function () {
        return state.eventP('Game.command.execute', 'rollDeviation', []);
      }, R.always(state), R.path(['game', 'dice']), R.last, function (deviation) {
        return state.eventP('Game.command.execute', 'onTemplates', ['deviate', [deviation.r, deviation.d], stamps]);
      });
    }
    // function setToRulerTarget(state) {
    //   if(!gameRulerModel.isDisplayed(state.game.ruler)) return null;

    //   const stamps = gameTemplateSelectionModel
    //         .get('local', state.game.template_selection);
    //   return R.threadP(state.game)(
    //     R.prop('ruler'),
    //     gameRulerModel.targetAoEPosition$(state.game.models),
    //     (position) => state.eventP('Game.command.execute',
    //                                'onTemplates',
    //                                [ 'setToRuler',
    //                                  [position],
    //                                  stamps
    //                                ])
    //   );
    // }
  }
})();
//# sourceMappingURL=aoe.js.map
