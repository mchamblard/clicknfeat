'use strict';

angular.module('clickApp.services')
  .factory('onModelsCommand', [
    'commands',
    'model',
    'gameModels',
    'gameModelSelection',
    function onModelsCommandServiceFactory(commandsService,
                                           modelService,
                                           gameModelsService,
                                           gameModelSelectionService) {
      var onModelsCommandService = {
        execute: function onModelsExecute(method /* ...args..., stamps, scope, game */) {
          if('Function' !== R.type(modelService[method])) {
            return self.Promise.reject('Unknown method '+method+' on model');
          }
          
          var args = Array.prototype.slice.call(arguments);
          var game = R.last(args);
          var scope = R.nth(-2, args);
          var stamps = R.nth(-3, args);
          var ctxt = {
            before: [],
            after: [],
            desc: method,
          };

          args = R.append(game.models, R.slice(0, -2, args));

          return R.pipeP(
            function() {
              return gameModelsService.onStamps$('saveState', stamps, game.models);
            },
            function(before) {
              ctxt.before = before;
              
              return gameModelsService.onStamps.apply(null, args);
            },
            function() {
              return gameModelsService.onStamps('saveState', stamps, game.models);
            },
            function(after) {
              ctxt.after = after;

              R.forEach(function(stamp) {
                scope.gameEvent('changeModel-'+stamp);
              }, stamps);
              
              return ctxt;
            }
          )();
        },
        replay: function onModelsRedo(ctxt, scope, game) {
          var stamps = R.pluck('stamp', ctxt.after);
          return R.pipeP(
            gameModelsService.findAnyStamps$(stamps),
            R.addIndex(R.forEach)(function(model, index) {
              if(R.isNil(model)) return;

              modelService.setState(ctxt.after[index], model);
              scope.gameEvent('changeModel-'+modelService.eventName(model));
            }),
            function() {
              game.model_selection =
                gameModelSelectionService.set('remote', stamps,
                                              scope, game.model_selection);
            }
          )(game.models);
        },
        undo: function onModelsUndo(ctxt, scope, game) {
          var stamps = R.pluck('stamp', ctxt.before);
          return R.pipeP(
            gameModelsService.findAnyStamps$(stamps),
            R.addIndex(R.forEach)(function(model, index) {
              if(R.isNil(model)) return;

              modelService.setState(ctxt.before[index], model);
              scope.gameEvent('changeModel-'+modelService.eventName(model));
            }),
            function() {
              game.model_selection =
                gameModelSelectionService.set('remote', stamps,
                                              scope, game.model_selection);
            }
          )(game.models);
        }
      };
      commandsService.registerCommand('onModels', onModelsCommandService);
      return onModelsCommandService;
    }
  ]);