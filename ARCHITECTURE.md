---
title: CMPM120 Final Game
---
classDiagram
direction TB
    class `Phaser.GameObject.Image` {
	    +TrashInfo()
	    +TreasureInfo()
    }
    Phaser.GameObject.Image <|-- TrashInfo
    Phaser.GameObject.Image <|-- TreasureInfo
    note for Phaser.GameObject.Image "Prefabs made for each level of game play"

    class TrashInfo {
	    +constructor(scene, x, y)
	    +gainItemTrash()
	    +HasAllItemTrash()
    }

    class TreasureInfo {
	    +constructor(scene, x, y)
	    +gainItemTreasure()
	    +HasAllItemTreach()
    }

    class `Phaser.Scene` {
	    +IntroCinematic()
	    +MainMenu()
	    +Credits()
	    +Settings()
	    +GamePlayPrototype()
	    +LevelSelect()
	    +EndScene()
	    +GameplayPrototypeLevel2()
	    +GameplayPrototypeLevel3()
	    +Pause()
    }

	note for TrashInfo "One of prefabs"
	note for TreasureInfo "One of prefabs"
    note for Phaser.Scene "Classes for each game scene"
	note "Both Prefabs allow player character to pick up items"
