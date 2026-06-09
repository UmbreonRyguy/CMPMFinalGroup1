Back To The Forest

By: Monolith Studio

Project Documentation Archive: [Archive Link](https://docs.google.com/document/d/e/2PACX-1vTDXJQCGB7wx_cZYv2h0UmMCsKIj049BfdoYKn5Ozq5ghFFyS73xPW4B8SBk4DmzAAuIlI1yDkLAviC/pub)

### Credits (everyone add their own name + role):
- testing lead - Rheann Kunita
- Backup Tech Lead, Art Direction Lead - Sydney Osako
- Tech Lead - Quetzal Theobald
- Backup Production Lead - Kamalika De
- Production Lead - Ryan Funk

Core Gameplay Prototype Documentation

Audio - Background music and Jump Sound inside the game on level 1
Visual - Our game contains hand-drawn image assets and tilemap sheets
Motion - Game includes tween motions in the opening animation 
Progression - The player can progress through level one, flipping a switch to progress to the top platform.
Prefabs - We have 2 prefabs in the form of different collectible items, Trash and Treasure.

Cinematics Prototype Documentation
-Includes an intro cutscene showing our game studio logo (name still being decided)
-Includes an interactive main menu with responsive buttons
-The intro cutscene uses tween chains to satisfy the choreography requirement. 

Scene Flow Prototype Documentation
-We have our 4 main scenes as well as additional scenes, which are all accessible
    -Main title scene - Intro-Cinematic.js
    -Credits scene - Credits.js
    -Gameplay Scene - Core-Gameplay.js
    -Menu Scene - Main-Menu.js

Our Communication is demonstrated by a variable titled "itemsheld" which is created in the gameplay scene, and passed to the end scenes to display items collected

The 'Fancy Transition' is demonstrated using the Gameplay scenes and pause scenes 

All important scenes are accesible through buttons. 

