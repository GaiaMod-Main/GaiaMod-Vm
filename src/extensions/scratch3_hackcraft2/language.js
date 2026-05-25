const translation = {
    onEntityCustomEvent_text: {
        'ja': '[MESSAGE]を受け取った時',
        'ja-Hira': '[MESSAGE]をうけとったとき',
        'en': 'When you receive a [MESSAGE]',
    },
    onInteractEvent_text: {
        'ja': '[EVENT]のアイテムを使った時',
        'ja-Hira': '[EVENT]のアイテムをつかったとき',
        'en': 'When an item is used in [EVENT]',
    },
    sendEvent_text: {
        'ja': '[TARGET]に[MESSAGE]を送る',
        'ja-Hira': '[TARGET]に[MESSAGE]をおくる',
        'en': 'Send [MESSAGE] to [TARGET]',
    },
    waitForRedstone_text: {
        'ja': 'レッドストーン信号が変わるまで待つ',
        'ja-Hira': 'レッドストーンしんごうがかわるまでまつ',
        'en': 'Wait for the Redstone signal to change',
    },
    waitForChat_text: {
        'ja': '話しかけられるまで待つ',
        'ja-Hira': 'はなしかけられるまでまつ',
        'en': 'Wait until you are spoken to',
    },
    waitForBreakBlock_text: {
        'ja': 'プレイヤーがブロックを壊すまで待つ',
        'ja-Hira': 'プレイヤーがブロックをこわすまでまつ',
        'en': 'Wait until the player breaks the block',
    },
    grabItem_text: {
        'ja': '[SLOT]番のアイテムを持つ',
        'ja-Hira': '[SLOT]ばんのアイテムをもつ',
        'en': 'Holding item [SLOT]',
    },
    passItem_text: {
        'ja': '[SLOT]番のアイテムを[TARGET]に渡す',
        'ja-Hira': '[SLOT]ばんのアイテムを[TARGET]にわたす',
        'en': 'Pass item [SLOT] to [TARGET]',
    },
    setItem_text: {
        'ja': '[SLOT]番に[NAME]をセット',
        'ja-Hira': '[SLOT]ばんに[NAME]をセット',
        'en': 'Set [NAME] at slot [SLOT]',
    },
    render_view_text: {
        'ja': '実行画面を[FLAG]にする',
        'ja-Hira': 'じっこうがめんを[FLAG]にする',
        'en': 'Toggle the game screen',
    },
    reset_text: {
        'ja': '前の状態に戻す',
        'ja-Hira': 'まえのじょうたいにもどす',
        'en': 'reset',
    },
    move_text: {
        'ja': '[MOVE_MENU]に１移動',
        'ja-Hira': '[MOVE_MENU]に１いどう',
        'en': 'Move 1 [MOVE_MENU]',
    },
    turn_text: {
        'ja': '[TURN_MENU]方向を向く',
        'ja-Hira': '[TURN_MENU]ほうこうをむく',
        'en': 'Turn toward [TURN_MENU]',
    },
    place_text: {
        'ja': '[DIR_MENU]に[SIDE_MENU]で置く',
        'ja-Hira': '[DIR_MENU]に[SIDE_MENU]でおく',
        'en': 'Place in [DIR_MENU] by [SIDE_MENU]',
    },
    dig_text: {
        'ja': '[DIR_MENU]を壊す',
        'ja-Hira': '[DIR_MENU]をこわす',
        'en': 'Break [DIR_MENU]',
    },
    useItem_text: {
        'ja': '[DIR_MENU]にアイテムを使う',
        'ja-Hira': '[DIR_MENU]にアイテムをつかう',
        'en': 'Use items in [DIR_MENU]',
    },
    action_text: {
        'ja': '[DIR_MENU]の装置を動かす',
        'ja-Hira': '[DIR_MENU]のそうちをうごかす',
        'en': 'Activate the [DIR_MENU] device',
    },
    putToChest_text: {
        'ja': '[DIR_MENU]にアイテムを入れる',
        'ja-Hira': '[DIR_MENU]にアイテムをいれる',
        'en': 'Put an item in [DIR_MENU]',
    },
    takeFromChest_text: {
        'ja': '[DIR_MENU]からアイテムを取り出す',
        'ja-Hira': '[DIR_MENU]からアイテムを取り出す',
        'en': 'Take an item in [DIR_MENU]',
    },
    getPosition_text: {
        'ja': '自分の座標を調べる',
        'ja-Hira': 'じぶんのざひょうをしらべる',
        'en': 'Check my location',
    },
    moveRun_text: {
        'ja': '[V]の力で歩く',
        'ja-Hira': '[V]のちからであるく',
        'en': 'Walk powered by [V]',
    },
    jump_text: {
        'ja': '[V]の力でジャンプする',
        'ja-Hira': '[V]のちからでジャンプする',
        'en': 'Jump powered by [V]',
    },
    turnX_text: {
        'ja': '[degrees]度回る',
        'ja-Hira': '[degrees]どまわる',
        'en': 'Turn [degrees] degrees',
    },
    makeSound_text: {
        'ja': '鳴く',
        'ja-Hira': 'なく',
        'en': 'Make a sound',
    },
    attack_text: {
        'ja': '攻撃する',
        'ja-Hira': 'こうげきする',
        'en': 'Attack',
    },
    sendChat_text: {
        'ja': '[TEXT]と言う',
        'ja-Hira': '[TEXT]という',
        'en': 'Say [TEXT]',
    },
    setMark_text: {
        'ja': '足元に[name]と名前をつける',
        'ja-Hira': 'あしもとに[name]となまえをつける',
        'en': 'Mark the spot as [name]',
    },
    moveMark_text: {
        'ja': '[name]の位置に移動',
        'ja-Hira': '[name]のいちにいどう',
        'en': 'Return to [name]',
    },
    hasItemInSlot_text: {
        'ja': '[SLOT]番にアイテムがある？',
        'ja-Hira': '[SLOT]ばんにアイテムがある？',
        'en': 'Is there an item in slot [SLOT]?',
    },
    isBlocked_text: {
        'ja': '[DIR_MENU]にブロックがある？',
        'ja-Hira': '[DIR_MENU]にブロックがある？',
        'en': 'Is there a block in [DIR_MENU]?',
    },
    isCanDig_text: {
        'ja': '[DIR_MENU]のブロックが壊せる？',
        'ja-Hira': '[DIR_MENU]のブロックがこわせる？',
        'en': 'Can break the [DIR_MENU]?',
    },
    blockColor_text: {
        'ja': '[color]色のブロック',
        'ja-Hira': '[color]いろのブロック',
        'en': '[color] colored block',
    },
    getTargetDistance_text: {
        'ja': '[TARGET]までの距離',
        'ja-Hira': '[TARGET]までのきょり',
        'en': 'Distance to [TARGET]',
    },
    teleport_text: {
        'ja': '[COORDINATE][X][Y][Z]座標へ移動',
        'ja-Hira': '[COORDINATE][X][Y][Z]ざひょうへてんそう',
        'en': 'Teleport to [COORDINATE][X][Y][Z]',
    },
    lookAtPosition_text: {
        'ja': '[COORDINATE][X][Y][Z]座標を見る',
        'ja-Hira': '[COORDINATE][X][Y][Z]ざひょうをみる',
        'en': 'Look at [COORDINATE][X][Y][Z]',
    },
    placeX_text: {
        'ja': '[COORDINATE][X][Y][Z]座標に[SIDE_MENU]で置く',
        'ja-Hira': '[COORDINATE][X][Y][Z]のいちに[SIDE_MENU]でおく',
        'en': 'Set block at [COORDINATE][X][Y][Z] by [SIDE_MENU]',
    },
    digX_text: {
        'ja': '[COORDINATE][X][Y][Z]座標を壊す',
        'ja-Hira': '[COORDINATE][X][Y][Z]にあるものをこわす',
        'en': 'Dig at [COORDINATE][X][Y][Z]',
    },
    useItemX_text: {
        'ja': '[COORDINATE][X][Y][Z]座標に使う',
        'ja-Hira': '[COORDINATE][X][Y][Z]のいちにつかう',
        'en': 'Use item at [COORDINATE][X][Y][Z]',
    },
    addForce_text: {
        'ja': '[X][Y][Z]で加速',
        'ja-Hira': '[X][Y][Z]でかそく',
        'en': 'Add force by [X][Y][Z]',
    },
    getChatData_text: {
        'ja': '話しかけられた[CHAT_MENU]',
        'ja-Hira': 'はなしかけられた[CHAT_MENU]',
        'en': 'Spoken to about [CHAT_MENU]',
    },
    getRedStoneData_text: {
        'ja': 'レッドストーン信号[REDSTONE_MENU]',
        'ja-Hira': 'レッドストーンしんごう[REDSTONE_MENU]',
        'en': '[REDSTONE_MENU] of the redstone signal',
    },
    getBreakBlockData_text: {
        'ja': '壊れたブロック[BREAK_BLOCK_MENU]',
        'ja-Hira': 'こわれたブロック[BREAK_BLOCK_MENU]',
        'en': '[BREAK_BLOCK_MENU] of broken block',
    },
    getTargetData_text: {
        'ja': 'クリックした対象の[TARGET_MENU]',
        'ja-Hira': 'クリックしたたいしょうの[TARGET_MENU]',
        'en': '[TARGET_MENU] of the clicked target',
    },
    getResult_text: {
        'ja': 'デバッグ情報',
        'ja-Hira': 'デバッグじょうほう',
        'en': 'debug information',
    },
    inspect_text: {
        'ja': '[COORDINATE][X][Y][Z]座標のブロック',
        'ja-Hira': '[COORDINATE][X][Y][Z]にあるブロック',
        'en': 'The block at [COORDINATE][X][Y][Z]',
    },
    distanceTo_text: {
        'ja': '[COORDINATE][X][Y][Z]座標までの距離',
        'ja-Hira': '[COORDINATE][X][Y][Z]ざひょうまでのきょり',
        'en': 'Distance to [COORDINATE][X][Y][Z]',
    },
    chatGPT_text: {
        'ja': 'AIに[TEXT]と聞く',
        'ja-Hira': 'えーあいに[TEXT]ときく',
        'en': 'Ask AI [TEXT]',
    },
    execCommand_text: {
        'ja': '/[TEXT]',
        'ja-Hira': '/[TEXT]',
        'en': '/[TEXT]',
    },
    mnu_front_text: {
        'ja': '前',
        'ja-Hira': 'まえ',
        'en': 'Front',
    },
    mnu_back_text: {
        'ja': '後ろ',
        'ja-Hira': 'うしろ',
        'en': 'Back',
    },
    mnu_up_text: {
        'ja': '上',
        'ja-Hira': 'うえ',
        'en': 'Up',
    },
    mnu_down_text: {
        'ja': '下',
        'ja-Hira': 'した',
        'en': 'Down',
    },
    mnu_left_text: {
        'ja': '左',
        'ja-Hira': 'ひだり',
        'en': 'Left',
    },
    mnu_right_text: {
        'ja': '右',
        'ja-Hira': 'みぎ',
        'en': 'Right',
    },
    mnu_owner_text: {
        'ja': '飼い主',
        'ja-Hira': 'かいぬし',
        'en': 'Owner',
    },
    mnu_world_text: {
        'ja': 'ワールド',
        'ja-Hira': 'ワールド',
        'en': 'World',
    },
    mnu_x_text: {
        'ja': 'X座標',
        'ja-Hira': 'Xざひょう',
        'en': 'X',
    },
    mnu_y_text: {
        'ja': 'Y座標',
        'ja-Hira': 'Yざひょう',
        'en': 'Y',
    },
    mnu_z_text: {
        'ja': 'Z座標',
        'ja-Hira': 'Zざひょう',
        'en': 'Z',
    },
    mnu_name_text: {
        'ja': '名前',
        'ja-Hira': 'なまえ',
        'en': 'Name',
    },
    mnu_target_name_text: {
        'ja': '相手の名前',
        'ja-Hira': 'あいてのなまえ',
        'en': 'Target name',
    },
    mnu_target_type_text: {
        'ja': '相手の種類',
        'ja-Hira': 'あいてのしゅるい',
        'en': 'Target type',
    },
    mnu_ap_text: {
        'ja': '最も近いプレイヤー',
        'ja-Hira': 'いちばんちかいプレイヤー',
        'en': 'Nearest player',
    },
    mnu_ar_text: {
        'ja': 'ランダムプレイヤー',
        'ja-Hira': 'らんだむプレイヤー',
        'en': 'Random player',
    },
    mnu_aa_text: {
        'ja': '全てのプレイヤー',
        'ja-Hira': 'ぜんぶのプレイヤー',
        'en': 'All players',
    },
    mnu_ae_text: {
        'ja': '全てのエンティティ',
        'ja-Hira': 'ぜんぶのエンティティ',
        'en': 'All entities',
    },
    mnu_front_any_text: {
        'ja': '前方のなにか',
        'ja-Hira': 'まえにあるなにか',
        'en': 'Something ahead',
    },
    mnu_up_any_text: {
        'ja': '上方のなにか',
        'ja-Hira': 'まえにあるなにか',
        'en': 'Something above',
    },
    mnu_down_any_text: {
        'ja': '下方のなにか',
        'ja-Hira': 'まえにあるなにか',
        'en': 'Something below',
    },
    mnu_player_name_text: {
        'ja': '人の名前',
        'ja-Hira': 'まえにあるなにか',
        'en': 'Something below',
    },
    mnu_content_text: {
        'ja': '内容',
        'ja-Hira': 'ないよう',
        'en': 'content',
    },
    mnu_old_value_text: {
        'ja': '前の値',
        'ja-Hira': 'まえのあたい',
        'en': 'Old value',
    },
    mnu_new_value_text: {
        'ja': '新しい値',
        'ja-Hira': 'あたらしいあたい',
        'en': 'New value',
    },
    default_message_text: {
        'ja': 'メッセージ',
        'ja-Hira': 'メッセージ',
        'en': 'message',
    },
    default_event_text: {
        'ja': 'イベント',
        'ja-Hira': 'イベント',
        'en': 'event',
    },
    default_hello_text: {
        'ja': 'こんにちは',
        'ja-Hira': 'こんにちは',
        'en': 'hello',
    },
    default_home_text: {
        'ja': 'ホーム',
        'ja-Hira': 'ホーム',
        'en': 'home',
    },
    default_ai_text: {
        'ja': 'こんにちはの英訳は？',
        'ja-Hira': 'そらはどうして青いの？',
        'en': 'where is the blue sky?',
    },
    mnu_on_text: {
        'ja': 'オン',
        'ja-Hira': 'オン',
        'en': 'On',
    },
    mnu_off_text: {
        'ja': 'オフ',
        'ja-Hira': 'オフ',
        'en': 'Off',
    },
    mnu_side_none_text: {
        'ja': '指定なし',
        'ja-Hira': 'していなし',
        'en': 'Default',
    },
    mnu_side_top_text: {
        'ja': '上付き',
        'ja-Hira': 'うえつき',
        'en': 'Top',
    },
    mnu_side_bottom_text: {
        'ja': '下付き',
        'ja-Hira': 'したつき',
        'en': 'Bottom',
    },
    mnu_side_right_text: {
        'ja': '右向き',
        'ja-Hira': 'みぎむき',
        'en': 'Right',
    },
    mnu_side_left_text: {
        'ja': '左向き',
        'ja-Hira': 'ひだりむき',
        'en': 'Left',
    },
    mnu_side_front_text: {
        'ja': '前向き',
        'ja-Hira': 'まえむき',
        'en': 'Front',
    },
    mnu_side_back_text: {
        'ja': '後ろ向き',
        'ja-Hira': 'うしろむき',
        'en': 'Back',
    },
};
const localse = ['en', 'ja', 'ja-Hira'];

module.exports = { translation, localse}
