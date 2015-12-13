angular.module('clickApp.services').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/debug.html',
    "<div class=container><div class=\"panel panel-info\"><div class=panel-heading><h4 class=panel-title>Import dump file</h4></div><div class=panel-body style=\"max-height: 10em;\n" +
    "         overflow-y: auto\"><input style=\"display: inline\" id=import-file type=file multiple ea-file=\"doOpenDumpFile(file)\"></div></div></div>"
  );


  $templateCache.put('partials/directives/games_list.html',
    "<div ng-repeat=\"(i,g) in games\" class=\"clickable {{isInSelection(i) ? 'bg-info':''}}\" ng-click=setSelection(i)>{{::g | game:'description'}}</div>"
  );


  $templateCache.put('partials/directives/prompt.html',
    "<div><div class=prompt-mask></div><div class=\"prompt-container text-center\"><div class=\"prompt-panel panel panel-default\"><form name=prompt><div class=panel-body><p></p><input step=any min=0 class=\"form-control\"></div><div class=panel-footer><button class=\"btn btn-default\" type=button style=width:45%>Cancel</button> <button class=\"btn btn-primary\" type=submit style=width:45%>Ok</button></div></form></div></div></div>"
  );


  $templateCache.put('partials/directives/user_connection.html',
    "<div ng-repeat=\"u in user.connection.users track by u.stamp\" class=\"user clickable {{ userIsInTo(u.stamp) ? 'bg-info' : '' }} {{ (user.state.stamp === u.stamp) ? 'bg-primary' : '' }}\" ng-click=doToggleUserTo(u.stamp)>{{ u | user:'stateDescription' }} ( {{:: u.stamp }} )</div><h4>Chat</h4><form ng-submit=doSendChatMessage()><div class=form-group><label>To :</label><em>{{ (user | userConnection:'usersNamesForStamps':chat.to).join(',') }}</em><div class=input-group><span class=input-group-btn><button type=button class=\"btn btn-default\" ng-click=doSendChatMessageToAll()>ToAll</button></span> <input class=form-control placeholder=Msg... ng-model=\"chat.msg\"></div></div></form><div class=chat-list><div class=chat ng-repeat=\"c in user.connection.chat.slice().reverse() track by c.stamp\"><em ng-click=doSetToChat(c) class=clickable>{{ user | userConnection:'userNameForStamp':c.from }} ➝ {{ (user | userConnection:'usersNamesForStamps':c.to).join(',') }}</em> : <a ng-href={{c.link}}>{{c.msg}}</a></div></div>"
  );


  $templateCache.put('partials/game.html',
    "<div id=game click-game-page><div id=gameview class=resizable><div id=zoom-osd class=btn-group-vertical ng-include=\"'partials/game/zoomOsd.html'\"></div><div id=cmd-osd ng-include=\"'partials/game/cmdOsd.html'\"></div><div id=game-loading class=\"text-center bg-primary\" click-game-loading><strong>Loading...</strong></div><div id=game-warn-mode class=text-center click-game-warn-mode><div class=warn-mode-name>Mode</div><div class=warn-reason>Reason</div></div><div id=selection-osd ng-include=\"'partials/game/selectionOsd.html'\" click-game-selection-detail></div><div id=viewport><svg id=map click-game-map click-game-layers viewbox=\"0 0 480 480\"><defs><filter id=aura-filter x=-50% y=-50% width=200% height=200%><fegaussianblur in=SourceGraphic stddeviation=\"2\"></filter><marker id=aoe-direction-end markerwidth=6 markerheight=8 refx=6 refy=4 orient=auto><polygon points=\"0,8 6,4 0,0\" style=\"fill:#0F0\"></marker><marker id=ruler-start markerwidth=6 markerheight=8 refx=0 refy=4 orient=auto><polygon points=\"6,8 0,4 6,0\" style=\"fill:#0EE\"><line x1=0 y1=1 x2=0 y2=7 style=\"stroke:#0CC;\n" +
    "                         stroke-width:2px\"></marker><marker id=ruler-end markerwidth=6 markerheight=8 refx=6 refy=4 orient=auto><polygon points=\"0,8 6,4 0,0\" style=\"fill:#0EE\"><line x1=6 y1=1 x2=6 y2=7 style=\"stroke:#0CC;\n" +
    "                         stroke-width:2px\"></marker></defs><g id=game-board ng-show=\"game.layers | gameLayers:'isDisplayed':'b'\"><image id=board-preview x=0 y=0 width=480 height=480 xlink:href=\"{{game.board.preview || ''}}\"></image><image id=board-view x=0 y=0 width=480 height=480 xlink:href=\"{{game.board.img || ''}}\"></image></g><g id=game-deploiement ng-show=\"game.layers | gameLayers:'isDisplayed':'d'\" ng-include=\"'partials/game/deploiement.html'\"></g><g id=game-scenario ng-show=\"game.layers | gameLayers:'isDisplayed':'s'\" ng-include=\"'partials/game/scenario.html'\"></g><g id=game-templates-locked ng-show=\"game.layers | gameLayers:'isDisplayed':'t'\" click-game-templates-list=locked></g><g id=game-under-models ng-show=\"game.layers | gameLayers:'isDisplayed':'m'\"></g><g id=game-models-locked ng-show=\"game.layers | gameLayers:'isDisplayed':'m'\" click-game-models-list=locked></g><g id=game-models ng-show=\"game.layers | gameLayers:'isDisplayed':'m'\" click-game-models-list=active></g><g id=game-over-models ng-show=\"game.layers | gameLayers:'isDisplayed':'m'\"></g><g id=game-templates ng-show=\"game.layers | gameLayers:'isDisplayed':'t'\" click-game-templates-list=active></g><g id=game-ruler click-game-ruler></g><g id=game-los click-game-los></g><g id=game-create-models><g ng-repeat=\"(index, model) in create.model.models\" click-game-create-model></g></g><g id=game-create-templates click-game-create-template></g><rect id=game-dragbox click-game-dragbox></rect></svg></div></div><div id=menu><button id=menu-toggle class=\"btn btn-default\" title=\"Toggle menu\"><span class=\"glyphicon glyphicon-chevron-left\"></span> <span class=\"glyphicon glyphicon-chevron-right\"></span></button><div id=menu-content><p><strong>Player 1:</strong> {{game | game:'playerName':'p1'}} <strong>VS</strong> <strong>Player 2:</strong> {{game | game:'playerName':'p2'}}<form class=form-inline ng-show=\"game | gameConnection:'active'\" ng-submit=doInvitePlayer()><div class=form-group><div class=input-group><span class=input-group-btn><button type=submit class=\"btn btn-default\">Invite Player</button></span><select class=form-control ng-options=\"u.stamp as (u.name | capitalize) for u in user.connection.users\" ng-model=invite.player required></select></div></div></form></p><ul class=\"nav nav-tabs\"><li class=\"{{stateIs('game.main') ? 'active' : ''}}\" ng-click=\"goToState('^.main')\"><a>Main</a></li><li class=\"{{stateIs('game.model') ? 'active' : ''}}\" ng-click=\"goToState('^.model')\"><a>Model</a></li><li class=\"{{stateIs('game.setup') ? 'active' : ''}}\" ng-click=\"goToState('^.setup')\"><a>Setup</a></li><li class=\"{{stateIs('game.log') ? 'active' : ''}}\" ng-click=\"goToState('^.log')\"><a>Log</a></li><li class=\"{{stateIs('game.save') ? 'active' : ''}}\" ng-click=\"goToState('^.save')\"><a>Save</a></li><li class=\"{{stateIs('game.help') ? 'active' : ''}}\" ng-click=\"goToState('^.help')\"><a>Help</a></li><li ng-click=\"goToState('lounge')\"><a>Lounge</a></li></ul><div ui-view id=menu-view class=\"{{currentModeIs('CreateTemplate') ? 'disabled' : ''}}\"></div></div></div></div>"
  );


  $templateCache.put('partials/game/cmdOsd.html',
    "<div class=scroll-container><div class=mode-title><strong>{{currentModeName()}}</strong></div><div class=btn-group-vertical><button class=\"btn btn-default\" title=\"{{action_bindings['modeBackToDefault'] || ''}}\" ng-click=\"doModeAction('modeBackToDefault')\">Back To Default</button> <button class=\"btn btn-default\" title=\"{{action_bindings['flipMap'] || ''}}\" ng-click=\"doModeAction('flipMap')\">Flip Map</button> <button ng-repeat=\"action in action_buttons\" class=\"btn {{::(action.length === 3 && action[1] !== 'toggle') ? 'btn-info' : 'btn-default'}}\" title=\"{{::action_bindings[action[1]] || ''}}\" ng-click=doActionButton(action) ng-show=\"\n" +
    "            action[1] === 'toggle' ||\n" +
    "            action.length === 2 ||\n" +
    "            show_action_group === action[2]\n" +
    "            \">{{action[0]}} <span class=\"glyphicon {{action[1] === 'toggle' ? (show_action_group === action[2] ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down') : '' }}\"></span></button></div></div>"
  );


  $templateCache.put('partials/game/deploiement.html',
    "<g><line x1=0 y1=70 x2=480 y2=70 class=deploiement-line></line><line x1=0 y1=90 x2=480 y2=90 class=extended-deploiement-line></line><line x1=0 y1=130 x2=480 y2=130 class=advance-deploiement-line></line><line x1=0 y1=150 x2=480 y2=150 class=extended-advance-deploiement-line></line><line x1=0 y1=100 x2=480 y2=100 class=deploiement-line></line><line x1=0 y1=120 x2=480 y2=120 class=extended-deploiement-line></line><line x1=0 y1=160 x2=480 y2=160 class=advance-deploiement-line></line><line x1=0 y1=180 x2=480 y2=180 class=extended-advance-deploiement-line></line><line x1=0 y1=380 x2=480 y2=380 class=deploiement-line></line><line x1=0 y1=360 x2=480 y2=360 class=extended-deploiement-line></line><line x1=0 y1=320 x2=480 y2=320 class=advance-deploiement-line></line><line x1=0 y1=300 x2=480 y2=300 class=extended-advance-deploiement-line></line><line x1=0 y1=410 x2=480 y2=410 class=deploiement-line></line><line x1=0 y1=390 x2=480 y2=390 class=extended-deploiement-line></line><line x1=0 y1=350 x2=480 y2=350 class=advance-deploiement-line></line><line x1=0 y1=330 x2=480 y2=330 class=extended-advance-deploiement-line></line><line x1=0 y1=30 x2=480 y2=30 class=ambush-line></line><line x1=30 y1=0 x2=30 y2=480 class=ambush-line></line><line x1=0 y1=450 x2=480 y2=450 class=ambush-line></line><line x1=450 y1=0 x2=450 y2=480 class=ambush-line></line><g id=deploiement-labels><rect x=0 y=58 width=1.2em height=1em class=dep-label></rect><text x=0 y=69 class=dep-label>7\"</text><rect x=0 y=122 width=1.8em height=1em class=dep-label-sm></rect><text x=0 y=129 class=dep-label-sm>13\"</text><rect x=0 y=88 width=1.8em height=1em class=dep-label></rect><text x=0 y=99 class=dep-label>10\"</text><rect x=0 y=152 width=1.8em height=1em class=dep-label-sm></rect><text x=0 y=159 class=dep-label-sm>16\"</text><rect x=0 y=368 width=1.8em height=1em class=dep-label></rect><text x=0 y=379 class=dep-label>10\"</text><rect x=0 y=312 width=1.8em height=1em class=dep-label-sm></rect><text x=0 y=319 class=dep-label-sm>16\"</text><rect x=0 y=398 width=1.2em height=1em class=dep-label></rect><text x=0 y=409 class=dep-label>7\"</text><rect x=0 y=342 width=1.8em height=1em class=dep-label-sm></rect><text x=0 y=349 class=dep-label-sm>13\"</text></g></g>"
  );


  $templateCache.put('partials/game/help.html',
    "<div><div class=\"panel panel-info\"><div class=panel-heading>Debug dump file</div><div class=panel-body><a ng-href={{debug.url}} download={{::debug.name}}>Download Dump File</a></div></div><div class=\"panel panel-info\"><div class=panel-heading>Current Mode Bindings</div><table class=table><tr ng-repeat=\"bind in bindings track by bind[0]\"><td><button class=\"btn btn-default\" ng-click=doModeAction(bind[0])>{{::bind[0]}}</button></td><td>{{::bind[1]}}</td><td></td></tr></table></div></div>"
  );


  $templateCache.put('partials/game/log.html',
    "<div><div class=\"panel panel-info\"><div class=panel-heading><strong>Command Log</strong></div><div class=panel-content><button class=\"btn btn-default\" title=\"{{action_bindings['commandUndoLast'] || ''}}\" ng-disabled=\"game.commands.length === 0\" ng-click=\"doModeAction('commandUndoLast')\">Undo Last</button> <button class=\"btn btn-default\" title=\"{{action_bindings['commandReplayNext'] || ''}}\" ng-disabled=\"game.undo.length === 0\" ng-click=\"doModeAction('commandReplayNext')\">Replay Next</button><div class=log-replay-list click-log-replay-list=game.undo><div ng-repeat=\"(i,cmd) in game.undo.slice(-20) track by cmd.stamp\"><span class=text-primary>[{{::cmd.user}}]</span> {{::cmd.type}} {{::cmd.desc}}</div></div><div class=\"log-replay-list log\" click-log-replay-list=game.undo_log><div ng-repeat=\"(i,cmd) in game.undo_log.slice(-20) track by cmd.stamp\"><span class=text-primary>[{{::cmd.user}}]</span> <span class=text-info>{{::cmd.type}} {{::cmd.desc}}</span></div></div><div class=\"log-command-list log\"><div ng-repeat=\"(i,cmd) in game.commands_log.slice(-20).reverse() track by cmd.stamp\"><span class=text-primary>[{{::cmd.user}}]</span> <span class=text-info>{{::cmd.type}} {{::cmd.desc}}</span></div></div><div class=log-command-list><div ng-repeat=\"(i,cmd) in game.commands.slice(-20).reverse() track by cmd.stamp\"><span class=text-primary>[{{::cmd.user}}]</span> {{::cmd.type}} {{::cmd.desc}}</div></div></div></div></div>"
  );


  $templateCache.put('partials/game/main.html',
    "<div><div ng-show=\"game | gameConnection:'active'\" class=\"panel panel-info\"><div class=panel-heading>Chat</div><div class=panel-content><form ng-submit=doSendChatMessage()><div class=form-group><div class=input-group><span class=input-group-btn><button type=submit class=\"btn btn-default\">Send</button></span> <input class=form-control placeholder=Msg... ng-model=\"chat.msg\"></div></div></form><div class=chat-list><div class=chat ng-repeat=\"c in game.chat.slice().reverse().slice(0,20) track by c.stamp\">{{ c.from }} ➝ {{c.msg}}</div></div></div></div><div class=\"panel panel-info\"><div class=panel-heading>Tools</div><div class=panel-content><button class=\"btn {{ currentModeIs('Ruler') ? 'btn-primary' : 'btn-default' }}\" title=\"{{action_bindings['enterRulerMode'] || ''}}\" ng-click=doUseRuler()>Use<br>Ruler</button> <button class=\"btn {{ (game.ruler | gameRuler:'isDisplayed') ? 'btn-primary' : 'btn-default' }}\" ng-click=doToggleShowRuler()>Show<br>Ruler</button> <button class=\"btn {{ currentModeIs('LoS') ? 'btn-primary' : 'btn-default' }}\" title=\"{{action_bindings['enterLosMode'] || ''}}\" ng-click=doUseLos()>Use<br>LoS</button> <button class=\"btn {{ (game.los | gameLos:'isDisplayed') ? 'btn-primary' : 'btn-default' }}\" ng-click=doToggleShowLos()>Show<br>LoS</button> <button class=\"btn btn-default\" ng-click=\"doCreateTemplate('aoe')\">New<br>AoE</button> <button class=\"btn btn-default\" ng-click=\"doCreateTemplate('spray')\">New<br>Spray</button> <button class=\"btn btn-default\" ng-click=\"doCreateTemplate('wall')\">New<br>Wall</button></div></div><div class=\"panel panel-info\"><div class=panel-heading>Dice</div><div class=panel-content><button class=\"btn btn-default\" title=\"{{action_bindings['roll1D6'] || ''}}\" ng-click=\"doRollDice(6, 1)\">1D6</button> <button class=\"btn btn-default\" title=\"{{action_bindings['roll2D6'] || ''}}\" ng-click=\"doRollDice(6, 2)\">2D6</button> <button class=\"btn btn-default\" title=\"{{action_bindings['roll3D6'] || ''}}\" ng-click=\"doRollDice(6, 3)\">3D6</button> <button class=\"btn btn-default\" title=\"{{action_bindings['roll4D6'] || ''}}\" ng-click=\"doRollDice(6, 4)\">4D6</button> <button class=\"btn btn-default\" title=\"{{action_bindings['roll5D6'] || ''}}\" ng-click=\"doRollDice(6, 5)\">5D6</button> <button class=\"btn btn-default\" title=\"{{action_bindings['roll1D3'] || ''}}\" ng-click=\"doRollDice(3, 1)\">1D3</button><div id=main-dice-list><div ng-repeat=\"(i,dice) in game.dice.slice(-10).reverse() track by dice.stamp\"><span class=text-primary>[{{::dice.user}}]</span> {{::dice.desc}}</div></div></div></div></div>"
  );


  $templateCache.put('partials/game/model.html',
    "<div><div class=\"panel panel-info\"><div class=panel-heading><strong>Create Model</strong></div><div class=panel-content><form class=form-inline name=board-map><table><tr><th>Faction</th><td><select class=form-control ng-options=\"k as f.name for (k,f) in factions\" ng-model=faction ng-change=onFactionChange()></select></td></tr><tr><th>Section</th><td><select class=form-control ng-options=\"k as k for (k,s) in factions[faction].models\" ng-model=section ng-change=onSectionChange()></select></td></tr><tr><th>Entry</th><td><select class=form-control ng-options=\"k as e.name for (k,e) in factions[faction].models[section]\" ng-model=entry ng-change=onEntryChange()></select></td></tr><tr ng-show=factions[faction].models[section][entry].entries><th>Type</th><td><select class=form-control ng-options=\"\n" +
    "                      k as k for (k,t) in\n" +
    "                      factions[faction].models[section][entry].entries\n" +
    "                      \" ng-model=type ng-change=onTypeChange()></select></td></tr><tr ng-show=factions[faction].models[section][entry].entries><th>Model</th><td><select class=form-control ng-options=\"\n" +
    "                      k as m.name for (k,m) in\n" +
    "                      factions[faction].models[section][entry].entries[type]\n" +
    "                      \" ng-model=model ng-change=onModelChange()></select></td></tr><tr ng-show=getModel().ranges><th>Size</th><td><select class=form-control ng-options=\"\n" +
    "                      s as s for (k,s) in\n" +
    "                      getModel().ranges\n" +
    "                      \" ng-model=repeat></select></td></tr></table></form><br><table ng-show=getModel()><tr ng-show=\"getModel() !== factions[faction].models[section][entry]\"><th>Unit</th><td>{{factions[faction].models[section][entry].name}}</td></tr><tr><th>Name</th><td>{{getModel().name}}</td></tr><tr><th>Type</th><td>{{getModel().type}}</td></tr><tr ng-show=getModel().fury><th>Fury</th><td>{{getModel().fury}}</td></tr><tr><th>Base</th><td>{{getModel().base}}</td></tr><tr><th>Damage</th><td><click-game-model-damage info=getModel().damage></click-game-model-damage></td></tr><tr ng-show=getModel().img[0].link><th>Image</th><td><img width=150 height=150 ng-src=\"{{getModel().img[0].link}}\"></td></tr></table></div><div class=panel-footer><button class=\"btn btn-default\" ng-disabled=\"\n" +
    "              !getModel() ||\n" +
    "              currentModeIs('CreateModel')\n" +
    "              \" ng-click=doCreateModel()>Create Model</button></div></div><div class=\"panel panel-info\"><div class=panel-heading><strong>Import Models File</strong></div><div class=panel-content><form class=form-inline><div class=form-group><input type=file multiple class=form-control ea-file=\"doImportModelsFile(file)\"></div></form></div></div></div>"
  );


  $templateCache.put('partials/game/model_damage.html',
    "<div><strong>Total :</strong> <span ng-show=state>{{state.dmg.t}} /</span>{{info.total}} <span ng-if=info.field>+ <span ng-show=state>{{state.dmg.f}} /</span>{{info.field}}</span> <button class=\"btn btn-default\" ng-show=state ng-click=doResetDamage()>Reset</button><div ng-if=\"info.type == 'warrior'\" class=damage-warrior><div ng-repeat=\"i in range(info.n)\" class=\"damage-box {{ warriorBoxClass(i) }}\" ng-click=doWarriorDamage(i+1)></div></div><table class=damage-grid ng-if=info.field><tr ng-repeat=\"line in [0, 1]\"><td ng-repeat=\"col in range(info.field/2)\" class=\"damage-box {{ fieldBoxClass(col, line) }}\" ng-click=\"doFieldDamage(line * info.field/2 + col + 1)\">F</td></tr></table><table ng-if=\"\n" +
    "         info.type === 'jack' ||\n" +
    "         info.type === 'gargantuan' ||\n" +
    "         info.type === 'beast'\n" +
    "         \" class=damage-grid><tr><td ng-repeat=\"col in ['1','2','3','4','5','6']\" class=damage-col-header ng-click=doGridColDamage(col)>{{::col}}</td></tr><tr ng-repeat=\"line in range(info.depth)\"><td ng-repeat=\"col in ['1','2','3','4','5','6']\" class=\"damage-box {{ gridBoxClass(col, line) }}\" ng-click=\"doGridDamage(line, col)\">{{ (!info[col][line] || info[col][line] === 'b') ? ' ' : info[col][line].toUpperCase() }}</td></tr></table><table ng-if=\"info.type === 'colossal'\" class=damage-grid><tr><td ng-repeat=\"col in ['L1','L2','L3','L4','L5','L6','R1','R2','R3','R4','R5','R6']\" class=damage-col-header ng-click=doGridColDamage(col)>{{::col}}</td></tr><tr ng-repeat=\"line in [0,1,2,3,4,5]\"><td ng-repeat=\"col in ['L1','L2','L3','L4','L5','L6','R1','R2','R3','R4','R5','R6']\" class=\"damage-box {{ gridBoxClass(col, line) }}\" ng-click=\"doGridDamage(line, col)\">{{ (!info[col][line] || info[col][line] === 'b') ? ' ' : info[col][line].toUpperCase() }}</td></tr></table></div>"
  );


  $templateCache.put('partials/game/models_list.html',
    "<g ng-repeat=\"(i,model) in game.models[type] track by model.state.stamp\" click-game-model></g>"
  );


  $templateCache.put('partials/game/save.html',
    "<div><button type=button class=\"btn btn-default\" ng-click=updateExports()>Update files</button><div class=\"panel panel-info\"><div class=panel-heading>Save current game</div><div class=panel-body><a ng-href={{save.url}} download={{::save.name}}>Download Game File</a></div></div><div class=\"panel panel-info\"><div class=panel-heading>Save current models selection</div><div class=panel-body><a ng-href={{selection_save.url}} download={{::selection_save.name}}>Download Models File</a></div></div></div>"
  );


  $templateCache.put('partials/game/scenario.html',
    "<g><circle ng-repeat=\"(i,c) in game.scenario.circle track by i\" ng-attr-cx={{::c.x}} ng-attr-cy={{::c.y}} ng-attr-r={{::c.r}} class=\"zone\"><rect ng-repeat=\"(i,r) in game.scenario.rect track by i\" ng-attr-x={{::r.x-r.width/2}} ng-attr-y={{::r.y-r.height/2}} ng-attr-width={{::r.width}} ng-attr-height={{::r.height}} class=\"zone\"><circle ng-repeat=\"(i,o) in game.scenario.objectives track by i\" ng-attr-cx={{::o.x}} ng-attr-cy={{::o.y}} r=9.842 class=\"objective\"><circle ng-repeat=\"(i,f) in game.scenario.flags track by i\" ng-attr-cx={{::f.x}} ng-attr-cy={{::f.y}} r=7.874 class=\"objective\"><g ng-show=\"stateIs('game.setup')\"><rect ng-show=game.scenario.killbox x=140 y=140 width=200 height=200 class=\"area\"><circle ng-repeat=\"(i,o) in game.scenario.objectives track by i\" ng-attr-cx={{::o.x}} ng-attr-cy={{::o.y}} r=49.842 class=\"area\"><circle ng-repeat=\"(i,f) in game.scenario.flags track by i\" ng-attr-cx={{::f.x}} ng-attr-cy={{::f.y}} r=47.874 class=\"area\"></g></g>"
  );


  $templateCache.put('partials/game/selectionOsd.html',
    "<div ng-include=\"'partials/game/selectionOsd_'+type+'.html'\"></div>"
  );


  $templateCache.put('partials/game/selectionOsd_model.html',
    "<div class=\"panel panel-info\"><div class=panel-heading ng-click=doClose()><button class=close><span>&times;</span></button><h4 class=panel-title>{{info.name}}</h4></div><div class=panel-content><div ng-if=info.unit_name><strong>Unit :</strong> {{info.unit_name}}</div><div><strong>Name :</strong> {{info.name}}</div><div><strong>Created By :</strong> {{selection.state.user}}</div><div><strong>Class :</strong> {{info.type}} - {{info.base}}</div><div ng-show=info.fury><strong>Fury :</strong> {{info.fury}}</div><div ng-show=info.focus><strong>Focus :</strong> {{info.focus}}</div><div class=\"hint clickable\" ng-hide=show.info ng-click=\"show.info = true\">Show Info...</div><div class=bg-info ng-show=show.info><div ng-repeat=\"d in info.desc\"><strong>{{d[0]}}</strong> {{d[1]}}</div></div><form ng-submit=doAddLabel()><div class=form-group><label for=new-label>Label</label><input id=new-label class=form-control ng-model=edit.label placeholder=\"New Label\"></div><button type=button class=\"btn btn-default\" ng-repeat=\"l in selection.state.l\" ng-click=doRemoveLabel(l)>{{::labelDisplay(l)}} <span>&times;</span></button></form><div><strong>Damage :</strong><click-game-model-damage info=info.damage state=selection.state on-error=\"gameEvent('modeActionError', reason)\"></click-game-model-damage></div></div></div>"
  );


  $templateCache.put('partials/game/selectionOsd_template.html',
    "<div class=\"panel panel-info\"><div class=panel-heading ng-click=doClose()><button class=close><span>&times;</span></button><h4 class=panel-title>{{selection.state.type}} Template</h4></div><div class=panel-content><form name=selection-label ng-submit=doSetMaxDeviation() ng-show=\"selection.state.type === 'aoe'\"><div class=form-group><label for=new-deviation>Max Deviation</label><input id=new-deviation class=form-control type=number step=any min=0 ng-model=edit.max_deviation placeholder=\"0\"></div></form><form ng-submit=doAddLabel()><div class=form-group><label for=new-label>Label</label><input id=new-label class=form-control ng-model=edit.label placeholder=\"New Label\"></div><button type=button class=\"btn btn-default\" ng-repeat=\"l in selection.state.l\" ng-click=doRemoveLabel(l)>{{::labelDisplay(l)}} <span>&times;</span></button></form></div></div>"
  );


  $templateCache.put('partials/game/setup.html',
    "<div><div class=\"panel panel-info\"><div class=panel-heading><strong>Layers</strong></div><div class=panel-content><form class=form-inline name=layers><div class=checkbox><label><input type=checkbox ng-checked=\"game.layers | gameLayers:'isDisplayed':'b'\" ng-click=\"doToggleLayer('b')\"> Board</label></div><div class=checkbox><label><input type=checkbox ng-checked=\"game.layers | gameLayers:'isDisplayed':'d'\" ng-click=\"doToggleLayer('d')\"> Deploiement</label></div><div class=checkbox><label><input type=checkbox ng-checked=\"game.layers | gameLayers:'isDisplayed':'s'\" ng-click=\"doToggleLayer('s')\"> Scenario</label></div><div class=checkbox><label><input type=checkbox ng-checked=\"game.layers | gameLayers:'isDisplayed':'m'\" ng-click=\"doToggleLayer('m')\"> Models</label></div><div class=checkbox><label><input type=checkbox ng-checked=\"game.layers | gameLayers:'isDisplayed':'t'\" ng-click=\"doToggleLayer('t')\"> Templates</label></div></form></div></div><div class=\"panel panel-info\"><div class=panel-heading><strong>Board Map</strong></div><div class=panel-content><form class=form-inline name=board-map><select class=form-control ng-options=\"b.name as b.name for b in boards\" ng-model=board_name ng-change=doSetBoard()></select><button class=\"btn btn-default\" ng-click=doSetRandomBoard()>Random</button></form></div></div><div class=\"panel panel-info\"><div class=panel-heading><strong>Scenario</strong></div><div class=panel-content><form class=form-inline name=scenario><select class=form-control ng-options=\"s as s[0] for s in scenarios\" ng-model=scenario_group></select><select class=form-control ng-options=\"s.name as s.name for s in scenario_group[1]\" ng-model=scenario_name ng-change=doSetScenario()></select><button class=\"btn btn-default\" ng-click=doSetRandomScenario()>Random</button> <button class=\"btn btn-default\" ng-click=doGenerateObjectives()>Generate Objective</button></form></div></div></div>"
  );


  $templateCache.put('partials/game/templates_list.html',
    "<g ng-repeat=\"template in game.templates[type] track by template.state.stamp\" click-game-template></g>"
  );


  $templateCache.put('partials/game/zoomOsd.html',
    "<button type=button class=\"btn btn-default\" ng-click=\"doModeAction('viewZoomIn')\" title=\"{{action_bindings['viewZoomIn'] || ''}}\"><span class=\"glyphicon glyphicon-zoom-in\"></span></button> <button type=button class=\"btn btn-default\" ng-click=\"doModeAction('viewZoomReset')\" title=\"{{action_bindings['viewZoomReset'] || ''}}\"><span class=\"glyphicon glyphicon-fullscreen\"></span></button> <button type=button class=\"btn btn-default\" ng-click=\"doModeAction('viewZoomOut')\" title=\"{{action_bindings['viewZoomOut'] || ''}}\"><span class=\"glyphicon glyphicon-zoom-out\"></span></button>"
  );


  $templateCache.put('partials/lounge.html',
    "<div id=lounge class=container><div class=\"panel panel-info\"><div class=panel-heading><h4 class=panel-title>{{ user | user:'description' }} / {{ (user | user:'online') ? 'Online' : 'Offline' }} ( {{ user.state.stamp }} )</h4></div><div class=panel-body ng-show=\"user | userConnection:'active'\"><click-user-connection></click-user-connection></div><div class=panel-footer><button type=button class=\"btn btn-default\" ng-click=doUserToggleOnline()>Go {{ (user | user:'online') ? 'Offline' : 'Online' }}</button></div></div><div class=\"panel panel-info\" ng-show=\"user | userConnection:'active'\"><div class=panel-heading><h4 class=panel-title>Online Games</h4></div><div class=\"game-list panel-body\"><click-games-list games=user.connection.games selection=online_games_selection></click-games-list></div><div class=panel-footer><form><div class=btn-group><button type=button class=\"btn btn-default\" ng-click=doCreateOnlineGame()>New Game</button> <button type=button class=\"btn btn-default\" ng-click=doLoadOnlineGame() ng-disabled=\"online_games_selection.list.length <= 0\">Watch Game</button></div><div class=form-group><label for=import-file>Upload game file :</label><input class=form-control id=import-file type=file multiple ea-file=\"doOpenOnlineGameFile(file)\"></div></form></div></div><div class=\"panel panel-info\"><div class=panel-heading><h4 class=panel-title>Local games</h4></div><div class=\"game-list panel-body\"><click-games-list games=local_games selection=local_games_selection></click-games-list></div><div class=panel-footer><form><div class=btn-group><button type=button class=\"btn btn-default\" ng-click=doCreateLocalGame()>New Game</button> <button type=button class=\"btn btn-default\" ng-click=doLoadLocalGame() ng-disabled=\"local_games_selection.list.length <= 0\">Load Game</button> <button type=button class=\"btn btn-default\" ng-click=doDeleteLocalGame(index) ng-disabled=\"local_games_selection.list.length <= 0\">Delete Game</button></div><div class=form-group><label for=import-file>Import game file :</label><input class=form-control id=import-file type=file multiple ea-file=\"doOpenLocalGameFile(file)\"></div></form></div></div></div>"
  );


  $templateCache.put('partials/settings.html',
    "<div id=settings class=container><ul class=\"nav nav-tabs\"><li ng-repeat=\"m in menu\" class=\"{{stateIs('settings.'+m) ? 'active' : ''}}\" ng-click=\"goToState('^.'+m)\"><a>{{::m}}</a></li></ul><div ui-view></div></div>"
  );


  $templateCache.put('partials/settings/bindings.html',
    "<div id=settings-bindings><form><div class=form-group><label>For mode :</label><select class=form-control ng-options=\"m as m for m in modes\" ng-model=mode></select></div></form><table class=table><tr><th>Action</th><th>Default</th><th>Current</th></tr><tr ng-repeat=\"(a,b) in settings.default.Bindings[mode]\" class=\"{{settings.current.Bindings[mode][a] !== b ? 'modified' : ''}}\"><td class=vertical-center>{{::a}}</td><td class=vertical-center>{{::b}}</td><td><div class=input-group><input class=form-control placeholder={{::b}} ng-model=settings.current.Bindings[mode][a] ng-change=\"doUpdateSettings()\"> <span class=input-group-btn><button class=\"btn btn-default\" type=button ng-click=doRecordBinding(a)><span class=\"glyphicon glyphicon-record\"></span></button></span></div><span style=\"font-style: italic\" ng-show=\"recording === a\">Recording...</span></td></tr></table></div>"
  );


  $templateCache.put('partials/settings/main.html',
    "<div id=settings-main><div class=\"panel panel-info\"><div class=panel-heading><span class=\"glyphicon glyphicon-import\"></span> Import</div><div class=panel-content><form><div class=form-group><label class=control-label for=import-file>Choose file</label><input id=import-file type=file multiple ea-file=\"doOpenSettingsFile(file)\"></div></form><div class=error-list><div ng-repeat=\"err in open_result\"><strong class=text-warning>{{::err}}</strong></div></div></div><div class=panel-footer><button type=button class=\"btn btn-default\" ng-click=doResetSettings({})>Reset Settings</button></div></div><div class=\"panel panel-info\"><div class=panel-heading><span class=\"glyphicon glyphicon-export\"></span> Export</div><div class=panel-content><a class=\"btn btn-default\" ng-href={{save.url}} download={{::save.name}}>Download Settings File</a></div></div></div>"
  );


  $templateCache.put('partials/settings/models.html',
    "<div id=settings-main><p class=text-danger><strong>{{error}}</strong></p><p class=text-success><strong>{{success}}</strong></p><div class=\"panel panel-info\"><div class=panel-heading><span class=\"glyphicon glyphicon-import\"></span> Models Descriptions</div><div class=\"panel-body row\"><form><div class=\"form-group {{ hasDesc(f) ? 'bg-info' : '' }}\" ng-repeat=\"(f, faction) in factions\"><label class=\"control-label col-xs-3 text-right\"><span class=\"clickable glyphicon glyphicon-trash\" ng-click=doClearFactionDesc(f)></span> {{::faction.name}}</label><input id=file-{{::f}} type=file multiple ea-file=\"doOpenFactionFile(f, file)\"></div></form></div><div class=panel-footer><button type=button class=\"btn btn-default\" ng-click=doClearAllDesc(f)>Clear All <span class=\"glyphicon glyphicon-trash\"></span></button></div></div></div>"
  );


  $templateCache.put('partials/settings/moves.html',
    "<div id=settings-bindings><form><div class=form-group><label>For mode :</label><select class=form-control ng-options=\"m as m for m in modes\" ng-model=mode></select></div></form><table class=table><tr><th>Action</th><th>Default</th><th>Current</th></tr><tr ng-repeat=\"(a,b) in settings.default.Moves[mode]\" class=\"{{settings.current.Moves[mode][a] !== b ? 'modified' : ''}}\"><td class=vertical-center>{{::a}}</td><td class=vertical-center>{{::b}}</td><td><div class=input-group><input type=number class=form-control placeholder={{::b}} ng-model=settings.current.Moves[mode][a] ng-change=\"doUpdateSettings()\"></div></td></tr></table></div>"
  );


  $templateCache.put('partials/user.html',
    "<div class=container><form name=user_form><div class=form-group><label for=name>Name</label><input id=name name=name class=form-control ng-model=edit_user.name required></div><div class=form-group><label for=language>Language</label><input id=language name=language class=form-control ng-model=edit_user.language placeholder=\"FR, EN, ...\"></div><div class=form-group><label for=chat>Chat</label><select id=chat name=chat class=form-control type=text ng-model=edit_user.chat multiple><option value=text>Text</option><option value=skype>Skype</option></select></div><div class=form-group><label for=faction>Faction</label><select id=faction name=faction class=form-control ng-model=edit_user.faction multiple><option value=circle>Circle Orboros</option><option value=cryx>Cryx</option><option value=cygnar>Cygnar</option><option value=cyriss>Convergence of Cyriss</option><option value=khador>Khador</option><option value=legion>Legion of Everblight</option><option value=menoth>Protectorate of Menoth</option><option value=mercs>Mercernaries</option><option value=minions>Minions</option><option value=scyrah>Retribution of Scyrah</option><option value=skorne>Skorne Empire</option><option value=troll>Trollbloods</option></select></div><div class=form-group><label for=game_size>Games sizes</label><input id=game_size name=game_size class=form-control ng-model=edit_user.game_size placeholder=\"50, 35, ...\"></div><div class=form-group><label for=ck_position>Favorite Caster Kill Positions</label><select id=ck_position name=ck_position class=form-control type=text ng-model=edit_user.ck_position multiple><option value=Missionary>Missionary</option><option value=69>69</option><option value=71>71</option><option value=47>47</option><option value=ln(2Pi)>ln(2Pi)</option><option value=WTF?>WTF?</option></select></div><div class=form-group><button class=\"btn btn-default\" ng-click=doSaveUser() ng-disabled=!user_form.$valid>Save User</button></div></form></div>"
  );

}]);