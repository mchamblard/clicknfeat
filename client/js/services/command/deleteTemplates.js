'use strict';

self.deleteTemplatesCommandServiceFactory =
  function deleteTemplatesCommandServiceFactory(commandsService,
                                                templateService,
                                                gameTemplatesService,
                                                gameTemplateSelectionService) {
    var deleteTemplatesCommandService = {
      execute: function deleteTemplatesExecute(stamps, scope, game) {
        var ctxt = {
          templates: []
        };
        R.forEach(function(stamp) {
          var template = gameTemplatesService.findStamp(stamp, game.templates);
          if(R.isNil(template)) return;

          ctxt.templates.push(templateService.saveState(template));
          game.templates = gameTemplatesService.removeStamp(stamp, game.templates);
          gameTemplateSelectionService.removeFromLocal(stamp, scope,
                                                       game.template_selection);
        }, stamps);
        scope.gameEvent('createTemplate');
        return ctxt;
      },
      replay: function deleteTemplatesReplay(ctxt, scope, game) {
        R.forEach(function(state) {
          game.templates = gameTemplatesService.removeStamp(state.stamp, game.templates);
          gameTemplateSelectionService.removeFromLocal(state.stamp, scope,
                                                       game.template_selection);
        }, ctxt.templates);
        scope.gameEvent('createTemplate');
      },
      undo: function deleteTemplatesUndo(ctxt, scope, game) {
        R.forEach(function(state) {
          var template = templateService.create(state);
          if(R.isNil(template)) return;

          game.templates = gameTemplatesService.add(template, game.templates);
        }, ctxt.templates);
        scope.gameEvent('createTemplate');
      }
    };
    commandsService.registerCommand('deleteTemplates', deleteTemplatesCommandService);
    return deleteTemplatesCommandService;
  };