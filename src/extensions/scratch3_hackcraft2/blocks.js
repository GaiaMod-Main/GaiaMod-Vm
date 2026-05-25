const buildingBlockOptions =[

    {text: 'オークの木', value: 'oak_wood'},
    
    {text: '樹皮を剥いだオークの原木', value: 'stripped_oak_log'},
    
    {text: '樹皮を剥いだオークの木', value: 'stripped_oak_wood'},
    
    {text: 'オークの板材', value: 'oak_planks'},
    
    {text: 'オークの階段', value: 'oak_stairs'},
    
    {text: 'オークのハーフブロック', value: 'oak_slab'},
    
    {text: 'オークのフェンス', value: 'oak_fence'},
    
    {text: 'オークのフェンスゲート', value: 'oak_fence_gate'},
    
    {text: 'オークのドア', value: 'oak_door'},
    
    {text: 'オークのトラップドア', value: 'oak_trapdoor'},
    
    {text: 'トウヒの木', value: 'spruce_wood'},
    
    {text: '樹皮を剥いだトウヒの原木', value: 'stripped_spruce_log'},
    
    {text: '樹皮を剥いだトウヒの木', value: 'stripped_spruce_wood'},
    
    {text: 'トウヒの板材', value: 'spruce_planks'},
    
    {text: 'トウヒの階段', value: 'spruce_stairs'},
    
    {text: 'トウヒのハーフブロック', value: 'spruce_slab'},
    
    {text: 'トウヒのフェンス', value: 'spruce_fence'},
    
    {text: 'トウヒのフェンスゲート', value: 'spruce_fence_gate'},
    
    {text: 'トウヒのドア', value: 'spruce_door'},
    
    {text: 'トウヒのトラップドア', value: 'spruce_trapdoor'},
    
    {text: 'トウヒの感圧板', value: 'spruce_pressure_plate'},
    
    {text: 'トウヒのボタン', value: 'spruce_button'},
    
    {text: 'シラカバの木', value: 'birch_wood'},
    
    {text: '樹皮を剥いだシラカバの原木', value: 'stripped_birch_log'},
    
    {text: '樹皮を剥いだシラカバの木', value: 'stripped_birch_wood'},
    
    {text: 'シラカバの板材', value: 'birch_planks'},
    
    {text: 'シラカバの階段', value: 'birch_stairs'},
    
    {text: 'シラカバのハーフブロック', value: 'birch_slab'},
    
    {text: 'シラカバのフェンス', value: 'birch_fence'},
    
    {text: 'シラカバのフェンスゲート', value: 'birch_fence_gate'},
    
    {text: 'シラカバのドア', value: 'birch_door'},
    
    {text: 'シラカバのトラップドア', value: 'birch_trapdoor'},
    
    {text: 'シラカバの感圧板', value: 'birch_pressure_plate'},
    
    {text: 'シラカバのボタン', value: 'birch_button'},
    
    {text: 'ジャングルの木', value: 'jungle_wood'},
    
    {text: '樹皮を剥いだジャングルの原木', value: 'stripped_jungle_log'},
    
    {text: '樹皮を剥いだジャングルの木', value: 'stripped_jungle_wood'},
    
    {text: 'ジャングルの板材', value: 'jungle_planks'},
    
    {text: 'ジャングルの階段', value: 'jungle_stairs'},
    
    {text: 'ジャングルのハーフブロック', value: 'jungle_slab'},
    
    {text: 'ジャングルのフェンス', value: 'jungle_fence'},
    
    {text: 'ジャングルのフェンスゲート', value: 'jungle_fence_gate'},
    
    {text: 'ジャングルのドア', value: 'jungle_door'},
    
    {text: 'ジャングルのトラップドア', value: 'jungle_trapdoor'},
    
    {text: 'ジャングルの感圧板', value: 'jungle_pressure_plate'},
    
    {text: 'ジャングルのボタン', value: 'jungle_button'},
    
    {text: 'アカシアの木', value: 'acacia_wood'},
    
    {text: '樹皮を剥いだアカシアの原木', value: 'stripped_acacia_log'},
    
    {text: '樹皮を剥いだアカシアの木', value: 'stripped_acacia_wood'},
    
    {text: 'アカシアの板材', value: 'acacia_planks'},
    
    {text: 'アカシアの階段', value: 'acacia_stairs'},
    
    {text: 'アカシアのハーフブロック', value: 'acacia_slab'},
    
    {text: 'アカシアのフェンス', value: 'acacia_fence'},
    
    {text: 'アカシアのフェンスゲート', value: 'acacia_fence_gate'},
    
    {text: 'アカシアのドア', value: 'acacia_door'},
    
    {text: 'アカシアのトラップドア', value: 'acacia_trapdoor'},
    
    {text: 'アカシアの感圧板', value: 'acacia_pressure_plate'},
    
    {text: 'アカシアのボタン', value: 'acacia_button'},
    
    {text: 'ダークオークの木', value: 'dark_oak_wood'},
    
    {text: '樹皮を剥いだダークオークの原木', value: 'stripped_dark_oak_log'},
    
    {text: '樹皮を剥いだダークオークの木', value: 'stripped_dark_oak_wood'},
    
    {text: 'ダークオークの板材', value: 'dark_oak_planks'},
    
    {text: 'ダークオークの階段', value: 'dark_oak_stairs'},
    
    {text: 'ダークオークのハーフブロック', value: 'dark_oak_slab'},
    
    {text: 'ダークオークのフェンス', value: 'dark_oak_fence'},
    
    {text: 'ダークオークのフェンスゲート', value: 'dark_oak_fence_gate'},
    
    {text: 'ダークオークのドア', value: 'dark_oak_door'},
    
    {text: 'ダークオークのトラップドア', value: 'dark_oak_trapdoor'},
    
    {text: 'ダークオークの感圧板', value: 'dark_oak_pressure_plate'},
    
    {text: 'ダークオークのボタン', value: 'dark_oak_button'},
    
    {text: 'マングローブの木', value: 'mangrove_wood'},
    
    {text: '樹皮を剥いだマングローブの原木', value: 'stripped_mangrove_log'},
    
    {text: '樹皮を剥いだマングローブの木', value: 'stripped_mangrove_wood'},
    
    {text: 'マングローブの板材', value: 'mangrove_planks'},
    
    {text: 'マングローブの階段', value: 'mangrove_stairs'},
    
    {text: 'マングローブのハーフブロック', value: 'mangrove_slab'},
    
    {text: 'マングローブのフェンス', value: 'mangrove_fence'},
    
    {text: 'マングローブのフェンスゲート', value: 'mangrove_fence_gate'},
    
    {text: 'マングローブのドア', value: 'mangrove_door'},
    
    {text: 'マングローブのトラップドア', value: 'mangrove_trapdoor'},
    
    {text: 'マングローブの感圧板', value: 'mangrove_pressure_plate'},
    
    {text: 'マングローブのボタン', value: 'mangrove_button'},
    
    {text: 'サクラの木', value: 'cherry_wood'},
    
    {text: '樹皮を剥いだサクラの原木', value: 'stripped_cherry_log'},
    
    {text: '樹皮を剥いだサクラの木', value: 'stripped_cherry_wood'},
    
    {text: 'サクラの板材', value: 'cherry_planks'},
    
    {text: 'サクラの階段', value: 'cherry_stairs'},
    
    {text: 'サクラのハーフブロック', value: 'cherry_slab'},
    
    {text: 'サクラのフェンス', value: 'cherry_fence'},
    
    {text: 'サクラのフェンスゲート', value: 'cherry_fence_gate'},
    
    {text: 'サクラのドア', value: 'cherry_door'},
    
    {text: 'サクラのトラップドア', value: 'cherry_trapdoor'},
    
    {text: 'サクラの感圧板', value: 'cherry_pressure_plate'},
    
    {text: 'サクラのボタン', value: 'cherry_button'},
    
    {text: '竹ブロック', value: 'bamboo_block'},
    
    {text: '表皮を剥いだ竹ブロック', value: 'stripped_bamboo_block'},
    
    {text: '竹の板材', value: 'bamboo_planks'},
    
    {text: '竹細工', value: 'bamboo_mosaic'},
    
    {text: '竹の階段', value: 'bamboo_stairs'},
    
    {text: '竹細工の階段', value: 'bamboo_mosaic_stairs'},
    
    {text: '竹のハーフブロック', value: 'bamboo_slab'},
    
    {text: '竹細工のハーフブロック', value: 'bamboo_mosaic_slab'},
    
    {text: '竹のフェンス', value: 'bamboo_fence'},
    
    {text: '竹のフェンスゲート', value: 'bamboo_fence_gate'},
    
    {text: '竹のドア', value: 'bamboo_door'},
    
    {text: '竹のトラップドア', value: 'bamboo_trapdoor'},
    
    {text: '竹の感圧板', value: 'bamboo_pressure_plate'},
    
    {text: '竹のボタン', value: 'bamboo_button'},
    
    {text: '真紅の菌糸', value: 'crimson_hyphae'},
    
    {text: '表皮を剥いだ真紅の幹', value: 'stripped_crimson_stem'},
    
    {text: '表皮を剥いだ真紅の菌糸', value: 'stripped_crimson_hyphae'},
    
    {text: '真紅の板材', value: 'crimson_planks'},
    
    {text: '真紅の階段', value: 'crimson_stairs'},
    
    {text: '真紅のハーフブロック', value: 'crimson_slab'},
    
    {text: '真紅のフェンス', value: 'crimson_fence'},
    
    {text: '真紅のフェンスゲート', value: 'crimson_fence_gate'},
    
    {text: '真紅のドア', value: 'crimson_door'},
    
    {text: '真紅のトラップドア', value: 'crimson_trapdoor'},
    
    {text: '真紅の感圧板', value: 'crimson_pressure_plate'},
    
    {text: '真紅のボタン', value: 'crimson_button'},
    
    {text: '歪んだ菌糸', value: 'warped_hyphae'},
    
    {text: '表皮を剥いだ歪んだ幹', value: 'stripped_warped_stem'},
    
    {text: '表皮を剥いだ歪んだ菌糸', value: 'stripped_warped_hyphae'},
    
    {text: '歪んだ板材', value: 'warped_planks'},
    
    {text: '歪んだ階段', value: 'warped_stairs'},
    
    {text: '歪んだハーフブロック', value: 'warped_slab'},
    
    {text: '歪んだフェンス', value: 'warped_fence'},
    
    {text: '歪んだフェンスゲート', value: 'warped_fence_gate'},
    
    {text: '歪んだドア', value: 'warped_door'},
    
    {text: '歪んだトラップドア', value: 'warped_trapdoor'},
    
    {text: '歪んだ感圧板', value: 'warped_pressure_plate'},
    
    {text: '歪んだボタン', value: 'warped_button'},
    
    {text: '石の階段', value: 'stone_stairs'},
    
    {text: '石のハーフブロック', value: 'stone_slab'},
    
    {text: '丸石', value: 'cobblestone'},
    
    {text: '丸石の階段', value: 'cobblestone_stairs'},
    
    {text: '丸石のハーフブロック', value: 'cobblestone_slab'},
    
    {text: '丸石の塀', value: 'cobblestone_wall'},
    
    {text: '苔むした丸石', value: 'mossy_cobblestone'},
    
    {text: '苔むした丸石の階段', value: 'mossy_cobblestone_stairs'},
    
    {text: '苔むした丸石のハーフブロック', value: 'mossy_cobblestone_slab'},
    
    {text: '苔むした丸石の塀', value: 'mossy_cobblestone_wall'},
    
    {text: '滑らかな石', value: 'smooth_stone'},
    
    {text: '滑らかな石のハーフブロック', value: 'smooth_stone_slab'},
    
    {text: '石レンガ', value: 'stone_bricks'},
    
    {text: 'ひび割れた石レンガ', value: 'cracked_stone_bricks'},
    
    {text: '石レンガの階段', value: 'stone_brick_stairs'},
    
    {text: '石レンガのハーフブロック', value: 'stone_brick_slab'},
    
    {text: '石レンガの塀', value: 'stone_brick_wall'},
    
    {text: '模様入りの石レンガ', value: 'chiseled_stone_bricks'},
    
    {text: '苔むした石レンガ', value: 'mossy_stone_bricks'},
    
    {text: '苔むした石レンガの階段', value: 'mossy_stone_brick_stairs'},
    
    {text: '苔むした石レンガのハーフブロック', value: 'mossy_stone_brick_slab'},
    
    {text: '苔むした石レンガの塀', value: 'mossy_stone_brick_wall'},
    
    {text: '花崗岩の階段', value: 'granite_stairs'},
    
    {text: '花崗岩のハーフブロック', value: 'granite_slab'},
    
    {text: '花崗岩の塀', value: 'granite_wall'},
    
    {text: '磨かれた花崗岩', value: 'polished_granite'},
    
    {text: '磨かれた花崗岩の階段', value: 'polished_granite_stairs'},
    
    {text: '磨かれた花崗岩のハーフブロック', value: 'polished_granite_slab'},
    
    {text: '閃緑岩の階段', value: 'diorite_stairs'},
    
    {text: '閃緑岩のハーフブロック', value: 'diorite_slab'},
    
    {text: '閃緑岩の塀', value: 'diorite_wall'},
    
    {text: '磨かれた閃緑岩', value: 'polished_diorite'},
    
    {text: '磨かれた閃緑岩の階段', value: 'polished_diorite_stairs'},
    
    {text: '磨かれた閃緑岩のハーフブロック', value: 'polished_diorite_slab'},
    
    {text: '安山岩の階段', value: 'andesite_stairs'},
    
    {text: '安山岩のハーフブロック', value: 'andesite_slab'},
    
    {text: '安山岩の塀', value: 'andesite_wall'},
    
    {text: '磨かれた安山岩', value: 'polished_andesite'},
    
    {text: '磨かれた安山岩の階段', value: 'polished_andesite_stairs'},
    
    {text: '磨かれた安山岩のハーフブロック', value: 'polished_andesite_slab'},
    
    {text: '深層岩の丸石', value: 'cobbled_deepslate'},
    
    {text: '深層岩の丸石の階段', value: 'cobbled_deepslate_stairs'},
    
    {text: '深層岩の丸石のハーフブロック', value: 'cobbled_deepslate_slab'},
    
    {text: '深層岩の丸石の塀', value: 'cobbled_deepslate_wall'},
    
    {text: '模様入りの深層岩', value: 'chiseled_deepslate'},
    
    {text: '磨かれた深層岩', value: 'polished_deepslate'},
    
    {text: '磨かれた深層岩の階段', value: 'polished_deepslate_stairs'},
    
    {text: '磨かれた深層岩のハーフブロック', value: 'polished_deepslate_slab'},
    
    {text: '磨かれた深層岩の塀', value: 'polished_deepslate_wall'},
    
    {text: '深層岩レンガ', value: 'deepslate_bricks'},
    
    {text: 'ひび割れた深層岩レンガ', value: 'cracked_deepslate_bricks'},
    
    {text: '深層岩レンガの階段', value: 'deepslate_brick_stairs'},
    
    {text: '深層岩レンガのハーフブロック', value: 'deepslate_brick_slab'},
    
    {text: '深層岩レンガの塀', value: 'deepslate_brick_wall'},
    
    {text: '深層岩タイル', value: 'deepslate_tiles'},
    
    {text: 'ひび割れた深層岩タイル', value: 'cracked_deepslate_tiles'},
    
    {text: '深層岩タイルの階段', value: 'deepslate_tile_stairs'},
    
    {text: '深層岩タイルのハーフブロック', value: 'deepslate_tile_slab'},
    
    {text: '深層岩タイルの塀', value: 'deepslate_tile_wall'},
    
    {text: '強化された深層岩', value: 'reinforced_deepslate'},
    
    {text: 'レンガブロック', value: 'bricks'},
    
    {text: 'レンガの階段', value: 'brick_stairs'},
    
    {text: 'レンガのハーフブロック', value: 'brick_slab'},
    
    {text: 'レンガの塀', value: 'brick_wall'},
    
    {text: '固めた泥', value: 'packed_mud'},
    
    {text: '泥レンガ', value: 'mud_bricks'},
    
    {text: '泥レンガの階段', value: 'mud_brick_stairs'},
    
    {text: '泥レンガのハーフブロック', value: 'mud_brick_slab'},
    
    {text: '泥レンガの塀', value: 'mud_brick_wall'},
    
    {text: '砂岩の階段', value: 'sandstone_stairs'},
    
    {text: '砂岩のハーフブロック', value: 'sandstone_slab'},
    
    {text: '砂岩の塀', value: 'sandstone_wall'},
    
    {text: '模様入りの砂岩', value: 'chiseled_sandstone'},
    
    {text: '滑らかな砂岩', value: 'smooth_sandstone'},
    
    {text: '滑らかな砂岩の階段', value: 'smooth_sandstone_stairs'},
    
    {text: '滑らかな砂岩のハーフブロック', value: 'smooth_sandstone_slab'},
    
    {text: '研がれた砂岩', value: 'cut_sandstone'},
    
    {text: '研がれた砂岩のハーフブロック', value: 'cut_sandstone_slab'},
    
    {text: '赤い砂岩の階段', value: 'red_sandstone_stairs'},
    
    {text: '赤い砂岩のハーフブロック', value: 'red_sandstone_slab'},
    
    {text: '赤い砂岩の塀', value: 'red_sandstone_wall'},
    
    {text: '模様入りの赤い砂岩', value: 'chiseled_red_sandstone'},
    
    {text: '滑らかな赤い砂岩', value: 'smooth_red_sandstone'},
    
    {text: '滑らかな赤い砂岩の階段', value: 'smooth_red_sandstone_stairs'},
    
    {text: '滑らかな赤い砂岩のハーフブロック', value: 'smooth_red_sandstone_slab'},
    
    {text: '研がれた赤い砂岩', value: 'cut_red_sandstone'},
    
    {text: '研がれた赤い砂岩のハーフブロック', value: 'cut_red_sandstone_slab'},
    
    {text: 'シーランタン', value: 'sea_lantern'},
    
    {text: 'プリズマリンの階段', value: 'prismarine_stairs'},
    
    {text: 'プリズマリンのハーフブロック', value: 'prismarine_slab'},
    
    {text: 'プリズマリンの塀', value: 'prismarine_wall'},
    
    {text: 'プリズマリンレンガ', value: 'prismarine_bricks'},
    
    {text: 'プリズマリンレンガの階段', value: 'prismarine_brick_stairs'},
    
    {text: 'プリズマリンレンガのハーフブロック', value: 'prismarine_brick_slab'},
    
    {text: 'ダークプリズマリン', value: 'dark_prismarine'},
    
    {text: 'ダークプリズマリンの階段', value: 'dark_prismarine_stairs'},
    
    {text: 'ダークプリズマリンのハーフブロック', value: 'dark_prismarine_slab'},
    
    {text: 'ネザーレンガブロック', value: 'nether_bricks'},
    
    {text: 'ひび割れたネザーレンガ', value: 'cracked_nether_bricks'},
    
    {text: 'ネザーレンガの階段', value: 'nether_brick_stairs'},
    
    {text: 'ネザーレンガのハーフブロック', value: 'nether_brick_slab'},
    
    {text: 'ネザーレンガの塀', value: 'nether_brick_wall'},
    
    {text: 'ネザーレンガのフェンス', value: 'nether_brick_fence'},
    
    {text: '模様入りのネザーレンガ', value: 'chiseled_nether_bricks'},
    
    {text: '赤いネザーレンガ', value: 'red_nether_bricks'},
    
    {text: '赤いネザーレンガの階段', value: 'red_nether_brick_stairs'},
    
    {text: '赤いネザーレンガのハーフブロック', value: 'red_nether_brick_slab'},
    
    {text: '赤いネザーレンガの塀', value: 'red_nether_brick_wall'},
    
    {text: '磨かれた玄武岩', value: 'polished_basalt'},
    
    {text: 'きらめくブラックストーン', value: 'gilded_blackstone'},
    
    {text: 'ブラックストーンの階段', value: 'blackstone_stairs'},
    
    {text: 'ブラックストーンのハーフブロック', value: 'blackstone_slab'},
    
    {text: 'ブラックストーンの塀', value: 'blackstone_wall'},
    
    {text: '模様入りの磨かれたブラックストーン', value: 'chiseled_polished_blackstone'},
    
    {text: '磨かれたブラックストーン', value: 'polished_blackstone'},
    
    {text: '磨かれたブラックストーンの階段', value: 'polished_blackstone_stairs'},
    
    {text: '磨かれたブラックストーンのハーフブロック', value: 'polished_blackstone_slab'},
    
    {text: '磨かれたブラックストーンの塀', value: 'polished_blackstone_wall'},
    
    {text: '磨かれたブラックストーンの感圧板', value: 'polished_blackstone_pressure_plate'},
    
    {text: '磨かれたブラックストーンのボタン', value: 'polished_blackstone_button'},
    
    {text: '磨かれたブラックストーンレンガ', value: 'polished_blackstone_bricks'},
    
    {text: 'ひび割れたブラックストーンレンガ', value: 'cracked_polished_blackstone_bricks'},
    
    {text: '磨かれたブラックストーンレンガの階段', value: 'polished_blackstone_brick_stairs'},
    
    {text: '磨かれたブラックストーンレンガのハーフブロック', value: 'polished_blackstone_brick_slab'},
    
    {text: '磨かれたブラックストーンレンガの塀', value: 'polished_blackstone_brick_wall'},
    
    {text: 'エンドストーンレンガ', value: 'end_stone_bricks'},
    
    {text: 'エンドストーンレンガの階段', value: 'end_stone_brick_stairs'},
    
    {text: 'エンドストーンレンガのハーフブロック', value: 'end_stone_brick_slab'},
    
    {text: 'エンドストーンレンガの塀', value: 'end_stone_brick_wall'},
    
    {text: 'プルプァブロック', value: 'purpur_block'},
    
    {text: 'プルプァの柱', value: 'purpur_pillar'},
    
    {text: 'プルプァの階段', value: 'purpur_stairs'},
    
    {text: 'プルプァのハーフブロック', value: 'purpur_slab'},
    
    {text: '石炭ブロック', value: 'coal_block'},
    
    {text: '鉄ブロック', value: 'iron_block'},
    
    {text: '鉄格子', value: 'iron_bars'},
    
    {text: '鉄のドア', value: 'iron_door'},
    
    {text: '鉄のトラップドア', value: 'iron_trapdoor'},
    
    {text: '鎖', value: 'chain'},
    
    {text: '金ブロック', value: 'gold_block'},
    
    {text: 'エメラルドブロック', value: 'emerald_block'},
    
    {text: 'ラピスラズリブロック', value: 'lapis_block'},
    
    {text: 'ダイヤモンドブロック', value: 'diamond_block'},
    
    {text: 'ネザライトブロック', value: 'netherite_block'},
    
    {text: 'クォーツブロック', value: 'quartz_block'},
    
    {text: 'クォーツの階段', value: 'quartz_stairs'},
    
    {text: 'クォーツのハーフブロック', value: 'quartz_slab'},
    
    {text: '模様入りのクォーツブロック', value: 'chiseled_quartz_block'},
    
    {text: 'クォーツレンガ', value: 'quartz_bricks'},
    
    {text: 'クォーツの柱', value: 'quartz_pillar'},
    
    {text: '滑らかなクォーツブロック', value: 'smooth_quartz'},
    
    {text: '滑らかなクォーツの階段', value: 'smooth_quartz_stairs'},
    
    {text: '滑らかなクォーツのハーフブロック', value: 'smooth_quartz_slab'},
    
    {text: '銅ブロック', value: 'copper_block'},
    
    {text: '切り込み入りの銅', value: 'cut_copper'},
    
    {text: '切り込み入りの銅の階段', value: 'cut_copper_stairs'},
    
    {text: '切り込み入りの銅のハーフブロック', value: 'cut_copper_slab'},
    
    {text: '風化した銅', value: 'exposed_copper'},
    
    {text: '風化した切り込み入りの銅', value: 'exposed_cut_copper'},
    
    {text: '風化した切り込み入りの銅の階段', value: 'exposed_cut_copper_stairs'},
    
    {text: '風化した切り込み入りの銅のハーフブロック', value: 'exposed_cut_copper_slab'},
    
    {text: '錆びた銅', value: 'weathered_copper'},
    
    {text: '錆びた切り込み入りの銅', value: 'weathered_cut_copper'},
    
    {text: '錆びた切り込み入りの銅の階段', value: 'weathered_cut_copper_stairs'},
    
    {text: '錆びた切り込み入りの銅のハーフブロック', value: 'weathered_cut_copper_slab'},
    
    {text: '酸化した銅', value: 'oxidized_copper'},
    
    {text: '酸化した切り込み入りの銅', value: 'oxidized_cut_copper'},
    
    {text: '酸化した切り込み入りの銅の階段', value: 'oxidized_cut_copper_stairs'},
    
    {text: '酸化した切り込み入りの銅のハーフブロック', value: 'oxidized_cut_copper_slab'},
    
    {text: '錆止めされた銅ブロック', value: 'waxed_copper_block'},
    
    {text: '錆止めされた切り込み入りの銅', value: 'waxed_cut_copper'},
    
    {text: '錆止めされた切り込み入りの銅の階段', value: 'waxed_cut_copper_stairs'},
    
    {text: '錆止めされた切り込み入りの銅のハーフブロック', value: 'waxed_cut_copper_slab'},
    
    {text: '錆止めされた風化した銅', value: 'waxed_exposed_copper'},
    
    {text: '錆止めされた風化した切り込み入りの銅', value: 'waxed_exposed_cut_copper'},
    
    {text: '錆止めされた風化した切り込み入りの銅の階段', value: 'waxed_exposed_cut_copper_stairs'},
    
    {text: '錆止めされた風化した切り込み入りの銅のハーフブロック', value: 'waxed_exposed_cut_copper_slab'},
    
    {text: '錆止めされた錆びた銅', value: 'waxed_weathered_copper'},
    
    {text: '錆止めされた錆びた切り込み入りの銅', value: 'waxed_weathered_cut_copper'},
    
    {text: '錆止めされた錆びた切り込み入りの銅の階段', value: 'waxed_weathered_cut_copper_stairs'},
    
    {text: '錆止めされた錆びた切り込み入りの銅のハーフブロック', value: 'waxed_weathered_cut_copper_slab'},
    
    {text: '錆止めされた酸化した銅', value: 'waxed_oxidized_copper'},
    
    {text: '錆止めされた酸化した切り込み入りの銅', value: 'waxed_oxidized_cut_copper'},
    
    {text: '錆止めされた酸化した切り込み入りの銅の階段', value: 'waxed_oxidized_cut_copper_stairs'},
    
    {text: '錆止めされた酸化した切り込み入りの銅のハーフブロック', value: 'waxed_oxidized_cut_copper_slab'}];

