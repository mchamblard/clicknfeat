'use strict';

describe('setSize template', function() {
  describe('rollDeviationCommand service', function() {
    beforeEach(inject([ 'rollDeviationCommand', function(rollDeviationCommand) {
      this.rollDeviationCommandService = rollDeviationCommand;
    }]));

    describe('execute(<sides>, <dice>, <scope>, <game>)', function() {
      beforeEach(function() {
        this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
        var fake_dice = [5,4];
        var ndie = 0;
        spyOn(R, 'randomRange')
          .and.callFake(function() { return fake_dice[ndie++]; });

        this.game = { dice: [] };
        this.ctxt = this.rollDeviationCommandService.execute(this.scope, this.game);
      });
      
      it('should add dice command to dice rolls', function() {
        expect(this.game.dice).toEqual([{
          desc: 'AoE deviation : direction 5, distance 4"',
          r: 5, d: 4
        }]);
      });
      
      it('should send diceRoll event', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('diceRoll');
      });

      it('should return context', function() {
        expect(this.ctxt).toEqual({
          desc: 'AoE deviation : direction 5, distance 4"',
          r: 5, d: 4
        });
      });
    });

    describe('replay(<ctxt>, <scope>, <game>)', function() {
      beforeEach(function() {
        this.ctxt = {
          desc: 'AoE deviation : direction 5, distance 4"',
          r: 5, d: 4
        };
        this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
        this.game = { dice: [] };

        this.rollDeviationCommandService.replay(this.ctxt, this.scope, this.game);
      });
      
      it('should add ctxt to game dice rolls', function() {
        expect(this.game.dice).toEqual([{
          desc: 'AoE deviation : direction 5, distance 4"',
          r: 5, d: 4
        }]);
      });
      
      it('should send diceRoll event', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('diceRoll');
      });
    });

    describe('undo(<ctxt>, <scope>, <game>)', function() {
      beforeEach(function() {
        this.ctxt = {
          stamp: 'ctxt'
        };
        this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
        this.game = { dice: [
          { stamp: 'other1' },
          { stamp: 'ctxt' },
          { stamp: 'other2' },
        ] };

        this.rollDeviationCommandService.undo(this.ctxt, this.scope, this.game);
      });
      
      it('should remove ctxt from game dice rolls', function() {
        expect(this.game.dice).toEqual([
          { stamp: 'other1' },
          { stamp: 'other2' },
        ]);
      });
      
      it('should send diceRoll event', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('diceRoll');
      });
    });
  });

  describe('aoeTemplateMode service', function() {
    beforeEach(inject([
      'aoeTemplateMode',
      function(aoeTemplateModeService) {
        this.aoeTemplateModeService = aoeTemplateModeService;
        this.gameService = spyOnService('game');
        this.gameTemplateSelectionService = spyOnService('gameTemplateSelection');

        this.scope = {
          game: { template_selection: 'selection' },
        };
      }
    ]));

    when('user deviates template selection', function() {
      this.aoeTemplateModeService.actions.deviate(this.scope);
    }, function() {
      beforeEach(function() {
        this.gameTemplateSelectionService.get._retVal = 'stamp';
        this.gameService.executeCommand.and.callFake(R.bind(function(c) {
          if(c === 'rollDeviation') {
            return { r: 4, d: 2 };
          }
          return this.gameService.executeCommand._retVal;
        }, this));
      });

      it('should get current selection', function() {
        expect(this.gameTemplateSelectionService.get)
          .toHaveBeenCalledWith('local', 'selection');
      });

      it('should execute rollDeviation command', function() {
        expect(this.gameService.executeCommand)
          .toHaveBeenCalledWith('rollDeviation',
                                this.scope, this.scope.game);
      });

      it('should execute onTemplates/deviate command', function() {
        expect(this.gameService.executeCommand)
          .toHaveBeenCalledWith('onTemplates', 'deviate', 4, 2, ['stamp'],
                                this.scope, this.scope.game);
      });
    });
  });

  describe('aoeTemplate service', function() {
    beforeEach(inject([
      'aoeTemplate',
      function(aoeTemplateService) {
        this.aoeTemplateService = aoeTemplateService;
      }
    ]));

    describe('deviate(<dir>, <len>)', function() {
      beforeEach(function() {
        this.template = {
          state: { x: 240, y:240, r: 30 }
        };
      });
      using([
        [ 'dir', 'len' , 'result' ],
        [ 1     , 2    , { x: 250, y: 222.67949192431124, r: 30 } ],
        [ 2     , 3    , { x: 270, y: 240, r: 90 } ],
        [ 3     , 4    , { x: 260, y: 274.6410161513775, r: 150 } ],
        [ 4     , 5    , { x: 215, y: 283.30127018922195, r: 210 } ],
        [ 5     , 6    , { x: 180, y: 240, r: 270 } ],
        [ 6     , 1    , { x: 235, y: 231.3397459621556, r: 330 } ],
      ], function(e, d) {
        it('should deviate template, '+d, function() {
          this.aoeTemplateService.deviate(e.dir, e.len, this.template);
          expect(this.template.state)
            .toEqual(e.result);
        });
      });
    });
  });
});