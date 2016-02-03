angular.module('clickApp.services')
  .factory('game', [
    'jsonStringifier',
    'commands',
    'gameConnection',
    'gameLayers',
    'gameLos',
    'gameModels',
    'gameModelSelection',
    'gameRuler',
    'gameTemplates',
    'gameTemplateSelection',
    'gameTerrains',
    'gameTerrainSelection',
    function gameServiceFactory(jsonStringifierService,
                                commandsService,
                                gameConnectionService,
                                gameLayersService,
                                gameLosService,
                                gameModelsService,
                                gameModelSelectionService,
                                gameRulerService,
                                gameTemplatesService,
                                gameTemplateSelectionService,
                                gameTerrainsService,
                                gameTerrainSelectionService) {
      var gameService = {
        create: function gameCreate(player1) {
          var new_game = {
            players: {
              p1: { name: R.propOr('player1', 'name', player1) },
              p2: { name: null }
            }
          };
          return new_game;
        },
        load: function gameLoad(state, data) {
          return R.pipe(
            () => {
              return Object.create({
                toJSON: function() { return gameService.pickForJson(this); }
              });
            },
            (game) => {
              return R.deepExtend(game, {
                players: {
                  p1: { name: null },
                  p2: { name: null }
                },
                board: {},
                scenario: {},
                chat: [],
                commands: [],
                commands_log: [],
                undo: [],
                undo_log: [],
                dice: [],
                ruler: gameRulerService.create(),
                los: gameLosService.create(),
                models: gameModelsService.create(),
                model_selection: gameModelSelectionService.create(),
                templates: gameTemplatesService.create(),
                template_selection: gameTemplateSelectionService.create(),
                terrains: gameTerrainsService.create(),
                terrain_selection: gameTerrainSelectionService.create(),
                layers: gameLayersService.create()
              }, data);
            },
            gameConnectionService.create,
            gameReplayAll$(state)
          )();
        },
        pickForJson: function gamePickForJson(game) {
          return R.pick([
            'players', 'commands', 'undo', 'chat',
            'local_stamp', 'private_stamp', 'public_stamp'
          ], game);
        },
        toJson: function gameToJson(game) {
          return R.pipePromise(
            gameService.pickForJson,
            jsonStringifierService.stringify
          )(game);
        },
        playerName: function gamePlayerName(p, game) {
          return R.pathOr('John Doe', ['players',p,'name'], game);
        },
        description: function gameDescription(game) {
          return [ s.capitalize(gameService.playerName('p1', game)),
                   'vs',
                   s.capitalize(gameService.playerName('p2', game))
                 ].join(' ');
        },
        executeCommand: function gameExecuteCommand(cmd, args, state, game) {
          return R.pipeP(
            () => {
              return commandsService.execute
                .apply(null, [cmd, args, state, game]);
            },
            ([command, game]) => {
              return [ R.pipe(
                R.assoc('user', R.pathOr('Unknown', ['user','state','name'], state)),
                R.assoc('stamp', R.guid())
              )(command),
                       game
                     ];
            },
            ([command, game]) => {
              if(gameConnectionService.active(game)) {
                return gameConnectionService
                  .sendReplayCommand(command, game);
              }
              if(!command.do_not_log) {
                game = R.over(R.lensProp('commands'),
                              R.append(command),
                              game);
              }
              if(command.type === 'rollDice' ||
                 command.type === 'rollDeviation') {
                game = R.over(R.lensProp('dice'),
                              R.append(command),
                              game);
              }
              return game;
            },
            (game) => {
              state.changeEvent('Game.command.execute');
              return game;
            }
          )();
        },
        undoCommand: function gameUndoCommand(command, state, game) {
          return R.pipePromise(
            R.propOr([], 'undo_log'),
            R.find(R.propEq('stamp', command.stamp)),
            (log) => {
              if(R.exists(log)) {
                console.log('Game : undoCmd log', command);
                let log = R.propOr([], 'undo_log', game);
                return R.assoc('undo_log',
                               R.reject(R.propEq('stamp', command.stamp), log),
                               game);
              }
              return commandsService
                .undo(command, state, game);
            },
            (game) => {
              let commands = R.propOr([], 'commands', game);
              let undo = R.propOr([], 'undo', game);
              return R.pipe(
                R.assoc('commands', R.reject(R.propEq('stamp', command.stamp), commands)),
                R.assoc('undo', R.append(command, undo))
              )(game);
            },
            (game) => {
              state.changeEvent('Game.command.undo');
              return game;
            }
          )(game);
        },
        undoLastCommand: function gameUndoLastCommand(state, game) {
          return R.pipePromise(
            R.propOr([],'commands'),
            R.last,
            R.rejectIf(R.isNil, 'Command history empty'),
            (command) => {
              return R.pipeP(
                commandsService.undo$(command, state),
                (game) => { return [command, game]; }
              )(game);
            },
            ([command, game]) => {
              return R.pipePromise(
                R.assoc('commands', R.init(game.commands)),
                (game) => {
                  if(gameConnectionService.active(game)) {
                    return gameConnectionService
                      .sendUndoCommand(command, game);
                  }
                  return R.over(R.lensProp('undo'),
                                R.append(command),
                                game);
                }
              )(game);
            },
            (game) => {
              state.changeEvent('Game.command.undo');
              return game;
            }
          )(game);
        },
        replayCommand: function gameReplayCommand(command, state, game) {
          return R.pipePromise(
            R.propOr([], 'commands_log'),
            R.find(R.propEq('stamp', command.stamp)),
            (log) => {
              if(R.exists(log)) {
                console.log('Game: replayCmd log', command);
                return R.over(R.lensProp('commands_log'),
                              R.reject(R.propEq('stamp', command.stamp)),
                              game);
              }
              return commandsService
                .replay(command, state, game);
            },
            (game) => {
              return R.pipe(
                R.over(R.lensProp('undo'),
                       R.reject(R.propEq('stamp', command.stamp))),
                (game) => {
                  if(command.do_not_log) return game;

                  return R.over(R.lensProp('commands'),
                                R.append(command),
                                game);
                }
              )(game);
            },
            (game) => {
              state.changeEvent('Game.command.replay');
              return game;
            }
          )(game);
        },
        replayCommandsBatch: function gameReplayCommandsBatch(cmds, state, game) {
          return R.pipeP(
            commandsService.replayBatch$(cmds, state),
            R.over(R.lensProp('commands'),
                   R.flip(R.concat)(cmds))
          )(game);
        },
        replayNextCommand: function gameReplayNextCommand(state, game) {
          return R.pipePromise(
            R.propOr([], 'undo'),
            R.last,
            (command) => {
              if(R.isNil(command)) {
                return self.Promise
                  .reject('Undo history empty');
              }
              return R.pipeP(
                commandsService.replay$(command, state),
                (game) => { return [command, game]; }
              )(game);
            },
            ([command, game]) => {
              return R.pipePromise(
                R.assoc('undo', R.init(game.undo)),
                (game) => {
                  if(gameConnectionService.active(game)) {
                    return gameConnectionService
                      .sendReplayCommand(command, game);
                  }
                  let commands = R.propOr([], 'commands', game);
                  return R.assoc('commands', R.append(command, commands), game);
                }
              )(game);
            },
            (game) => {
              state.changeEvent('Game.command.replay');
              return game;
            }
          )(game);
        },
        sendChat: function gameSendChat(from, msg, game) {
          return gameConnectionService
            .sendEvent({
              type: 'chat',
              chat: {
                from: from,
                msg: msg
              }
            }, game);
        }
      };
      function gameReplayBatchs(batchs, state, game) {
        if(R.isEmpty(batchs)) return game;

        console.log('Game: ReplayBatchs:', batchs);
        return R.pipeP(
          commandsService.replayBatch$(batchs[0], state),
          (game) => {
            return new self.Promise((resolve) => {
              self.requestAnimationFrame(() => {
                resolve(gameReplayBatchs(R.tail(batchs), state, game));
              });
            });
          }
        )(game);
      }
      var gameReplayAll$ = R.curry((state, game) => {
        return new self.Promise((resolve) => {
          if(R.isEmpty(game.commands)) {
            resolve(game);
          }

          var batchs = R.splitEvery(game.commands.length, game.commands);
          self.requestAnimationFrame(() => {
            resolve(gameReplayBatchs(batchs, state, game));
          });
        });
      });
      R.curryService(gameService);
      return gameService;
    }
  ]);