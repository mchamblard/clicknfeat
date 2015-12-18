'use strict';

angular.module('clickApp.services').factory('commands', [function commandsServiceFactory() {
  var CMD_REGS = {};
  var commandsService = {
    registerCommand: function commandsRegister(name, command) {
      console.log('register command', name, command);
      CMD_REGS[name] = command;
    },
    execute: function commandsExecute(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return R.pipePromise(function () {
        if (R.isNil(CMD_REGS[name])) {
          console.log('execute unknown command ' + name);
          return self.Promise.reject('execute unknown command ' + name);
        }
        return CMD_REGS[name].execute.apply(null, args);
      }, function (ctxt) {
        ctxt.type = name;
        return ctxt;
      })();
    },
    undo: function commandsUndo(ctxt, scope, game) {
      return R.pipePromise(function () {
        if (R.isNil(CMD_REGS[ctxt.type])) {
          console.log('undo unknown command ' + ctxt.type);
          return self.Promise.reject('undo unknown command ' + ctxt.type);
        }
        return CMD_REGS[ctxt.type].undo(ctxt, scope, game);
      })();
    },
    replay: function commandsReplay(ctxt, scope, game) {
      return R.pipePromise(function () {
        if (R.isNil(CMD_REGS[ctxt.type])) {
          console.log('replay unknown command ' + ctxt.type);
          return self.Promise.reject('replay unknown command ' + ctxt.type);
        }
        return CMD_REGS[ctxt.type].replay(ctxt, scope, game);
      })();
    },
    replayBatch: function commandsReplayBatch(commands, scope, game) {
      if (R.isEmpty(commands)) return self.Promise.resolve();

      // console.log('Commands: ReplayBatch:');
      // console.log('Commands: ReplayBatch:', commands);
      return commandsService.replay(commands[0], scope, game).catch(R.always(null)).then(function () {
        return commandsService.replayBatch(R.tail(commands), scope, game);
      });
    }
  };
  R.curryService(commandsService);
  return commandsService;
}]).factory('allCommands', ['createModelCommand', 'deleteModelCommand', 'setModelSelectionCommand', 'lockModelsCommand', 'onModelsCommand', 'createTemplateCommand', 'deleteTemplatesCommand', 'lockTemplatesCommand', 'onTemplatesCommand', 'rollDiceCommand', 'rollDeviationCommand', 'setBoardCommand', 'setLayersCommand', 'setLosCommand', 'setRulerCommand', 'setScenarioCommand', function () {
  return {};
}]);
//# sourceMappingURL=commands.js.map