const colorBlockOptions =[

        {text: '白色の羊毛', value: 'white_wool'},
        
        {text: '薄灰色の羊毛', value: 'light_gray_wool'},
        
        {text: '灰色の羊毛', value: 'gray_wool'},
        
        {text: '黒色の羊毛', value: 'black_wool'},
        
        {text: '茶色の羊毛', value: 'brown_wool'},
        
        {text: '赤色の羊毛', value: 'red_wool'},
        
        {text: '橙色の羊毛', value: 'orange_wool'},
        
        {text: '黄色の羊毛', value: 'yellow_wool'},
        
        {text: '黄緑色の羊毛', value: 'lime_wool'},
        
        {text: '緑色の羊毛', value: 'green_wool'},
        
        {text: '青緑色の羊毛', value: 'cyan_wool'},
        
        {text: '空色の羊毛', value: 'light_blue_wool'},
        
        {text: '青色の羊毛', value: 'blue_wool'},
        
        {text: '紫色の羊毛', value: 'purple_wool'},
        
        {text: '赤紫色の羊毛', value: 'magenta_wool'},
        
        {text: '桃色の羊毛', value: 'pink_wool'},
        
        {text: '白色のカーペット', value: 'white_carpet'},
        
        {text: '薄灰色のカーペット', value: 'light_gray_carpet'},
        
        {text: '灰色のカーペット', value: 'gray_carpet'},
        
        {text: '黒色のカーペット', value: 'black_carpet'},
        
        {text: '茶色のカーペット', value: 'brown_carpet'},
        
        {text: '赤色のカーペット', value: 'red_carpet'},
        
        {text: '橙色のカーペット', value: 'orange_carpet'},
        
        {text: '黄色のカーペット', value: 'yellow_carpet'},
        
        {text: '黄緑色のカーペット', value: 'lime_carpet'},
        
        {text: '緑色のカーペット', value: 'green_carpet'},
        
        {text: '青緑色のカーペット', value: 'cyan_carpet'},
        
        {text: '空色のカーペット', value: 'light_blue_carpet'},
        
        {text: '青色のカーペット', value: 'blue_carpet'},
        
        {text: '紫色のカーペット', value: 'purple_carpet'},
        
        {text: '赤紫色のカーペット', value: 'magenta_carpet'},
        
        {text: '桃色のカーペット', value: 'pink_carpet'},
        
        {text: 'テラコッタ', value: 'terracotta'},
        
        {text: '白色のテラコッタ', value: 'white_terracotta'},
        
        {text: '薄灰色のテラコッタ', value: 'light_gray_terracotta'},
        
        {text: '灰色のテラコッタ', value: 'gray_terracotta'},
        
        {text: '黒色のテラコッタ', value: 'black_terracotta'},
        
        {text: '茶色のテラコッタ', value: 'brown_terracotta'},
        
        {text: '赤色のテラコッタ', value: 'red_terracotta'},
        
        {text: '橙色のテラコッタ', value: 'orange_terracotta'},
        
        {text: '黄色のテラコッタ', value: 'yellow_terracotta'},
        
        {text: '黄緑色のテラコッタ', value: 'lime_terracotta'},
        
        {text: '緑色のテラコッタ', value: 'green_terracotta'},
        
        {text: '青緑色のテラコッタ', value: 'cyan_terracotta'},
        
        {text: '空色のテラコッタ', value: 'light_blue_terracotta'},
        
        {text: '青色のテラコッタ', value: 'blue_terracotta'},
        
        {text: '紫色のテラコッタ', value: 'purple_terracotta'},
        
        {text: '赤紫色のテラコッタ', value: 'magenta_terracotta'},
        
        {text: '桃色のテラコッタ', value: 'pink_terracotta'},
        
        {text: '白色のコンクリート', value: 'white_concrete'},
        
        {text: '薄灰色のコンクリート', value: 'light_gray_concrete'},
        
        {text: '灰色のコンクリート', value: 'gray_concrete'},
        
        {text: '黒色のコンクリート', value: 'black_concrete'},
        
        {text: '茶色のコンクリート', value: 'brown_concrete'},
        
        {text: '赤色のコンクリート', value: 'red_concrete'},
        
        {text: '橙色のコンクリート', value: 'orange_concrete'},
        
        {text: '黄色のコンクリート', value: 'yellow_concrete'},
        
        {text: '黄緑色のコンクリート', value: 'lime_concrete'},
        
        {text: '緑色のコンクリート', value: 'green_concrete'},
        
        {text: '青緑色のコンクリート', value: 'cyan_concrete'},
        
        {text: '空色のコンクリート', value: 'light_blue_concrete'},
        
        {text: '青色のコンクリート', value: 'blue_concrete'},
        
        {text: '紫色のコンクリート', value: 'purple_concrete'},
        
        {text: '赤紫色のコンクリート', value: 'magenta_concrete'},
        
        {text: '桃色のコンクリート', value: 'pink_concrete'},
        
        {text: '白色のコンクリートパウダー', value: 'white_concrete_powder'},
        
        {text: '薄灰色のコンクリートパウダー', value: 'light_gray_concrete_powder'},
        
        {text: '灰色のコンクリートパウダー', value: 'gray_concrete_powder'},
        
        {text: '黒色のコンクリートパウダー', value: 'black_concrete_powder'},
        
        {text: '茶色のコンクリートパウダー', value: 'brown_concrete_powder'},
        
        {text: '赤色のコンクリートパウダー', value: 'red_concrete_powder'},
        
        {text: '橙色のコンクリートパウダー', value: 'orange_concrete_powder'},
        
        {text: '黄色のコンクリートパウダー', value: 'yellow_concrete_powder'},
        
        {text: '黄緑色のコンクリートパウダー', value: 'lime_concrete_powder'},
        
        {text: '緑色のコンクリートパウダー', value: 'green_concrete_powder'},
        
        {text: '青緑色のコンクリートパウダー', value: 'cyan_concrete_powder'},
        
        {text: '空色のコンクリートパウダー', value: 'light_blue_concrete_powder'},
        
        {text: '青色のコンクリートパウダー', value: 'blue_concrete_powder'},
        
        {text: '紫色のコンクリートパウダー', value: 'purple_concrete_powder'},
        
        {text: '赤紫色のコンクリートパウダー', value: 'magenta_concrete_powder'},
        
        {text: '桃色のコンクリートパウダー', value: 'pink_concrete_powder'},
        
        {text: '白色の彩釉テラコッタ', value: 'white_glazed_terracotta'},
        
        {text: '薄灰色の彩釉テラコッタ', value: 'light_gray_glazed_terracotta'},
        
        {text: '灰色の彩釉テラコッタ', value: 'gray_glazed_terracotta'},
        
        {text: '黒色の彩釉テラコッタ', value: 'black_glazed_terracotta'},
        
        {text: '茶色の彩釉テラコッタ', value: 'brown_glazed_terracotta'},
        
        {text: '赤色の彩釉テラコッタ', value: 'red_glazed_terracotta'},
        
        {text: '橙色の彩釉テラコッタ', value: 'orange_glazed_terracotta'},
        
        {text: '黄色の彩釉テラコッタ', value: 'yellow_glazed_terracotta'},
        
        {text: '黄緑色の彩釉テラコッタ', value: 'lime_glazed_terracotta'},
        
        {text: '緑色の彩釉テラコッタ', value: 'green_glazed_terracotta'},
        
        {text: '青緑色の彩釉テラコッタ', value: 'cyan_glazed_terracotta'},
        
        {text: '空色の彩釉テラコッタ', value: 'light_blue_glazed_terracotta'},
        
        {text: '青色の彩釉テラコッタ', value: 'blue_glazed_terracotta'},
        
        {text: '紫色の彩釉テラコッタ', value: 'purple_glazed_terracotta'},
        
        {text: '赤紫色の彩釉テラコッタ', value: 'magenta_glazed_terracotta'},
        
        {text: '桃色の彩釉テラコッタ', value: 'pink_glazed_terracotta'},
        
        {text: 'ガラス', value: 'glass'},
        
        {text: '白色の色付きガラス', value: 'white_stained_glass'},
        
        {text: '薄灰色の色付きガラス', value: 'light_gray_stained_glass'},
        
        {text: '灰色の色付きガラス', value: 'gray_stained_glass'},
        
        {text: '黒色の色付きガラス', value: 'black_stained_glass'},
        
        {text: '茶色の色付きガラス', value: 'brown_stained_glass'},
        
        {text: '赤色の色付きガラス', value: 'red_stained_glass'},
        
        {text: '橙色の色付きガラス', value: 'orange_stained_glass'},
        
        {text: '黄色の色付きガラス', value: 'yellow_stained_glass'},
        
        {text: '黄緑色の色付きガラス', value: 'lime_stained_glass'},
        
        {text: '緑色の色付きガラス', value: 'green_stained_glass'},
        
        {text: '青緑色の色付きガラス', value: 'cyan_stained_glass'},
        
        {text: '空色の色付きガラス', value: 'light_blue_stained_glass'},
        
        {text: '青色の色付きガラス', value: 'blue_stained_glass'},
        
        {text: '紫色の色付きガラス', value: 'purple_stained_glass'},
        
        {text: '赤紫色の色付きガラス', value: 'magenta_stained_glass'},
        
        {text: '桃色の色付きガラス', value: 'pink_stained_glass'},
        
        {text: 'ガラス板', value: 'glass_pane'},
        
        {text: '白色の色付きガラス板', value: 'white_stained_glass_pane'},
        
        {text: '薄灰色の色付きガラス板', value: 'light_gray_stained_glass_pane'},
        
        {text: '灰色の色付きガラス板', value: 'gray_stained_glass_pane'},
        
        {text: '黒色の色付きガラス板', value: 'black_stained_glass_pane'},
        
        {text: '茶色の色付きガラス板', value: 'brown_stained_glass_pane'},
        
        {text: '赤色の色付きガラス板', value: 'red_stained_glass_pane'},
        
        {text: '橙色の色付きガラス板', value: 'orange_stained_glass_pane'},
        
        {text: '黄色の色付きガラス板', value: 'yellow_stained_glass_pane'},
        
        {text: '黄緑色の色付きガラス板', value: 'lime_stained_glass_pane'},
        
        {text: '緑色の色付きガラス板', value: 'green_stained_glass_pane'},
        
        {text: '青緑色の色付きガラス板', value: 'cyan_stained_glass_pane'},
        
        {text: '空色の色付きガラス板', value: 'light_blue_stained_glass_pane'},
        
        {text: '青色の色付きガラス板', value: 'blue_stained_glass_pane'},
        
        {text: '紫色の色付きガラス板', value: 'purple_stained_glass_pane'},
        
        {text: '赤紫色の色付きガラス板', value: 'magenta_stained_glass_pane'},
        
        {text: '桃色の色付きガラス板', value: 'pink_stained_glass_pane'},
        
        {text: '白色のシュルカーボックス', value: 'white_shulker_box'},
        
        {text: '薄灰色のシュルカーボックス', value: 'light_gray_shulker_box'},
        
        {text: '灰色のシュルカーボックス', value: 'gray_shulker_box'},
        
        {text: '黒色のシュルカーボックス', value: 'black_shulker_box'},
        
        {text: '茶色のシュルカーボックス', value: 'brown_shulker_box'},
        
        {text: '赤色のシュルカーボックス', value: 'red_shulker_box'},
        
        {text: '橙色のシュルカーボックス', value: 'orange_shulker_box'},
        
        {text: '黄色のシュルカーボックス', value: 'yellow_shulker_box'},
        
        {text: '黄緑色のシュルカーボックス', value: 'lime_shulker_box'},
        
        {text: '緑色のシュルカーボックス', value: 'green_shulker_box'},
        
        {text: '青緑色のシュルカーボックス', value: 'cyan_shulker_box'},
        
        {text: '空色のシュルカーボックス', value: 'light_blue_shulker_box'},
        
        {text: '青色のシュルカーボックス', value: 'blue_shulker_box'},
        
        {text: '紫色のシュルカーボックス', value: 'purple_shulker_box'},
        
        {text: '赤紫色のシュルカーボックス', value: 'magenta_shulker_box'},
        
        {text: '桃色のシュルカーボックス', value: 'pink_shulker_box'},
        
        {text: '白色のベッド', value: 'white_bed'},
        
        {text: '薄灰色のベッド', value: 'light_gray_bed'},
        
        {text: '灰色のベッド', value: 'gray_bed'},
        
        {text: '黒色のベッド', value: 'black_bed'},
        
        {text: '茶色のベッド', value: 'brown_bed'},
        
        {text: '赤色のベッド', value: 'red_bed'},
        
        {text: '橙色のベッド', value: 'orange_bed'},
        
        {text: '黄色のベッド', value: 'yellow_bed'},
        
        {text: '黄緑色のベッド', value: 'lime_bed'},
        
        {text: '緑色のベッド', value: 'green_bed'},
        
        {text: '青緑色のベッド', value: 'cyan_bed'},
        
        {text: '空色のベッド', value: 'light_blue_bed'},
        
        {text: '青色のベッド', value: 'blue_bed'},
        
        {text: '紫色のベッド', value: 'purple_bed'},
        
        {text: '赤紫色のベッド', value: 'magenta_bed'},
        
        {text: '桃色のベッド', value: 'pink_bed'},
        
        {text: '白色のろうそく', value: 'white_candle'},
        
        {text: '薄灰色のろうそく', value: 'light_gray_candle'},
        
        {text: '灰色のろうそく', value: 'gray_candle'},
        
        {text: '黒色のろうそく', value: 'black_candle'},
        
        {text: '茶色のろうそく', value: 'brown_candle'},
        
        {text: '赤色のろうそく', value: 'red_candle'},
        
        {text: '橙色のろうそく', value: 'orange_candle'},
        
        {text: '黄色のろうそく', value: 'yellow_candle'},
        
        {text: '黄緑色のろうそく', value: 'lime_candle'},
        
        {text: '緑色のろうそく', value: 'green_candle'},
        
        {text: '青緑色のろうそく', value: 'cyan_candle'},
        
        {text: '空色のろうそく', value: 'light_blue_candle'},
        
        {text: '青色のろうそく', value: 'blue_candle'},
        
        {text: '紫色のろうそく', value: 'purple_candle'},
        
        {text: '赤紫色のろうそく', value: 'magenta_candle'},
        
        {text: '桃色のろうそく', value: 'pink_candle'},
        
        {text: '白色の旗', value: 'white_banner'},
        
        {text: '薄灰色の旗', value: 'light_gray_banner'},
        
        {text: '灰色の旗', value: 'gray_banner'},
        
        {text: '黒色の旗', value: 'black_banner'},
        
        {text: '茶色の旗', value: 'brown_banner'},
        
        {text: '赤色の旗', value: 'red_banner'},
        
        {text: '橙色の旗', value: 'orange_banner'},
        
        {text: '黄色の旗', value: 'yellow_banner'},
        
        {text: '黄緑色の旗', value: 'lime_banner'},
        
        {text: '緑色の旗', value: 'green_banner'},
        
        {text: '青緑色の旗', value: 'cyan_banner'},
        
        {text: '空色の旗', value: 'light_blue_banner'},
        
        {text: '青色の旗', value: 'blue_banner'},
        
        {text: '紫色の旗', value: 'purple_banner'},
        
        {text: '赤紫色の旗', value: 'magenta_banner'},
        
        {text: '桃色の旗', value: 'pink_banner'}];

