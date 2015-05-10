'use strict';

describe('set board', function() {
  describe('setupCtrl', function(c) {
    beforeEach(inject([
      '$rootScope',
      '$controller',
      function($rootScope,
               $controller) {
        this.gameBoardService = spyOnService('gameBoard');
        this.gameService = spyOnService('game');

        this.createController = function() {
          this.scope = $rootScope.$new();
          this.scope.game = { board: {}, scenario: {} };
          this.scope.boards = ['boards'];

          $controller('gameSetupCtrl', { 
            '$scope': this.scope,
          });
          $rootScope.$digest();
        };
        this.createController();
      }
    ]));

    when('user set board', function() {
      this.scope.board_name = 'name';
      this.scope.doSetBoard();
    }, function() {
      it('should find board_name in boards', function() {
        expect(this.gameBoardService.forName)
          .toHaveBeenCalledWith('name',
                                ['boards']);
      });

      it('should execute setBoard command', function() {
        expect(this.gameService.executeCommand)
          .toHaveBeenCalledWith('setBoard',
                                'gameBoard.forName.returnValue',
                                this.scope,
                                this.scope.game);
      });
    });
  });

  describe('setBoardCommand service', function() {
    beforeEach(inject([ 'setBoardCommand', function(setBoardCommand) {
      this.setBoardCommandService = setBoardCommand;
    }]));

    describe('execute(<board>, <scope>, <game>)', function() {
      beforeEach(function() {
        this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
        this.game = { board: 'before' };

        this.ctxt = this.setBoardCommandService.execute({
          name: 'after_name'
        }, this.scope, this.game);
      });
      
      it('should set game board', function() {
        expect(this.game.board).toEqual({ name: 'after_name' });
      });
      
      it('should send changeBoard event', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeBoard');
      });
      
      it('should return context', function() {
        expect(this.ctxt).toEqual({
          before: 'before',
          after: { name: 'after_name' },
          desc: 'after_name',
        });
      });
    });

    using([
      [ 'method', 'previous', 'result' ],
      [ 'replay', 'before'  , 'after'  ],
      [ 'undo'  , 'after'   , 'before' ],
    ], function(e, d) {
      describe(e.method+'(<ctxt>, <scope>, <game>)', function() {
        beforeEach(function() {
          this.ctxt = {
            before: 'before',
            after: 'after'
          };
          this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
          this.game = { board: e.previous };

          this.setBoardCommandService[e.method](this.ctxt, this.scope, this.game);
        });
      
        it('should set game board', function() {
          expect(this.game.board).toBe(e.result);
        });
      
        it('should send changeBoard event', function() {
          expect(this.scope.gameEvent)
            .toHaveBeenCalledWith('changeBoard');
        });
      });
    });
  });

  describe('gameBoard service', function() {
    beforeEach(inject([ 'gameBoard', function(gameBoardService) {
      this.gameBoardService = gameBoardService;
    }]));

    describe('forName(<name>)', function() {
      beforeEach(function() {
        this.boards = [
          { name: 'board1', view: 'view1' },
          { name: 'board2', view: 'view2' },
          { name: 'board3', view: 'view3' },
        ];
      });

      using([
        [ 'name'  , 'board' ],
        [ 'board1', { name: 'board1', view: 'view1' } ],
        [ 'board3', { name: 'board3', view: 'view3' } ],
        [ 'unknown', undefined ],
        [ null, undefined ],
      ], function(e, d) {
        it('should find board with <name>, '+d, function() {
          expect(this.gameBoardService.forName(e.name, this.boards))
            .toEqual(e.board);
        });
      });
    });
  });
});