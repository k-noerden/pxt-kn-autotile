/**
 * Autotile library for tiles
 */
//% weight=100 color="#03AA74" weight=100 icon="\uf11b" block="KN Autotile"
//% groups='["KNAutotile"]'
namespace knautotile {

    let _tiles: Image[] = [];
    /**
     * Add a variant tile, the replacement
     * @param tile the tile to replace
     * @param weight the amount of change, eg: 1
     */
    //% blockId=kn_autotile_addVariant
    //% block="Add replacement tile $tile=tileset_tile_picker with weight %weight"
    //% group="KNAutotile"
    //% weight=100
    export function addVariant(tile: Image, weight: number) {
        for (let i = 0; i < weight; ++i) {
            _tiles.push(tile);
        }
    }


    /**
     * Replace the given tile with a random one of those added before.
     * Will reset the list of variants.
     */
    //% blockId=kn_autotile_variations
    //% block="As variations over $tile=tileset_tile_picker"
    //% group="KNAutotile"
    //% weight=100
    export function variations(tile: Image) {
        // let tile: Image = sprites.castle.tileGrass1;

        // const tiles = [sprites.castle.tileGrass1,
        //                sprites.castle.tileGrass2,
        //                sprites.castle.tileGrass3]
        let tiles = _tiles;
        _tiles = [];
        const scene = game.currentScene();
        if (!tile || !scene.tileMap) return;
        const index = scene.tileMap.getImageType(tile);
        const tileMap = scene.tileMap;
        if (!tileMap.enabled) return;
        const selected = []
        for (let tile_ of tiles) {
            selected.push(tileMap.getImageType(tile_));
        }
        const selected_length = selected.length;
        const width = tileMap.areaWidth() >> tileMap.scale;
        const height = tileMap.areaHeight() >> tileMap.scale;
        // let map: bool[][];
        for (let col = 0; col < width; ++col) {
            // let mapRow = [];
            for (let row = 0; row < height; ++row) {
                let currTile = tileMap.getTileIndex(col, row);
                if (currTile === index) {
                    let i = randint(0, selected_length - 1);
                    tileMap.setTileAt(col, row, selected[i]);
                }
                // mapRow.push(currTile === index);
            }
            // map.push(mapRow);
        }
    }