const natureBlockOptions = [
    {text: '空気ブロック', value: 'air'},

    {text: '草ブロック', value: 'grass_block'},
    
    {text: 'ポドゾル', value: 'podzol'},
    
    {text: '菌糸', value: 'mycelium'},
    
    {text: '土の道', value: 'dirt_path'},
    
    {text: '土', value: 'dirt'},
    
    {text: '粗い土', value: 'coarse_dirt'},
    
    {text: '根付いた土', value: 'rooted_dirt'},
    
    {text: '耕地', value: 'farmland'},
    
    {text: '泥', value: 'mud'},
    
    {text: '粘土', value: 'clay'},
    
    {text: '砂利', value: 'gravel'},
    
    {text: '砂', value: 'sand'},
    
    {text: '砂岩', value: 'sandstone'},
    
    {text: '赤い砂', value: 'red_sand'},
    
    {text: '赤い砂岩', value: 'red_sandstone'},
    
    {text: '氷', value: 'ice'},
    
    {text: '氷塊', value: 'packed_ice'},
    
    {text: '青氷', value: 'blue_ice'},
    
    {text: '雪ブロック', value: 'snow_block'},
    
    {text: '雪', value: 'snow'},
    
    {text: '苔ブロック', value: 'moss_block'},
    
    {text: '苔のカーペット', value: 'moss_carpet'},
    
    {text: '石', value: 'stone'},
    
    {text: '深層岩', value: 'deepslate'},
    
    {text: '花崗岩', value: 'granite'},
    
    {text: '閃緑岩', value: 'diorite'},
    
    {text: '安山岩', value: 'andesite'},
    
    {text: '方解石', value: 'calcite'},
    
    {text: '凝灰岩', value: 'tuff'},
    
    {text: '鍾乳石ブロック', value: 'dripstone_block'},
    
    {text: '鍾乳石', value: 'pointed_dripstone'},
    
    {text: 'プリズマリン', value: 'prismarine'},
    
    {text: 'マグマブロック', value: 'magma_block'},
    
    {text: '黒曜石', value: 'obsidian'},
    
    {text: '泣く黒曜石', value: 'crying_obsidian'},
    
    {text: 'ネザーラック', value: 'netherrack'},
    
    {text: '真紅のナイリウム', value: 'crimson_nylium'},
    
    {text: '歪んだナイリウム', value: 'warped_nylium'},
    
    {text: 'ソウルサンド', value: 'soul_sand'},
    
    {text: 'ソウルソイル', value: 'soul_soil'},
    
    {text: '骨ブロック', value: 'bone_block'},
    
    {text: 'ブラックストーン', value: 'blackstone'},
    
    {text: '玄武岩', value: 'basalt'},
    
    {text: '滑らかな玄武岩', value: 'smooth_basalt'},
    
    {text: 'エンドストーン', value: 'end_stone'},
    
    {text: '石炭鉱石', value: 'coal_ore'},
    
    {text: '深層石炭鉱石', value: 'deepslate_coal_ore'},
    
    {text: '鉄鉱石', value: 'iron_ore'},
    
    {text: '深層鉄鉱石', value: 'deepslate_iron_ore'},
    
    {text: '銅鉱石', value: 'copper_ore'},
    
    {text: '深層銅鉱石', value: 'deepslate_copper_ore'},
    
    {text: '金鉱石', value: 'gold_ore'},
    
    {text: '深層金鉱石', value: 'deepslate_gold_ore'},
    
    {text: 'レッドストーン鉱石', value: 'redstone_ore'},
    
    {text: '深層レッドストーン鉱石', value: 'deepslate_redstone_ore'},
    
    {text: 'エメラルド鉱石', value: 'emerald_ore'},
    
    {text: '深層エメラルド鉱石', value: 'deepslate_emerald_ore'},
    
    {text: 'ラピスラズリ鉱石', value: 'lapis_ore'},
    
    {text: '深層ラピスラズリ鉱石', value: 'deepslate_lapis_ore'},
    
    {text: 'ダイヤモンド鉱石', value: 'diamond_ore'},
    
    {text: '深層ダイヤモンド鉱石', value: 'deepslate_diamond_ore'},
    
    {text: 'ネザー金鉱石', value: 'nether_gold_ore'},
    
    {text: 'ネザークォーツ鉱石', value: 'nether_quartz_ore'},
    
    {text: '鉄の原石ブロック', value: 'raw_iron_block'},
    
    {text: '銅の原石ブロック', value: 'raw_copper_block'},
    
    {text: '金の原石ブロック', value: 'raw_gold_block'},
    
    {text: 'グロウストーン', value: 'glowstone'},
    
    {text: 'アメジストブロック', value: 'amethyst_block'},
    
    {text: '芽生えたアメジスト', value: 'budding_amethyst'},
    
    {text: '小さなアメジストの芽', value: 'small_amethyst_bud'},
    
    {text: '中くらいのアメジストの芽', value: 'medium_amethyst_bud'},
    
    {text: '大きなアメジストの芽', value: 'large_amethyst_bud'},
    
    {text: 'アメジストの塊', value: 'amethyst_cluster'},
    
    {text: 'オークの原木', value: 'oak_log'},
    
    {text: 'トウヒの原木', value: 'spruce_log'},
    
    {text: 'シラカバの原木', value: 'birch_log'},
    
    {text: 'ジャングルの原木', value: 'jungle_log'},
    
    {text: 'アカシアの原木', value: 'acacia_log'},
    
    {text: 'ダークオークの原木', value: 'dark_oak_log'},
    
    {text: 'マングローブの原木', value: 'mangrove_log'},
    
    {text: 'マングローブの根', value: 'mangrove_roots'},
    
    {text: '泥だらけのマングローブの根', value: 'muddy_mangrove_roots'},
    
    {text: 'サクラの原木', value: 'cherry_log'},
    
    {text: 'キノコの柄', value: 'mushroom_stem'},
    
    {text: '真紅の幹', value: 'crimson_stem'},
    
    {text: '歪んだ幹', value: 'warped_stem'},
    
    {text: 'オークの葉', value: 'oak_leaves'},
    
    {text: 'トウヒの葉', value: 'spruce_leaves'},
    
    {text: 'シラカバの葉', value: 'birch_leaves'},
    
    {text: 'ジャングルの葉', value: 'jungle_leaves'},
    
    {text: 'アカシアの葉', value: 'acacia_leaves'},
    
    {text: 'ダークオークの葉', value: 'dark_oak_leaves'},
    
    {text: 'マングローブの葉', value: 'mangrove_leaves'},
    
    {text: 'サクラの葉', value: 'cherry_leaves'},
    
    {text: 'ツツジの葉', value: 'azalea_leaves'},
    
    {text: '開花したツツジの葉', value: 'flowering_azalea_leaves'},
    
    {text: '茶色のキノコブロック', value: 'brown_mushroom_block'},
    
    {text: '赤色のキノコブロック', value: 'red_mushroom_block'},
    
    {text: 'ネザーウォートブロック', value: 'nether_wart_block'},
    
    {text: '歪んだウォートブロック', value: 'warped_wart_block'},
    
    {text: 'シュルームライト', value: 'shroomlight'},
    
    {text: 'オークの苗木', value: 'oak_sapling'},
    
    {text: 'トウヒの苗木', value: 'spruce_sapling'},
    
    {text: 'シラカバの苗木', value: 'birch_sapling'},
    
    {text: 'ジャングルの苗木', value: 'jungle_sapling'},
    
    {text: 'アカシアの苗木', value: 'acacia_sapling'},
    
    {text: 'ダークオークの苗木', value: 'dark_oak_sapling'},
    
    {text: 'マングローブの芽', value: 'mangrove_propagule'},
    
    {text: 'サクラの苗木', value: 'cherry_sapling'},
    
    {text: 'ツツジ', value: 'azalea'},
    
    {text: '開花したツツジ', value: 'flowering_azalea'},
    
    {text: '茶色のキノコ', value: 'brown_mushroom'},
    
    {text: '赤色のキノコ', value: 'red_mushroom'},
    
    {text: '真紅のキノコ', value: 'crimson_fungus'},
    
    {text: '歪んだキノコ', value: 'warped_fungus'},
    
    {text: '草', value: 'grass'},
    
    {text: 'シダ', value: 'fern'},
    
    {text: '枯れ木', value: 'dead_bush'},
    
    {text: 'タンポポ', value: 'dandelion'},
    
    {text: 'ポピー', value: 'poppy'},
    
    {text: 'ヒスイラン', value: 'blue_orchid'},
    
    {text: 'アリウム', value: 'allium'},
    
    {text: 'ヒナソウ', value: 'azure_bluet'},
    
    {text: '赤色のチューリップ', value: 'red_tulip'},
    
    {text: '橙色のチューリップ', value: 'orange_tulip'},
    
    {text: '白色のチューリップ', value: 'white_tulip'},
    
    {text: '桃色のチューリップ', value: 'pink_tulip'},
    
    {text: 'フランスギク', value: 'oxeye_daisy'},
    
    {text: 'ヤグルマギク', value: 'cornflower'},
    
    {text: 'スズラン', value: 'lily_of_the_valley'},
    
    {text: 'トーチフラワー', value: 'torchflower'},
    
    {text: 'ウィザーローズ', value: 'wither_rose'},
    
    {text: '桜色の花びら', value: 'pink_petals'},
    
    {text: '胞子の花', value: 'spore_blossom'},
    
    {text: '竹', value: 'bamboo'},
    
    {text: 'サトウキビ', value: 'sugar_cane'},
    
    {text: 'サボテン', value: 'cactus'},
    
    {text: '真紅の根', value: 'crimson_roots'},
    
    {text: '歪んだ根', value: 'warped_roots'},
    
    {text: 'ネザースプラウト', value: 'nether_sprouts'},
    
    {text: 'しだれツタ', value: 'weeping_vines'},
    
    {text: 'ねじれツタ', value: 'twisting_vines'},
    
    {text: 'ツタ', value: 'vine'},
    
    {text: '背の高い草', value: 'tall_grass'},
    
    {text: '大きなシダ', value: 'large_fern'},
    
    {text: 'ヒマワリ', value: 'sunflower'},
    
    {text: 'ライラック', value: 'lilac'},
    
    {text: 'バラの低木', value: 'rose_bush'},
    
    {text: 'ボタン', value: 'peony'},
    
    {text: 'ウツボカズラ', value: 'pitcher_plant'},
    
    {text: '大きなドリップリーフ', value: 'big_dripleaf'},
    
    {text: '小さなドリップリーフ', value: 'small_dripleaf'},
    
    {text: 'コーラスプラント', value: 'chorus_plant'},
    
    {text: 'コーラスフラワー', value: 'chorus_flower'},
    
    {text: 'ヒカリゴケ', value: 'glow_lichen'},
    
    {text: '垂れ根', value: 'hanging_roots'},
    
    {text: 'カエルの卵', value: 'frogspawn'},
    
    {text: 'カメの卵', value: 'turtle_egg'},
    
    {text: 'スニッファーの卵', value: 'sniffer_egg'},
    
    {text: '小麦の種', value: 'wheat_seeds'},
    
    {text: 'カカオ豆', value: 'cocoa_beans'},
    
    {text: 'カボチャの種', value: 'pumpkin_seeds'},
    
    {text: 'スイカの種', value: 'melon_seeds'},
    
    {text: 'ビートルートの種', value: 'beetroot_seeds'},
    
    {text: 'トーチフラワーの種', value: 'torchflower_seeds'},
    
    {text: 'ウツボカズラのさや', value: 'pitcher_pod'},
    
    {text: 'スイレンの葉', value: 'lily_pad'},
    
    {text: '海草', value: 'seagrass'},
    
    {text: 'シーピクルス', value: 'sea_pickle'},
    
    {text: 'コンブ', value: 'kelp'},
    
    {text: '乾燥した昆布ブロック', value: 'dried_kelp_block'},
    
    {text: 'クダサンゴブロック', value: 'tube_coral_block'},
    
    {text: 'ノウサンゴブロック', value: 'brain_coral_block'},
    
    {text: 'ミズタマサンゴブロック', value: 'bubble_coral_block'},
    
    {text: 'ミレポラサンゴブロック', value: 'fire_coral_block'},
    
    {text: 'シカツノサンゴブロック', value: 'horn_coral_block'},
    
    {text: '死んだクダサンゴブロック', value: 'dead_tube_coral_block'},
    
    {text: '死んだノウサンゴブロック', value: 'dead_brain_coral_block'},
    
    {text: '死んだミズタマサンゴブロック', value: 'dead_bubble_coral_block'},
    
    {text: '死んだミレポラサンゴブロック', value: 'dead_fire_coral_block'},
    
    {text: '死んだシカツノサンゴブロック', value: 'dead_horn_coral_block'},
    
    {text: 'クダサンゴ', value: 'tube_coral'},
    
    {text: 'ノウサンゴ', value: 'brain_coral'},
    
    {text: 'ミズタマサンゴ', value: 'bubble_coral'},
    
    {text: 'ミレポラサンゴ', value: 'fire_coral'},
    
    {text: 'シカツノサンゴ', value: 'horn_coral'},
    
    {text: '死んだクダサンゴ', value: 'dead_tube_coral'},
    
    {text: '死んだノウサンゴ', value: 'dead_brain_coral'},
    
    {text: '死んだミズタマサンゴ', value: 'dead_bubble_coral'},
    
    {text: '死んだミレポラサンゴ', value: 'dead_fire_coral'},
    
    {text: '死んだシカツノサンゴ', value: 'dead_horn_coral'},
    
    {text: 'クダウチワサンゴ', value: 'tube_coral_fan'},
    
    {text: 'ノウウチワサンゴ', value: 'brain_coral_fan'},
    
    {text: 'ミズタマウチワサンゴ', value: 'bubble_coral_fan'},
    
    {text: 'ミレポラウチワサンゴ', value: 'fire_coral_fan'},
    
    {text: 'シカツノウチワサンゴ', value: 'horn_coral_fan'},
    
    {text: '死んだクダウチワサンゴ', value: 'dead_tube_coral_fan'},
    
    {text: '死んだノウウチワサンゴ', value: 'dead_brain_coral_fan'},
    
    {text: '死んだミズタマウチワサンゴ', value: 'dead_bubble_coral_fan'},
    
    {text: '死んだミレポラウチワサンゴ', value: 'dead_fire_coral_fan'},
    
    {text: '死んだシカツノウチワサンゴ', value: 'dead_horn_coral_fan'},
    
    {text: 'スポンジ', value: 'sponge'},
    
    {text: '濡れたスポンジ', value: 'wet_sponge'},
    
    {text: 'スイカ', value: 'melon'},
    
    {text: 'カボチャ', value: 'pumpkin'},
    
    {text: 'くり抜かれたカボチャ', value: 'carved_pumpkin'},
    
    {text: 'ジャック・オ・ランタン', value: 'jack_o_lantern'},
    
    {text: '干草の俵', value: 'hay_block'},
    
    {text: 'ミツバチの巣', value: 'bee_nest'},
    
    {text: 'ハニカムブロック', value: 'honeycomb_block'},
    
    {text: '黄土色のフロッグライト', value: 'ochre_froglight'},
    
    {text: '新緑色のフロッグライト', value: 'verdant_froglight'},
    
    {text: '真珠色のフロッグライト', value: 'pearlescent_froglight'},
    
    {text: 'スカルク', value: 'sculk'},
    
    {text: 'スカルクヴェイン', value: 'sculk_vein'},
    
    {text: 'スカルクカタリスト', value: 'sculk_catalyst'},
    
    {text: 'クモの巣', value: 'cobweb'},
    
    {text: '岩盤', value: 'bedrock'}];
    