    /**
     * Autotile dungeon.darkGround
     */
    //% blockId=kn_autotile_autotileDarkground
    //% block="Autotile darkGround $tile=tileset_tile_picker"
    //% group="KNAutotile"
    //% weight=100
    export function autotile_dungeon_darkGround(tile: Image) {
        const scene = game.currentScene();
        if (!tile || !scene.tileMap || !scene.tileMap.enabled) { return; }
        const tileMap = scene.tileMap;
        const index = scene.tileMap.getImageType(tile);
        const width = tileMap.areaWidth() >> tileMap.scale;
        const height = tileMap.areaHeight() >> tileMap.scale;
        let map: boolean[][] = [];
        for (let y = 0; y < height; ++y) {
            let row = [];
            for (let x = 0; x < width; ++x) {
                let currTile = tileMap.getTileIndex(x, y);
                row.push(currTile === index);
            }
            map.push(row);
        }
        // NW NN NE
        // WW -- EE
        // SW SS SE
        const w = width - 1;
        const h = height - 1;
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if (!map[y][x]) continue;
                let NW = (x > 0 && y > 0) ? map[y-1][x-1] : false;
                let NN = (         y > 0) ? map[y-1][x+0] : false;
                let NE = (x < w && y > 0) ? map[y-1][x+1] : false;
                let WW = (x > 0         ) ? map[y+0][x-1] : false;
                let EE = (x < w         ) ? map[y+0][x+1] : false;
                let SW = (x > 0 && y < h) ? map[y+1][x-1] : false;
                let SS = (         y < h) ? map[y+1][x+0] : false;
                let SE = (x < w && y < h) ? map[y+1][x+1] : false;

                tile = sprites.dungeon.darkGroundCenter;
                if (false) { }
                else if (!NN && !WW) { tile = sprites.dungeon.darkGroundNorthWest0; }
                else if (!NN && !EE) { tile = sprites.dungeon.darkGroundNorthEast0; }
                else if (!SS && !WW) { tile = sprites.dungeon.darkGroundSouthWest0; }
                else if (!SS && !EE) { tile = sprites.dungeon.darkGroundSouthEast0; }
                else if (!NN) { tile = sprites.dungeon.darkGroundNorth; }
                else if (!EE) { tile = sprites.dungeon.darkGroundEast; }
                else if (!SS) { tile = sprites.dungeon.darkGroundSouth; }
                else if (!WW) { tile = sprites.dungeon.darkGroundWest; }
                else if (NN && WW && !NW) { tile = sprites.dungeon.darkGroundSouthEast1; }
                else if (NN && EE && !NE) { tile = sprites.dungeon.darkGroundSouthWest1; }
                else if (SS && WW && !SW) { tile = sprites.dungeon.darkGroundNorthEast1; }
                else if (SS && EE && !SE) { tile = sprites.dungeon.darkGroundNorthWest1; }
                else { tile = sprites.dungeon.darkGroundCenter; }
                let index2 = scene.tileMap.getImageType(tile);
                tileMap.setTileAt(x, y, index2);
            }
        }
    }

    enum Wa {
        Void,
        Ground,
        Wall,

        North,
        East,
        South,
        West,

        NorthWest,
        NorthEast,
        SouthWest,
        SouthEast,

        InnerNorthWest,
        InnerNorthEast,
        InnerSouthWest,
        InnerSouthEast,

        NorthBroken,
        EastBroken,
        SouthBroken,
        WestBroken,

        NorthTorch,
        EastTorch,
        SouthTorch,
        WestTorch,
    }
    const tilesetPurple = [
        null,
        null,
        assets.tile`transparency16`, // sprites.castle.tileGrass1, // null,

        sprites.dungeon.purpleOuterNorth0,
        sprites.dungeon.purpleOuterEast1,  // So it seems like the arcade developers flipped the brokenness of East0 and East1
        sprites.dungeon.purpleOuterSouth1, // So it seems like the arcade developers flipped the brokenness of South0 and South1
        sprites.dungeon.purpleOuterWest0,

        sprites.dungeon.purpleOuterNorthWest,
        sprites.dungeon.purpleOuterNorthEast,
        sprites.dungeon.purpleOuterSouthEast, // So it seems like the arcade developers flipped SouthEast and SouthWest, So we just handle it in the rendering
        sprites.dungeon.purpleOuterSouthWest, // --||--

        sprites.dungeon.purpleInnerNorthWest,
        sprites.dungeon.purpleInnerNorthEast,
        sprites.dungeon.purpleInnerSouthWest,
        sprites.dungeon.purpleInnerSouthEast,

        sprites.dungeon.purpleOuterNorth1,
        sprites.dungeon.purpleOuterEast0,  // So it seems like the arcade developers flipped the brokenness of East0 and East1
        sprites.dungeon.purpleOuterSouth0, // So it seems like the arcade developers flipped the brokenness of South0 and South1
        sprites.dungeon.purpleOuterWest1,

        sprites.dungeon.purpleOuterNorth2,
        sprites.dungeon.purpleOuterEast2,
        sprites.dungeon.purpleOuterSouth2,
        sprites.dungeon.purpleOuterWest2,


    ]
    const tilesetGreen = [
        null,
        null,
        assets.tile`transparency16`, // sprites.castle.tileGrass1, // null,

        sprites.dungeon.greenOuterNorth0,
        sprites.dungeon.greenOuterEast0,
        sprites.dungeon.greenOuterSouth1,  // So it seems like the arcade developers flipped the brokenness of South0 and South1
        sprites.dungeon.greenOuterWest0,

        sprites.dungeon.greenOuterNorthWest,
        sprites.dungeon.greenOuterNorthEast,
        sprites.dungeon.greenOuterSouthEast, // So it seems like the arcade developers flipped SouthEast and SouthWest, So we just handle it in the rendering
        sprites.dungeon.greenOuterSouthWest, // --||--

        sprites.dungeon.greenInnerNorthWest,
        sprites.dungeon.greenInnerNorthEast,
        sprites.dungeon.greenInnerSouthWest,
        sprites.dungeon.greenInnerSouthEast,

        sprites.dungeon.greenOuterNorth1,
        sprites.dungeon.greenOuterEast1,
        sprites.dungeon.greenOuterSouth0,  // So it seems like the arcade developers flipped the brokenness of South0 and South1
        sprites.dungeon.greenOuterWest1,

        sprites.dungeon.greenOuterNorth2,
        sprites.dungeon.greenOuterEast2,
        sprites.dungeon.greenOuterSouth2,
        sprites.dungeon.greenOuterWest2,
    ]


    export enum Tileset {
        //% block=Purple
        Purple,
        //% block=Green
        Green,
    }
    export enum AddWall {
        //% block="Add walls"
        Yes,
        //% block="No"
        No,

    }

    /**
     * Autotile dungeon.purple
     * @param tile the tile to replace
     * @param tileset the tileset to use for replacement
     * @param wall Should walls be added to the wall tiles?
     * @param normal the ratio of normal walls, eg: 100
     * @param broken the ratio of broken walls, eg: 100
     * @param torches the ratio of walls with torches, eg: 100
     */
    //% blockId=kn_autotile_autotilePurpleWall
    //% block="Autotile wall $tile=tileset_tile_picker|%tileset|%wall|Normal %normal|Broken %broken|Torches %torches"
    //% group="KNAutotile"
    //% weight=100
    export function autotile_dungeon_wall(tile: Image, tileset: Tileset, wall: AddWall, normal: number, broken: number, torches: number) {
        // const tile = sprites.dungeon.purpleOuterNorth0;
        // const tile = sprites.dungeon.purpleOuterNorth2;
        const scene = game.currentScene();
        if (!tile || !scene.tileMap || !scene.tileMap.enabled) { return; }
        // images are stored as an Index in a tilemap table
        const tileIndex = scene.tileMap.getImageType(tile);
        const voidIndex = scene.tileMap.getImageType(assets.tile`transparency16`);
        const width = scene.tileMap.areaWidth() >> scene.tileMap.scale;
        const height = scene.tileMap.areaHeight() >> scene.tileMap.scale;
        let map: number[][] = [];
        let row = [];
        let premap = map;


        // Setup tileset for rendering
        let selectedTileset = tileset === Tileset.Purple ? tilesetPurple : tilesetGreen
        let tilesetIndexes = [];
        for (let image of selectedTileset) {
            if (image === null) {
                tilesetIndexes.push(null);
            } else {
                tilesetIndexes.push(scene.tileMap.getImageType(image));
            }
        }

        // Prepopulate map
        for (let x = 0; x < width; ++x) {
            row.push(Wa.Void);
        }
        map.push(row)
        for (let y = 0; y < height; ++y) {
            let row = [];
            row.push(Wa.Void)
            for (let x = 0; x < width; ++x) {
                let currTile = scene.tileMap.getTileIndex(x, y);
                if (currTile == tileIndex) {
                    row.push(Wa.Wall);
                } else if (currTile == voidIndex) {
                    row.push(Wa.Void);
                } else {
                    row.push(Wa.Ground);
                }
            }
            row.push(Wa.Void)
            map.push(row);
        }
        for (let x = 0; x < width; ++x) {
            row.push(Wa.Void);
        }
        map.push(row)

        // Instead of having to special case all the corner and edge tiles,
        // we expand the map and translate it in.
        // In some cases we only have to iterate over the actual content, ignoring the buffer added.
        // Example to visualize off-by-one cases
        // width 4
        // 0123
        // ####
        // 012345
        // _####_


        let result: number[][] = [];
        for (let y = 0; y < height + 2; ++y) {
            row = []
            for (let x = 0; x < width + 2; ++x) {
                row.push(map[y][x]);
                // row.push(Wa.Void);
            }
            result.push(row);
        }

        // NW NN NE
        // WW -- EE
        // SW SS SE

        // Calulate simple cases
        for (let y = 1; y < height + 1; ++y) {
            for (let x = 1; x < width + 1; ++x) {
                if (map[y][x] === Wa.Wall) {
                    let NW = map[y-1][x-1];
                    let NN = map[y-1][x+0];
                    let NE = map[y-1][x+1];
                    let WW = map[y+0][x-1];
                    let EE = map[y+0][x+1];
                    let SW = map[y+1][x-1];
                    let SS = map[y+1][x+0];
                    let SE = map[y+1][x+1];

                    let selected = Wa.Wall;
                    if (false) { }
                    // Straight wall, wall at both sides, facing ground
                    else if (EE === Wa.Wall && WW === Wa.Wall && SS === Wa.Ground) { selected = Wa.North; }
                    else if (EE === Wa.Wall && WW === Wa.Wall && NN === Wa.Ground) { selected = Wa.South; }
                    else if (NN === Wa.Wall && SS === Wa.Wall && WW === Wa.Ground) { selected = Wa.East; }
                    else if (NN === Wa.Wall && SS === Wa.Wall && EE === Wa.Ground) { selected = Wa.West; }
                    // Straight outer wall with hole
                    else if (NN == Wa.Void && SS == Wa.Ground) { selected = Wa.North; }
                    else if (SS == Wa.Void && NN == Wa.Ground) { selected = Wa.South; }
                    else if (EE == Wa.Void && WW == Wa.Ground) { selected = Wa.East; }
                    else if (WW == Wa.Void && EE == Wa.Ground) { selected = Wa.West; }
                    // // Outer corner
                    // else if (EE === Wa.Wall && SS === Wa.Wall && NN !== Wa.Wall && WW !== Wa.Wall) { selected = Wa.NorthWest; }
                    // else if (WW === Wa.Wall && SS === Wa.Wall && NN !== Wa.Wall && EE !== Wa.Wall) { selected = Wa.NorthEast; }
                    // else if (WW === Wa.Wall && NN === Wa.Wall && SS !== Wa.Wall && EE !== Wa.Wall) { selected = Wa.SouthWest; }
                    // else if (EE === Wa.Wall && NN === Wa.Wall && SS !== Wa.Wall && WW !== Wa.Wall) { selected = Wa.SouthEast; }
                    // Outer corner, order is important to match lonely walls
                    else if (WW === Wa.Wall && SS === Wa.Wall && SW === Wa.Ground) { selected = Wa.NorthEast; }
                    else if (EE === Wa.Wall && SS === Wa.Wall && SE === Wa.Ground) { selected = Wa.NorthWest; }
                    else if (WW === Wa.Wall && NN === Wa.Wall && NW === Wa.Ground) { selected = Wa.SouthEast; }
                    else if (EE === Wa.Wall && NN === Wa.Wall && NE === Wa.Ground) { selected = Wa.SouthWest; }
                    // Inner corner
                    else if (EE === Wa.Wall && SS === Wa.Wall && NN === Wa.Ground && WW === Wa.Ground && NW === Wa.Ground) { selected = Wa.InnerNorthWest; }
                    else if (WW === Wa.Wall && SS === Wa.Wall && NN === Wa.Ground && EE === Wa.Ground && NE === Wa.Ground) { selected = Wa.InnerNorthEast; }
                    else if (EE === Wa.Wall && NN === Wa.Wall && SS === Wa.Ground && WW === Wa.Ground && SW === Wa.Ground) { selected = Wa.InnerSouthWest; }
                    else if (WW === Wa.Wall && NN === Wa.Wall && SS === Wa.Ground && EE === Wa.Ground && SE === Wa.Ground) { selected = Wa.InnerSouthEast; }
                    // Lonely wall ending,
                    else if (NN === Wa.Ground && SS === Wa.Wall) { selected = Wa.East; }
                    else if (SS === Wa.Ground && NN === Wa.Wall) { selected = Wa.East; }
                    else if (EE === Wa.Ground && WW === Wa.Wall) { selected = Wa.North; }
                    else if (WW === Wa.Ground && EE === Wa.Wall) { selected = Wa.North; }
                    // Lonely single wall
                    else if (NN === Wa.Ground && EE === Wa.Ground && SS === Wa.Ground && WW === Wa.Ground) { selected = Wa.North; }
                    // // T junction
                    // else if (WW === Wa.Wall && EE === Wa.Wall && SS === Wa.Wall) { selected = Wa.North; }
                    // else if (NN === Wa.Wall && SS === Wa.Wall && WW === Wa.Wall) { selected = Wa.North; }
                    else { }
                    result[y][x] = selected;
                    // tileMap.setTileAt(x-1, y-1, repIndex);
                }
            }
        }
        // Fix errors:
        map = result;
        let n = 0;
        let N = 0;
        let nP = 0;
        while (true) {
            // if (tileset === Tileset.Green) { break; }
            // break;
            let is_error_free = true;
            n += 1;
            let postponedX: number[] = [];
            let postponedY: number[] = [];
            for (let y = 1; y < height + 1; ++y) {
                for (let x = 1; x < width + 1; ++x) {
                    N += 1
                    let current = map[y][x];
                    let NW = map[y-1][x-1];
                    let NN = map[y-1][x+0];
                    let NE = map[y-1][x+1];
                    let WW = map[y+0][x-1];
                    let EE = map[y+0][x+1];
                    let SW = map[y+1][x-1];
                    let SS = map[y+1][x+0];
                    let SE = map[y+1][x+1];

                    let replacement = current;
                    if (current === Wa.Void) { continue; } // Skip
                    else if (current === Wa.Ground) { continue; } // Skip
                    else if (current == Wa.North) { if (EE == Wa.North && WW == Wa.North && SS == Wa.East ) { replacement = Wa.NorthEast; }
                                                    else if (WW == Wa.North && EE === Wa.Ground && NN == Wa.West) { replacement = Wa.InnerSouthEast}
                                                    else { continue; } }
                    else if (current == Wa.East) { if (NN == Wa.NorthWest) { replacement = Wa.West; }
                                                   else if (NN == Wa.West) { replacement = Wa.West; }
                                                   else if (SS == Wa.West) {postponedX.push(x); postponedY.push(y); continue; } // Postponed case
                                                   else if (WW == Wa.North) { replacement = Wa.NorthEast; } else { continue; }}
                    else if (current == Wa.West) {if (NN == Wa.East && SS == Wa.East) { replacement = Wa.East}
                                                  else if (NN == Wa.East && WW == Wa.South && SS == Wa.North) { replacement = Wa.SouthEast; }
                                                  /* */ else if (NN != Wa.West && SS == Wa.East && WW == Wa.North) { replacement = Wa.NorthEast; }
                                                  else if (EE == Wa.North) { replacement = Wa.NorthWest; }
                                                  else if (EE === Wa.South) { replacement = Wa.SouthWest; } // This is not a good rule, but i don't know how to fix it otherwise
                                                  else if (EE === Wa.InnerSouthEast) { replacement = Wa.NorthWest; }
                                                  else if (EE === Wa.InnerNorthEast) { replacement = Wa.SouthWest; }
                                                  else { continue; }}
                    else if (current == Wa.South) {if (EE == Wa.North && WW == Wa.North) { replacement = Wa.North}
                                                   else if (SS == Wa.West && EE == Wa.North) { replacement = Wa.NorthWest; }
                                                   else if (SS == Wa.East && WW == Wa.North) { replacement = Wa.NorthEast; }
                                                   else if (SS == Wa.InnerSouthEast && EE == Wa.North) { replacement = Wa.NorthWest; }
                                                   else if (SS == Wa.InnerSouthWest && WW == Wa.North) { replacement = Wa.NorthEast; }
                                                   else { continue; }}
                    else if (current == Wa.NorthWest) { if ((EE == Wa.South || EE == Wa.SouthEast) && (SS == Wa.South || SS == Wa.SouthEast)) {postponedX.push(x); postponedY.push(y); continue} else { continue ;}}
                    else if (current == Wa.NorthEast) { if ((WW == Wa.South || WW == Wa.SouthWest) && (SS == Wa.South || SS == Wa.SouthWest)) {postponedX.push(x); postponedY.push(y); continue}
                                                        else  if (SS == Wa.West) { replacement = Wa.West; } else { continue; }}
                    else if (current == Wa.SouthWest) { if ((EE == Wa.North || EE == Wa.NorthEast) && (/*NN == Wa.North*/ NN == Wa.East || NN == Wa.NorthEast)) {replacement = Wa.InnerSouthWest; }
                                                        else if ((EE == Wa.North || EE == Wa.NorthEast) && NN == Wa.West) { postponedX.push(x); postponedY.push(y); continue; }
                                                        else if (EE == Wa.South && NN == Wa.NorthEast) { replacement = Wa.East; }
                                                        else if (EE == Wa.North && NN == Wa.East) { replacement = Wa.InnerSouthWest; }
                                                        else if (EE == Wa.North) { replacement = Wa.North; }
                                                        else {continue; }}
                    else if (current == Wa.SouthEast) { if ((WW == Wa.North || WW == Wa.NorthWest) && (NN == Wa.North || NN == Wa.NorthWest)) {replacement = Wa.InnerSouthEast; }
                                                        else if ((WW == Wa.North || WW == Wa.NorthWest) && NN == Wa.East) { postponedX.push(x); postponedY.push(y); continue;}
                                                        else if (WW == Wa.South && NN == Wa.NorthWest) { replacement = Wa.West; }
                                                        else if (WW == Wa.North) { replacement = Wa.North; }
                                                        else if (NN == Wa.West) { replacement = Wa.SouthWest; } else {continue; }}
                    // else if (current == Wa.InnerNorthWest) {}
                    // else if (current == Wa.InnerNorthEast) {}
                    // else if (current == Wa.InnerSouthWest) {}
                    // else if (current == Wa.InnerSouthEast) {}
                    else { continue; }
                    map[y][x] = replacement;
                    y -= 1;
                    x -= 2; // Go back 1 and also counteract loop moving forward;
                    is_error_free = false;
                }
            }
            // Perform postponed case if no other work left.
            // In theory there could be multiple postponed cases,
            // to ensure that everything is fine we do a round more by setting is_error_free = false
            if (is_error_free && postponedX.length > 0) {
                console.log(`n ${n} N ${N} nP ${nP}`);
                nP += 1;
                is_error_free = false;
                let postpostponedX = [];
                let postpostponedY = [];
                while (postponedX.length > 0) {
                    let x = postponedX.pop();
                    let y = postponedY.pop();
                    let current = map[y][x];
                    let NW = map[y-1][x-1];
                    let NN = map[y-1][x+0];
                    let NE = map[y-1][x+1];
                    let WW = map[y+0][x-1];
                    let EE = map[y+0][x+1];
                    let SW = map[y+1][x-1];
                    let SS = map[y+1][x+0];
                    let SE = map[y+1][x+1];

                    if (false) {
                    } else if (current == Wa.East && SS == Wa.West) {
                        map[y][x] = Wa.West;
                        postponedX.push(x);
                        postponedY.push(y-1);
                    } else if (current == Wa.NorthWest && (EE == Wa.South || EE == Wa.SouthEast) && (SS == Wa.South || SS == Wa.SouthEast)) {
                        map[y][x] = Wa.InnerNorthWest;
                    } else if (current == Wa.NorthEast && (WW == Wa.South || WW == Wa.SouthWest) && (SS == Wa.South || SS == Wa.SouthWest)) {
                        map[y][x] = Wa.InnerNorthEast;
                    } else {
                        postpostponedX.push(x);
                        postpostponedY.push(y);
                    }
                }

                while (postpostponedX.length > 0) {
                    let x = postpostponedX.pop();
                    let y = postpostponedY.pop();
                    let current = map[y][x];
                    let NW = map[y-1][x-1];
                    let NN = map[y-1][x+0];
                    let NE = map[y-1][x+1];
                    let WW = map[y+0][x-1];
                    let EE = map[y+0][x+1];
                    let SW = map[y+1][x-1];
                    let SS = map[y+1][x+0];
                    let SE = map[y+1][x+1];

                    if (false) {
                    } else if (current == Wa.SouthWest && (EE == Wa.North || EE == Wa.NorthEast) && NN == Wa.West) {
                        map[y][x] = Wa.North;
                    } else if (current == Wa.SouthEast && (WW == Wa.North || WW == Wa.NorthWest) && NN == Wa.East) {
                        map[y][x] = Wa.North;
                    }
                }
            }
            if (is_error_free) { break; }
        }
        // console.log(width * height);
        console.log(`n ${n} N ${N} nP ${nP}`);


        // Calculate alternative tiles
        // 3 + 3 + 3 = 9
        // 012 345 678
        // 3 + 0 + 3 = 6
        let normal_threshold = normal;
        let broken_threshold = normal + broken;
        let torches_threshold = normal + broken + torches;
        let randomMax = torches_threshold - 1;
        for (let y = 1; y < height + 1; ++y) {
            for (let x = 1; x < width + 1; ++x) {
                let current = map[y][x];
                if (current === Wa.North || current === Wa.South || current === Wa.West || current === Wa.East) {
                    let r = randint(0, randomMax);
                    if (r < normal_threshold) {
                        current += 0;
                    } else if (r < broken_threshold) {
                        current += 12;
                    } else if (r < torches_threshold) {
                        current += 16;
                    } else {
                        console.log("imposible");
                        control.panic(800);
                    }
                    map[y][x] = current;
                }
            }
        }

        // Render tiles
        for (let y = 1; y < height + 1; ++y) {
            for (let x = 1; x < width + 1; ++x) {
                let index = tilesetIndexes[result[y][x]];
                if (index !== null) {
                    scene.tileMap.setTileAt(x - 1, y - 1, index);
                }
            }
        }
        // Add walls
        if (wall === AddWall.Yes) {
            for (let y = 1; y < height + 1; ++y) {
                for (let x = 1; x < width + 1; ++x) {
                    if (premap[y][x] === Wa.Wall) {
                        scene.tileMap.setWallAt(x - 1, y - 1, true);
                    }
                }
            }
        }
    }



    enum Fl {
        Void,
        Room,
        Wide, // Wide hallway
        Narrow, // Narrow corridor
        Door,
    }
    const tilesetFloor = [
        null,
        sprites.dungeon.floorLight0,
        sprites.dungeon.floorDark2,
        sprites.dungeon.floorDark0,
        // sprites.dungeon.floorMixed,
        // sprites.dungeon.floorMixed,
        sprites.dungeon.doorOpenNorth,

    ]

    let _scene: scene.Scene;
    let _map: Fl[][];

    /**
     * Autotile dungeon.floor
     */
    //% blockId=kn_autotile_autotileFloor
    //% block="Autotile floor $tile=tileset_tile_picker"
    //% group="KNAutotile"
    //% weight=100
    export function autotile_floors(tile: Image) {
        const scene = game.currentScene();
        if (!tile || !scene.tileMap || !scene.tileMap.enabled) return;
        // images are stored as an Index in a tilemap table
        const tileIndex = scene.tileMap.getImageType(tile);
        const width = scene.tileMap.areaWidth() >> scene.tileMap.scale;
        const height = scene.tileMap.areaHeight() >> scene.tileMap.scale;
        let tilesetIndexes = [];
        for (let image of tilesetFloor) {
            if (image === null) {
                tilesetIndexes.push(null);
            } else {
                tilesetIndexes.push(scene.tileMap.getImageType(image));
            }
        }

        // Setup boolean floor map
        const floor: boolean[][] = []
        let row = [];
        for (let x = 0; x < width; ++x) {
            row.push(false);
        }
        floor.push(row)
        floor.push(row)
        for (let y = 0; y < height; ++y) {
            let row = [];
            row.push(false)
            row.push(false)
            for (let x = 0; x < width; ++x) {
                let current = scene.tileMap.getTileIndex(x, y);
                row.push(current === tileIndex);
            }
            row.push(false)
            row.push(false)
            floor.push(row);
        }
        for (let x = 0; x < width; ++x) {
            row.push(false);
        }
        floor.push(row);
        floor.push(row);



        let map: number[][] = [];
        for (let y = 0; y < height + 4; ++y) {
            let row_ = []
            for (let x = 0; x < width + 4; ++x) {
                row_.push(Fl.Void);
            }
            map.push(row_);
        }

        // Calculate Narrow floors
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                if (floor[y][x]) {
                    let NW = floor[y-1][x-1];
                    let NN = floor[y-1][x+0];
                    let NE = floor[y-1][x+1];
                    let WW = floor[y+0][x-1];
                    let EE = floor[y+0][x+1];
                    let SW = floor[y+1][x-1];
                    let SS = floor[y+1][x+0];
                    let SE = floor[y+1][x+1];
                    let is_narrow = (
                        false ||
                            // Narrow straight
                            (!NN && !SS) ||
                            (!WW && !EE) ||
                            // Narrow corner
                            (NN && EE && !SS && !WW && !NE) ||
                            (!NN && EE && SS && !WW && !SE) ||
                            (!NN && !EE && SS && WW && !SW) ||
                            (NN && !EE && !SS && WW && !NW) ||
                            // Narrow Dead end
                            (NN && !EE && !SS && !WW) ||
                            (!NN && !EE && SS && !WW) ||
                            (!NN && !EE && !SS && WW) ||
                            // Narrow T
                            (NN && EE && !SS && WW && !NW && !NE) ||  // N
                            (NN && EE && SS && !WW && !NE && !SE) ||  // E
                            (!NN && EE && SS && WW && !SW && !SE) ||  // S
                            (NN && !EE && SS && WW && !SW && !NW) ||  // W
                            // Narrow cross
                            (NN && EE && SS && WW && !NW && !NE && !SW && !SE) ||
                            false
                    );
                    if (is_narrow) {
                        map[y][x] = Fl.Narrow;
                        floor[y][x] = false;
                    }
                }
            }
        }

        // Calculate Wide floors
        while (true) {
            let is_done = true;
            for (let y = 2; y < height + 2; ++y) {
                for (let x = 2; x < width + 2; ++x) {
                    if (floor[y][x]) {
                        let NN = floor[y-1][x+0];
                        let WW = floor[y+0][x-1];
                        let EE = floor[y+0][x+1];
                        let SS = floor[y+1][x+0];
                        let NNN = floor[y-2][x+0];
                        let WWW = floor[y+0][x-2];
                        let EEE = floor[y+0][x+2];
                        let SSS = floor[y+2][x+0];

                        let is_wide = (
                            false ||
                                (!NN && !SS) ||
                                (!WW && !EE) ||
                                (!NN && SS && !SSS) ||
                                (!WW && EE && !EEE) ||
                                false
                        );
                        if (is_wide) {
                            map[y][x] = Fl.Wide;
                            floor[y][x] = false;
                            is_done = false;
                        }
                    }
                }
            }
            if (is_done) { break; }
        }

        // Calculate rooms
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                if (floor[y][x]) {
                    map[y][x] = Fl.Room;
                }
            }
        }

        // Calculate doors
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                if (map[y][x] == Fl.Narrow) {
                    let NN = map[y-1][x+0];
                    let WW = map[y+0][x-1];
                    let EE = map[y+0][x+1];
                    let SS = map[y+1][x+0];

                    // dont put two doors next to each other.
                    if (NN === Fl.Door || NN == Fl.Door) {
                        continue;
                    }

                    if ((NN === Fl.Room && SS !== Fl.Void) ||
                        (SS === Fl.Room && NN !== Fl.Void) ||
                        (WW === Fl.Room && EE !== Fl.Void) ||
                        (EE === Fl.Room && WW !== Fl.Void)) {
                        map[y][x] = Fl.Door;
                    }
                }
            }
        }


        // Render tiles
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                let index = tilesetIndexes[map[y][x]];
                if (index !== null) {
                    scene.tileMap.setTileAt(x - 2, y - 2, index);
                }
            }
        }
        _scene = scene;
        _map = map;
    }

    const floorTiles = [
        // LightSmall
        sprites.dungeon.floorLight0, /* 0 */
        sprites.dungeon.floorLight4, /* 1 */
        sprites.dungeon.floorLight1, /* 2 */
        sprites.dungeon.floorLightMoss, /* 3 */
        sprites.dungeon.floorLight3, /* 4 */
        // LightLarge
        sprites.dungeon.floorLight2, /* 5 */
        sprites.dungeon.floorLight5, /* 6 */
        // DarkSmall
        sprites.dungeon.floorDark0, /* 7 */
        sprites.dungeon.floorDark4, /* 8 */
        sprites.dungeon.floorDark1, /* 9 */
        sprites.dungeon.floorDark3, /* 10 */
        // DarkLarge
        sprites.dungeon.floorDark2, /* 11 */
        sprites.dungeon.floorDarkDiamond, /* 12 */
        sprites.dungeon.floorDark5, /* 13 */
        // MixedSmall
        sprites.dungeon.floorMixed, /* 14 */
    ]
    const _floorTiles = {
        "LightSmall": [0, 1, 2, 3, 4],
        "LightLarge": [5, 6],
        "DarkSmall": [7, 8, 9, 10],
        "DarkLarge": [11, 12, 13],
        "MixedSmall": [14, 14], // All lists must include at least 2 elements, so just duplicate it.
    }
    class PatternSelector {
        private tileIndexes: number[];
        private left: number[];
        private right: number[];
        private leftThresholds: number[];
        private rightThresholds: number[];

        constructor(floor: Fl, dirtyPercentage: number, tileIndexes: number[]) {
            this.tileIndexes = tileIndexes;

            let left: number[];
            let right: number[] = null;

            if (floor === Fl.Narrow) {
                switch (randint(0, 5)) {
                    case 0:
                    case 1:
                    case 2: left = _floorTiles["DarkSmall"]; break;
                    case 3: left = _floorTiles["LightSmall"]; break;
                    case 4: left = _floorTiles["DarkLarge"]; break;
                    case 5: left = _floorTiles["MixedSmall"]; break;
                }
            } else if (floor === Fl.Wide) {
                switch (randint(0, 5)) {
                    case 0: left = _floorTiles["DarkSmall"]; break;
                    case 1: left = _floorTiles["LightSmall"]; break;
                    case 2: left = _floorTiles["MixedSmall"]; break;
                    case 3: left = _floorTiles["LightLarge"]; break;
                    case 4: left = _floorTiles["DarkLarge"]; break;
                    case 5: left = _floorTiles["LightSmall"]; right = _floorTiles["DarkSmall"]; break;
                }
            } else if (floor === Fl.Door) {
                switch (randint(0, 1)) {
                    case 0: left = _floorTiles["DarkSmall"]; break;
                    case 1: left = _floorTiles["DarkLarge"]; break;
                }
            } else if (floor === Fl.Room) {
                if (randint(0, 3) == 0) { // single type
                    // switch (randint(0, 9)) {
                    //     case 0: left = _floorTiles["DarkSmall"]; break;
                    //     case 1:
                    //     case 2: left = _floorTiles["LightSmall"]; break;
                    //     case 3:
                    //     case 4: left = _floorTiles["LightLarge"]; break;
                    //     case 5:
                    //     case 6: left = _floorTiles["DarkLarge"]; break;
                    //     case 7:
                    //     case 8:
                    //     case 9: left = _floorTiles["MixedSmall"]; break;
                    // }
                    switch (randint(0, 2)) {
                        case 0: left = _floorTiles["LightLarge"]; break;
                        case 1:
                        case 2: left = _floorTiles["DarkLarge"]; break;
                        // case 3:
                        // case 4:
                        // case 5: left = _floorTiles["MixedSmall"]; break;
                    }
                } else if (randint(0, 2) == 0) {
                    left = _floorTiles["MixedSmall"];
                    switch (randint(0, 3)) {
                        case 0: right = _floorTiles["LightSmall"]; break;
                        case 1: right = _floorTiles["LightLarge"]; break;
                        case 2: right = _floorTiles["DarkSmall"]; break;
                        case 3: right = _floorTiles["DarkLarge"]; break;
                    }
                } else {
                    switch (randint(0, 3)) {
                        case 0: left = _floorTiles["LightSmall"]; right = _floorTiles["LightLarge"]; break;
                        case 1: left = _floorTiles["LightSmall"]; right = _floorTiles["DarkLarge"]; break;
                        case 2: left = _floorTiles["DarkSmall"]; right = _floorTiles["LightLarge"]; break;
                        case 3: left = _floorTiles["DarkSmall"]; right = _floorTiles["DarkLarge"]; break;
                    }
                }
            }
            this.leftThresholds = this._calculateThresholds(floor, dirtyPercentage, left);
            if (right === null) {
                right = left;
                this.rightThresholds = this.leftThresholds

            } else {
                this.rightThresholds = this._calculateThresholds(floor, dirtyPercentage, right);
            }
            this.left = left;
            this.right = right;
        }
        private _calculateThresholds(floor: Fl, dirtyPercentage: number, tiles: number[]): number[] {
            let thresholds = [];
            if (dirtyPercentage > 100) {
                dirtyPercentage = 100;
            } else if (dirtyPercentage < 0) {
                dirtyPercentage = 0;
            }
            let cleanPercentage = 100 - dirtyPercentage;
            thresholds.push(cleanPercentage);
            for (let n = tiles.length - 1; n > 0; n -= 1) {
                thresholds.push(100 / n);
            }
            return thresholds;
        }
        public checkerboard(shift: boolean): number {
            let tiles = shift ? this.right : this.left;
            let thresholds = shift ? this.rightThresholds : this.leftThresholds;
            let r = randint(0, 100-1);
            if (r < thresholds[0]) {
                return this.tileIndexes[tiles[0]];
            }
            r = randint(0, 100-1);
            let n = 1;
            while (true) {
                // r = randint(0, 100-1);
                if (r < thresholds[n]) {
                    return this.tileIndexes[tiles[n]]
                }
                n += 1;
            }
        }
    }

    /**
     * Redecorate dungeon.floor
     * @param dirtyPercentage how many dirty / broken tiles should there be? eg: 50
     */
    //% blockId=kn_autotile_autotileRedecorate
    //% block="Redecorate floor %dirtyPercentage"
    //% group="KNAutotile"
    //% weight=100
    export function autotileRedecorate(dirtyPercentage: number) {
        // let dirtyPercentage = 50;
        const scene = game.currentScene();
        if (scene !== _scene) {
            return;
        }
        if (!scene.tileMap || !scene.tileMap.enabled) { return; }
        // images are stored as an Index in a tilemap table
        const voidIndex = scene.tileMap.getImageType(assets.tile`transparency16`);
        const width = scene.tileMap.areaWidth() >> scene.tileMap.scale;
        const height = scene.tileMap.areaHeight() >> scene.tileMap.scale;
        let map = _map;

        let result: number[][] = [];
        for (let y = 0; y < height + 4; ++y) {
            let row = []
            for (let x = 0; x < width + 4; ++x) {
                row.push(voidIndex);
            }
            result.push(row);
        }


        let tileIndexes = []
        for (let tile of floorTiles) {
            tileIndexes.push(scene.tileMap.getImageType(tile))
        }

        // Fill floor sections
        const patternShift = randint(0, 1); // Whether to shift all checkerboard patterns by one
        const fullWidth = width + 4
        let n = 0;
        let N = 0
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                if (result[y][x] !== voidIndex) { continue; }
                let filling = map[y][x];
                if (filling === Fl.Void) { continue; }
                let selectedDirtyPercentage = randint(0, dirtyPercentage);
                let pattern = new PatternSelector(filling, selectedDirtyPercentage, tileIndexes);
                // Floodfill:
                let stack = [x + y * fullWidth];
                n += 1;
                while (stack.length > 0) {
                    N += 1
                    let coordinate = stack.pop();
                    let currentX = coordinate % fullWidth;
                    let currentY = (coordinate / fullWidth) >> 0; // Shift to floor
                    if (result[currentY][currentX] !== voidIndex) { continue; }
                    if (map[currentY][currentX] !== filling) { continue; }
                    stack.push((currentX+0) + (currentY-1) * fullWidth); // North
                    stack.push((currentX-1) + (currentY+0) * fullWidth); // West
                    stack.push((currentX+1) + (currentY+0) * fullWidth); // East
                    stack.push((currentX+0) + (currentY+1) * fullWidth); // South
                    let shift = ((patternShift + currentX + (currentY % 2)) % 2) == 1;
                    result[currentY][currentX] = pattern.checkerboard(shift)
                }
            }
        }
        // console.log(`n ${n} N ${N}`);

        // Render tiles
        for (let y = 2; y < height + 2; ++y) {
            for (let x = 2; x < width + 2; ++x) {
                let index = result[y][x];
                if (index !== voidIndex) {
                    scene.tileMap.setTileAt(x - 2, y - 2, index);

                }
            }
        }
    }
}