const functionalBlockOptions = [

    {text: '松明', value: 'torch'},
    
    {text: '魂の松明', value: 'soul_torch'},
    
    {text: 'ランタン', value: 'lantern'},
    
    {text: '魂のランタン', value: 'soul_lantern'},
    
    {text: 'エンドロッド', value: 'end_rod'},
    
    {text: '作業台', value: 'crafting_table'},
    
    {text: '石切台', value: 'stonecutter'},
    
    {text: '製図台', value: 'cartography_table'},
    
    {text: '矢細工台', value: 'fletching_table'},
    
    {text: '鍛冶台', value: 'smithing_table'},
    
    {text: '砥石', value: 'grindstone'},
    
    {text: '機織り機', value: 'loom'},
    
    {text: 'かまど', value: 'furnace'},
    
    {text: '燻製器', value: 'smoker'},
    
    {text: '溶鉱炉', value: 'blast_furnace'},
    
    {text: '焚き火', value: 'campfire'},
    
    {text: '魂の焚き火', value: 'soul_campfire'},
    
    {text: '金床', value: 'anvil'},
    
    {text: '欠けた金床', value: 'chipped_anvil'},
    
    {text: '壊れかけの金床', value: 'damaged_anvil'},
    
    {text: 'コンポスター', value: 'composter'},
    
    {text: 'エンチャントテーブル', value: 'enchanting_table'},
    
    {text: 'エンドクリスタル', value: 'end_crystal'},
    
    {text: '醸造台', value: 'brewing_stand'},
    
    {text: '大釜', value: 'cauldron'},
    
    {text: '鐘', value: 'bell'},
    
    {text: 'ビーコン', value: 'beacon'},
    
    {text: 'コンジット', value: 'conduit'},
    
    {text: 'ロードストーン', value: 'lodestone'},
    
    {text: 'はしご', value: 'ladder'},
    
    {text: '足場', value: 'scaffolding'},
    
    {text: '養蜂箱', value: 'beehive'},
    
    {text: '怪しげな砂', value: 'suspicious_sand'},
    
    {text: '怪しげな砂利', value: 'suspicious_gravel'},
    
    {text: '避雷針', value: 'lightning_rod'},
    
    {text: '植木鉢', value: 'flower_pot'},
    
    {text: '飾り壺', value: 'decorated_pot'},
    
    {text: '防具立て', value: 'armor_stand'},
    
    {text: '額縁', value: 'item_frame'},
    
    {text: '輝く額縁', value: 'glow_item_frame'},
    
    {text: '絵画', value: 'painting'},
    
    {text: '絵画 – kebab med tre pepperoni', value: 'painting{EntityTag:{variant:"minecraft:kebab"}}'},
    
    {text: '絵画 – de_aztec', value: 'painting{EntityTag:{variant:"minecraft:aztec"}}'},
    
    {text: '絵画 – Albanian', value: 'painting{EntityTag:{variant:"minecraft:alban"}}'},
    
    {text: '絵画 – de_aztec', value: 'painting{EntityTag:{variant:"minecraft:aztec2"}}'},
    
    {text: '絵画 – Target Successfully Bombed', value: 'painting{EntityTag:{variant:"minecraft:bomb"}}'},
    
    {text: '絵画 – Paradistrad', value: 'painting{EntityTag:{variant:"minecraft:plant"}}'},
    
    {text: '絵画 – Wasteland', value: 'painting{EntityTag:{variant:"minecraft:wasteland"}}'},
    
    {text: '絵画 – Wanderer', value: 'painting{EntityTag:{variant:"minecraft:wanderer"}}'},
    
    {text: '絵画 – Graham', value: 'painting{EntityTag:{variant:"minecraft:graham"}}'},
    
    {text: '絵画 – The Pool', value: 'painting{EntityTag:{variant:"minecraft:pool"}}'},
    
    {text: '絵画 – Bonjour Monsieur Courbet', value: 'painting{EntityTag:{variant:"minecraft:courbet"}}'},
    
    {text: '絵画 – Seaside', value: 'painting{EntityTag:{variant:"minecraft:sea"}}'},
    
    {text: '絵画 – sunset_dense', value: 'painting{EntityTag:{variant:"minecraft:sunset"}}'},
    
    {text: '絵画 – Creebet', value: 'painting{EntityTag:{variant:"minecraft:creebet"}}'},
    
    {text: '絵画 – Match', value: 'painting{EntityTag:{variant:"minecraft:match"}}'},
    
    {text: '絵画 – Bust', value: 'painting{EntityTag:{variant:"minecraft:bust"}}'},
    
    {text: '絵画 – The Stage Is Set', value: 'painting{EntityTag:{variant:"minecraft:stage"}}'},
    
    {text: '絵画 – The void', value: 'painting{EntityTag:{variant:"minecraft:void"}}'},
    
    {text: '絵画 – Skull and Roses', value: 'painting{EntityTag:{variant:"minecraft:skull_and_rose"}}'},
    
    {text: '絵画 – Wither', value: 'painting{EntityTag:{variant:"minecraft:wither"}}'},
    
    {text: '絵画 – Fighters', value: 'painting{EntityTag:{variant:"minecraft:fighters"}}'},
    
    {text: '絵画 – Mortal Coil', value: 'painting{EntityTag:{variant:"minecraft:skeleton"}}'},
    
    {text: '絵画 – Kong', value: 'painting{EntityTag:{variant:"minecraft:donkey_kong"}}'},
    
    {text: '絵画 – Pointer', value: 'painting{EntityTag:{variant:"minecraft:pointer"}}'},
    
    {text: '絵画 – Pigscene', value: 'painting{EntityTag:{variant:"minecraft:pigscene"}}'},
    
    {text: '絵画 – Skull On Fire', value: 'painting{EntityTag:{variant:"minecraft:burning_skull"}}'},
    
    {text: '本棚', value: 'bookshelf'},
    
    {text: '模様入りの本棚', value: 'chiseled_bookshelf'},
    
    {text: '書見台', value: 'lectern'},
    
    {text: '遮光ガラス', value: 'tinted_glass'},
    
    {text: 'オークの看板', value: 'oak_sign'},
    
    {text: 'オークの吊り看板', value: 'oak_hanging_sign'},
    
    {text: 'トウヒの看板', value: 'spruce_sign'},
    
    {text: 'トウヒの吊り看板', value: 'spruce_hanging_sign'},
    
    {text: 'シラカバの看板', value: 'birch_sign'},
    
    {text: 'シラカバの吊り看板', value: 'birch_hanging_sign'},
    
    {text: 'ジャングルの看板', value: 'jungle_sign'},
    
    {text: 'ジャングルの吊り看板', value: 'jungle_hanging_sign'},
    
    {text: 'アカシアの看板', value: 'acacia_sign'},
    
    {text: 'アカシアの吊り看板', value: 'acacia_hanging_sign'},
    
    {text: 'ダークオークの看板', value: 'dark_oak_sign'},
    
    {text: 'ダークオークの吊り看板', value: 'dark_oak_hanging_sign'},
    
    {text: 'マングローブの看板', value: 'mangrove_sign'},
    
    {text: 'マングローブの吊り看板', value: 'mangrove_hanging_sign'},
    
    {text: 'サクラの看板', value: 'cherry_sign'},
    
    {text: 'サクラの吊り看板', value: 'cherry_hanging_sign'},
    
    {text: '竹の看板', value: 'bamboo_sign'},
    
    {text: '竹の吊り看板', value: 'bamboo_hanging_sign'},
    
    {text: '真紅の看板', value: 'crimson_sign'},
    
    {text: '真紅の吊り看板', value: 'crimson_hanging_sign'},
    
    {text: '歪んだ看板', value: 'warped_sign'},
    
    {text: '歪んだ吊り看板', value: 'warped_hanging_sign'},
    
    {text: 'チェスト', value: 'chest'},
    
    {text: '樽', value: 'barrel'},
    
    {text: 'エンダーチェスト', value: 'ender_chest'},
    
    {text: 'シュルカーボックス', value: 'shulker_box'},
    
    {text: 'リスポーンアンカー', value: 'respawn_anchor'},
    
    {text: 'ろうそく', value: 'candle'},
    
    {text: '不吉な旗', value: 'white_banner{BlockEntityTag:{Patterns:[{Pattern:"mr",Color:9},{Pattern:"bs",Color:8},{Pattern:"cs",Color:7},{Pattern:"bo",Color:8},{Pattern:"ms",Color:15},{Pattern:"hh",Color:8},{Pattern:"mc",Color:8},{Pattern:"bo",Color:15}]}}'},
    
    {text: 'スケルトンの頭蓋骨', value: 'skeleton_skull'},
    
    {text: 'ウィザースケルトンの頭蓋骨', value: 'wither_skeleton_skull'},
    
    {text: 'プレイヤーの頭', value: 'player_head'},
    
    {text: 'ゾンビの頭', value: 'zombie_head'},
    
    {text: 'クリーパーの頭', value: 'creeper_head'},
    
    {text: 'ピグリンの頭', value: 'piglin_head'},
    
    {text: 'ドラゴンの頭', value: 'dragon_head'},
    
    {text: 'ドラゴンの卵', value: 'dragon_egg'},
    
    {text: 'エンドポータルフレーム', value: 'end_portal_frame'},
    
    {text: '虫食い石', value: 'infested_stone'},
    
    {text: '虫食い丸石', value: 'infested_cobblestone'},
    
    {text: '虫食い石レンガ', value: 'infested_stone_bricks'},
    
    {text: '苔むした虫食い石レンガ', value: 'infested_mossy_stone_bricks'},
    
    {text: 'ひび割れた虫食い石レンガ', value: 'infested_cracked_stone_bricks'},
    
    {text: '模様入りの虫食い石レンガ', value: 'infested_chiseled_stone_bricks'},
    
    {text: '虫食い深層岩', value: 'infested_deepslate'}]; 
    
 const redstoneBlockOptios = [

    {text: 'レッドストーンダスト', value: 'redstone'},
    
    {text: 'レッドストーントーチ', value: 'redstone_torch'},
    
    {text: 'レッドストーンブロック', value: 'redstone_block'},
    
    {text: 'レッドストーンリピーター', value: 'repeater'},
    
    {text: 'レッドストーンコンパレーター', value: 'comparator'},
    
    {text: '的', value: 'target'},
    
    {text: 'レバー', value: 'lever'},
    
    {text: 'オークのボタン', value: 'oak_button'},
    
    {text: '石のボタン', value: 'stone_button'},
    
    {text: 'オークの感圧板', value: 'oak_pressure_plate'},
    
    {text: '石の感圧板', value: 'stone_pressure_plate'},
    
    {text: '金の感圧板', value: 'light_weighted_pressure_plate'},
    
    {text: '鉄の感圧板', value: 'heavy_weighted_pressure_plate'},
    
    {text: 'スカルクセンサー', value: 'sculk_sensor'},
    
    {text: '調律されたスカルクセンサー', value: 'calibrated_sculk_sensor'},
    
    {text: 'スカルクシュリーカー', value: 'sculk_shrieker'},
    
    {text: 'トリップワイヤーフック', value: 'tripwire_hook'},
    
    {text: '日照センサー', value: 'daylight_detector'},
    
    {text: 'ピストン', value: 'piston'},
    
    {text: '粘着ピストン', value: 'sticky_piston'},
    
    {text: 'スライムブロック', value: 'slime_block'},
    
    {text: 'ハチミツブロック', value: 'honey_block'},
    
    {text: 'ディスペンサー', value: 'dispenser'},
    
    {text: 'ドロッパー', value: 'dropper'},
    
    {text: 'ホッパー', value: 'hopper'},
    
    {text: 'トラップチェスト', value: 'trapped_chest'},
    
    {text: 'ジュークボックス', value: 'jukebox'},
    
    {text: 'オブザーバー', value: 'observer'},
    
    {text: '音符ブロック', value: 'note_block'},
    
    {text: 'TNT', value: 'tnt'},
    
    {text: 'レッドストーンランプ', value: 'redstone_lamp'}];   


 const toolItemsOptios = [
     {text:'木の斧', value:'wooden_axe'},
     {text:'木のクワ', value:'wooden_hoe'},
     {text:'木のツルハシ', value:'wooden_pickaxe'},
     {text:'木のシャベル', value:'wooden_shovel'},
     {text:'木の剣', value:'wooden_sword'},
     {text:'石の斧', value:'stone_axe'},
     {text:'石のクワ', value:'stone_hoe'},
     {text:'石のツルハシ', value:'stone_pickaxe'},
     {text:'石のシャベル', value:'stone_shovel'},
     {text:'石の剣', value:'stone_sword'},
     {text:'鉄のブーツ', value:'iron_boots'},
     {text:'鉄のチェストプレート', value:'iron_chestplate'},
     {text:'鉄のヘルメット', value:'iron_helmet'},
     {text:'鉄のクワ', value:'iron_hoe'},
     {text:'鉄の馬鎧', value:'iron_horse_armor'},
     {text:'鉄インゴット', value:'iron_ingot'},
     {text:'鉄のレギンス', value:'iron_leggings'},
     {text:'鉄塊', value:'iron_nugget'},
     {text:'鉄のツルハシ', value:'iron_pickaxe'},
     {text:'鉄のシャベル', value:'iron_shovel'},
     {text:'鉄の剣', value:'iron_sword'},
     {text:'鉄の斧', value:'iron_axe'},
     {text:'金の斧', value:'golden_axe'},
     {text:'金のブーツ', value:'golden_boots'},
     {text:'金のニンジン', value:'golden_carrot'},
     {text:'金のチェストプレート', value:'golden_chestplate'},
     {text:'金のヘルメット', value:'golden_helmet'},
     {text:'金のクワ', value:'golden_hoe'},
     {text:'金の馬鎧', value:'golden_horse_armor'},
     {text:'金のレギンス', value:'golden_leggings'},
     {text:'金のツルハシ', value:'golden_pickaxe'},
     {text:'金のシャベル', value:'golden_shovel'},
     {text:'金の剣', value:'golden_sword'},
     {text:'ダイヤモンドの斧', value:'diamond_axe'},
     {text:'ダイヤモンドのブーツ', value:'diamond_boots'},
     {text:'ダイヤモンドのチェストプレート', value:'diamond_chestplate'},
     {text:'ダイヤモンドのヘルメット', value:'diamond_helmet'},
     {text:'ダイヤモンドのクワ', value:'diamond_hoe'},
     {text:'ダイヤモンドの馬鎧', value:'diamond_horse_armor'},
     {text:'ダイヤモンドのレギンス', value:'diamond_leggings'},
     {text:'ダイヤモンドのツルハシ', value:'diamond_pickaxe'},
     {text:'ダイヤモンドのシャベル', value:'diamond_shovel'},
     {text:'ダイヤモンドの剣', value:'diamond_sword'},
     {text:'ネザライトの斧', value:'netherite_axe'},
     {text:'ネザライトのブーツ', value:'netherite_boots'},
     {text:'ネザライトのチェストプレート', value:'netherite_chestplate'},
     {text:'ネザライトのヘルメット', value:'netherite_helmet'},
     {text:'ネザライトのクワ', value:'netherite_hoe'},
     {text:'ネザライトインゴット', value:'netherite_ingot'},
     {text:'ネザライトのレギンス', value:'netherite_leggings'},
     {text:'ネザライトのツルハシ', value:'netherite_pickaxe'},
     {text:'ネザライトの欠片', value:'netherite_scrap'},
     {text:'ネザライトのシャベル', value:'netherite_shovel'},
     {text:'ネザライトの剣', value:'netherite_sword'},
     {text:'ウーパールーパー入りバケツ', value:'axolotl_bucket'},
     {text:'バケツ', value:'bucket'},
     {text:'タラ入りバケツ', value:'cod_bucket'},
     {text:'溶岩入りバケツ', value:'lava_bucket'},
     {text:'ミルク入りバケツ', value:'milk_bucket'},
     {text:'粉雪入りバケツ', value:'powder_snow_bucket'},
     {text:'フグ入りバケツ', value:'pufferfish_bucket'},
     {text:'サケ入りバケツ', value:'salmon_bucket'},
     {text:'オタマジャクシ入りバケツ', value:'tadpole_bucket'},
     {text:'熱帯魚入りバケツ', value:'tropical_fish_bucket'},
     {text:'水入りバケツ', value:'water_bucket'},
     {text:'エンドロッド', value:'end_rod'},
     {text:'避雷針', value:'lightning_rod'},
     {text:'ブレイズロッド', value:'blaze_rod'},
     {text:'釣竿', value:'fishing_rod'},
     {text:'火打石', value:'flint'},
     {text:'火打石と打ち金', value:'flint_and_steel'},
     {text:'焚き火', value:'campfire'},
     {text:'魂の焚き火', value:'soul_campfire'},
     {text:'骨', value:'bone'},
     {text:'骨粉', value:'bone_meal'},
     {text:'ハサミ', value:'shears'},
     {text:'リード', value:'lead'},
     {text:'コンパス', value:'compass'},
     {text:'アカシアのボート', value:'acacia_boat'},
     {text:'チェスト付きのアカシアのボート', value:'acacia_chest_boat'},
     {text:'シラカバのボート', value:'birch_boat'},
     {text:'チェスト付きのシラカバのボート', value:'birch_chest_boat'},
     {text:'ダークオークのボート', value:'dark_oak_boat'},
     {text:'チェスト付きのダークオークのボート', value:'dark_oak_chest_boat'},
     {text:'ジャングルのボート', value:'jungle_boat'},
     {text:'チェスト付きのジャングルのボート', value:'jungle_chest_boat'},
     {text:'マングローブのボート', value:'mangrove_boat'},
     {text:'チェスト付きのマングローブのボート', value:'mangrove_chest_boat'},
     {text:'オークのボート', value:'oak_boat'},
     {text:'チェスト付きのオークのボート', value:'oak_chest_boat'},
     {text:'トウヒのボート', value:'spruce_boat'},
     {text:'チェスト付きのトウヒのボート', value:'spruce_chest_boat'},
     {text:'アクティベーターレール', value:'activator_rail'},
     {text:'ディテクターレール', value:'detector_rail'},
     {text:'パワードレール', value:'powered_rail'},
     {text:'レール', value:'rail'},
     {text:'チェスト付きトロッコ', value:'chest_minecart'},
     {text:'コマンドブロック付きトロッコ', value:'command_block_minecart'},
     {text:'かまど付きトロッコ', value:'furnace_minecart'},
     {text:'ホッパー付きトロッコ', value:'hopper_minecart'},
     {text:'トロッコ', value:'minecart'},
     {text:'TNT付きのトロッコ', value:'tnt_minecart'}   
 ];
module.exports = { buildingBlockOptions, colorBlockOptions, natureBlockOptions, functionalBlockOptions, redstoneBlockOptios, toolItemsOptios }
