// scratch-vm/src/extensions/scratch3_esp32serial/translation.js

export const Zumi_Config = {
    title: { en: 'Zumi AI Settings', ko: 'Zumi AI 설정' },
    actionMode: { en: 'Operation Mode', ko: '작동 모드' },
    modeSequential: { en: 'Sequential', ko: '순차 모드' },
    modeImmediate: { en: 'Immediate', ko: '즉시 모드' },
    save: { en: 'Save', ko: '저장' },
    close: { en: 'Close', ko: '닫기' },

};

export const Form_Name = {
    'en': 'Zumi AI',
    'ko': '주미 AI'
    // 다른 언어 추가 가능
};


export const Form_groupConnect = {
    'en': ' Connect', // 또는 ' Connection'
    'ko': ' 연결 & 설정',
    // 다른 언어 추가 가능
};
export const Form_groupLED = {
    'en': ' LED blocks',
    'ko': ' LED 블록',
};
export const Form_groupDisplay = {
    'en': ' Display blocks', // 'Screen'도 가능하지만, 'Display'가 장치 화면 기능에 더 적합
    'ko': ' 화면 블록',
};
export const Form_groupText = {
    'en': ' Text blocks', // 또는 ' Text Input'
    'ko': ' 글자 블록',
};
export const Form_groupMove = {
    'en': ' Movement blocks', // 'Move' (동사) 대신 'Movement' (명사)가 그룹 명칭으로 더 자연스러움
    'ko': ' 이동 블록',
};
export const Form_groupSensors = {
    'en': ' Sensor Values blocks', // '센서 값들'을 명확하게 표현
    'ko': ' 센서 값 블록',
};
export const Form_groupAI = {
    'en': ' AI blocks',
    'ko': ' AI 블록',
};

//---------------------------------------------------//

export const Form_connectPort = {
    'en': 'connect to Zumi AI',
    'ko': '주미 AI 연결 하기',
};

export const Form_disconnectPort = {
    'en': 'disconnect',
    'ko': '연결 끊기',
};

// export const Form_getConnectState = {
//     'en': 'Zumi AI connection status',
//     'ko': '주미 AI 연결 상태',
// };

//---------------------------------------------------//

export const Form_ledControlByColor = {
    'en': 'Set LED color to [COLOR]',
    'ko': 'LED 색상을 [COLOR] 로 설정',
};

export const Form_ledControl = {
    'en': 'Set LED to red: [R_VALUE] green: [G_VALUE] blue: [B_VALUE]',
    'ko': 'LED 색상을 빨강: [R_VALUE] 초록: [G_VALUE] 파랑: [B_VALUE] 로 설정',
};

export const Form_ledPattern = {
    'en': 'Set LED pattern [PATTERN] for [TIME] seconds',
    'ko': 'LED 패턴[PATTERN] 시간[TIME] 설정',
};

//---------------------------------------------------//

export const Form_play_sound_command = {
    'en': 'Play sound [NOTE]',
    'ko': '사운드 재생 [NOTE]',
};

export const Form_camera_command = {
    'en': 'Change display to [STATE]',
    'ko': '화면 변경 [STATE]',
};

export const Form_emotion_command = {
    'en': 'Change expression to [EMOTION]',
    'ko': '표정 변경 [EMOTION]',
};

//---------------------------------------------------//

export const Form_display_text_command = {
    'en': '[TEXT] input [STATE] line change',
    'ko': '[TEXT] 쓰고 줄바꿈 [STATE]',
};

export const Form_display_text_add_command = {
    'en': '[TEXT] add [STATE] line change',
    'ko': '[TEXT] 이어쓰고 줄바꿈 [STATE]',
};

export const Form_display_text_set_command = {
    'en': 'text color [TEXT_COLOR_VALUE] size [TEXT_SIZE_VALUE] set',
    'ko': '글자의 색상 [TEXT_COLOR_VALUE] 크기를 [TEXT_SIZE_VALUE] 설정',
};

export const Form_display_text_pos_command = {
    'en': 'text pos X [TEXT_X_VALUE], pos Y [TEXT_Y_VALUE] set',
    'ko': '글자의 X [TEXT_X_VALUE], Y [TEXT_Y_VALUE] 위치 설정',
};

export const Form_display_text_clear_command = {
    'en': 'clear text',
    'ko': '글자 지우기',
};

//---------------------------------------------------//
export const Form_move_stop = {
    'en': 'Stop motor action',
    'ko': '모터의 동작을 멈춤',
};

export const Form_move_dist = {
    'en': 'Move [MOVE_DIST] cm in [MOVE_DIRECTION] direction at [MOVE_SPEED] speed',
    'ko': '[MOVE_DIRECTION] 방향으로 [MOVE_SPEED] 속도로 거리만큼 [MOVE_DIST] cm 이동',
};
export const Form_move_dist_quick = {
    'en': 'Quickly move [MOVE_DIST] cm in [MOVE_DIRECTION] direction',
    'ko': '빠르게 [MOVE_DIRECTION] 방향으로 거리만큼 [MOVE_DIST] cm 이동',
};

export const Form_turn_angle = {
    'en': 'Turn [TURN_ANGLE] degrees in [TURN_DIRECTION] direction at [TURN_SPEED] speed',
    'ko': '[TURN_DIRECTION] 방향으로 [TURN_ANGLE] 도를 [TURN_SPEED] 속도로 회전',
};
export const Form_turn_angle_quick = {
    'en': 'Quickly turn [TURN_ANGLE] degrees in [TURN_DIRECTION] direction',
    'ko': '빠르게 [TURN_DIRECTION] 방향으로 [TURN_ANGLE] 도 회전',
};

export const Form_control_motor = {
    'en': 'Run [MOTOR_SELECTION] motor in [MOVE_DIRECTION] direction at [MOVE_SPEED] speed',
    'ko': '[MOTOR_SELECTION] 모터를 [MOVE_DIRECTION] 방향으로 [MOVE_SPEED] 속도로 동작',
};

export const Form_control_motor_time = {
    'en': 'Run left motor in [MOVE_DIRECTION1] at [MOVE_SPEED1] and right motor in [MOVE_DIRECTION2] at [MOVE_SPEED2] for [MOVE_TIME] seconds',
    'ko': '[MOVE_TIME] 초 동안 왼쪽모터는 [MOVE_DIRECTION1] 방향으로 [MOVE_SPEED1] 속도로 오른쪽 모터는 [MOVE_DIRECTION2] 방향으로 [MOVE_SPEED2]로 동작',
};

export const Form_move_infinite = {
    'en': 'Keep moving in [MOVE_DIRECTION] direction at [MOVE_SPEED] speed',
    'ko': '[MOVE_DIRECTION] 방향으로 [MOVE_SPEED] 속도로 계속 이동',
};

export const Form_go_sensor = {
    'en': 'Go straight at [MOVE_SPEED] speed, stop if left sensor < [LEFT_SENSOR] or right sensor < [RIGHT_SENSOR]',
    'ko': '[MOVE_SPEED] 속도로 직진, 좌 센서 [LEFT_SENSOR] / 우 센서 [RIGHT_SENSOR] 이하 감지 시 멈춤',
};

export const Form_linefollower = {
    'en': 'Follow line for [LINE_TIME] seconds at [MOVE_SPEED] speed, stop if left < [LEFT_SENSOR] / right < [RIGHT_SENSOR] / center < [CENTER_SENSOR]',
    'ko': '선을 따라 [LINE_TIME] 초 동안 [MOVE_SPEED] 속도로 직진, 좌 센서 [LEFT_SENSOR] / 우 센서 [RIGHT_SENSOR] / 가운데 센서 [CENTER_SENSOR] 이하 감지 시 멈춤 ',
};

export const Form_linefollower_distance = {
    'en': 'Follow line for [LINE_DISTANCE] distance at [MOVE_SPEED] speed',
    'ko': '선을 따라 [MOVE_SPEED] 속도로 [LINE_DISTANCE] 거리만큼 이동 ',
};

export const Form_inefollower_infinite = {
    'en': 'Keep following line at [MOVE_SPEED] speed',
    'ko': '선을 따라 [MOVE_SPEED] 속도로 계속 이동 ',
};
//---------------------------------------------------//

export const Form_getIRSensorReading = {
    'en': 'Get [SENSOR] IR sensor value',
    'ko': '[SENSOR] IR 센서 값',
};

export const Form_IRSensorReading_FL = {
    en: 'Front Left IR Sensor',
    ko: '앞 왼쪽 IR 센서',
};

export const Form_IRSensorReading_FR = {
    en: 'Front Right IR Sensor',
    ko: '앞 오른쪽 IR 센서',
};

export const Form_IRSensorReading_BL = {
    en: 'Bottom Left IR Sensor',
    ko: '바닥 왼쪽 IR 센서',
};

export const Form_IRSensorReading_BC = {
    en: 'Bottom Center IR Sensor',
    ko: '바닥 가운데 IR 센서',
};

export const Form_IRSensorReading_BR = {
    en: 'Bottom Right IR Sensor',
    ko: '바닥 오른쪽 IR 센서',
};

export const Form_getBatReading = {
    'en': 'Get battery level',
    'ko': '배터리 잔량',
};

export const Form_getBtnReading = {
    'en': 'Get button value',
    'ko': '버튼 값',
};

export const Form_boolean_getBtnReading = {
    'en': '[BTN_SEL] button is [BTN_STATE]',
    'ko': '[BTN_SEL] 버튼이 [BTN_STATE]',
};

//---------------------------------------------------//

export const Form_detector_state_select = {
    'en': '[DETECTOR] detection [STATE]',
    'ko': '[DETECTOR] 감지 [STATE]',
};

export const Form_getDetectorState = {
    'en': 'Get detection state value',
    'ko': '감지 상태 값',
};

export const Form_getHumanDetectReading = {
    'en': 'Human face [DETECT]',
    'ko': '사람 얼굴 [DETECT]',
};

export const Form_getCatDetectReading = {
    'en': 'Cat face [DETECT]',
    'ko': '고양이 얼굴 [DETECT]',
};

export const Form_getMarkerDetectReading = {
    'en': 'Marker [DETECT]',
    'ko': '마커 [DETECT]',
};

export const Form_getColorDetectReading = {
    'en': 'Color [DETECT]',
    'ko': '색상 [DETECT]',
};


export const Form_boolean_face_cat_detect = {
    'en': 'When [FACE_SEL] is detected',
    'ko': '[FACE_SEL] 이 감지 되었을 때',
};

export const Form_boolean_color_detect = {
    'en': 'When [COLOR_SEL] is detected',
    'ko': '[COLOR_SEL] 이 감지 되었을 때',
};

export const Form_boolean_marker_detect = {
    'en': 'When marker [ID_SEL] is detected',
    'ko': '마커 [ID_SEL] 이 감지 되었을 때',
};

//---------------------------------------------------//


export const Funtion_getBtnReading = {
    red: { en: 'red', ko: '빨강' },
    blue: { en: 'blue', ko: '파랑' },
    green: { en: 'green', ko: '초록' },
    yellow: { en: 'yellow', ko: '노랑' },
    none: { en: 'none', ko: '없음' }
};

export const Funtion_getDetectorState = {
    face: { en: 'Face', ko: '얼굴' },
    cat: { en: 'Cat', ko: '고양이' },
    color: { en: 'Color', ko: '색상' },
    marker: { en: 'Marker', ko: '마커' },
    on: { en: 'ON', ko: '켜짐' }, // 상태 값도 다국어 처리
    off: { en: 'OFF', ko: '꺼짐' },
    separator: { en: ': ', ko: ':' } // 라벨과 상태를 구분하는 기호
};

//---------------------------------------------------//
export const Menu_lineChangeSelector = {
    on: { en: 'on', ko: '켜기' },
    off: { en: 'off', ko: '끄기' },
};

//---------------------------------------------------//
// export const Menu_detectorBtn = {
//     red: { en: 'red', ko: '빨강' },
//     blue: { en: 'blue', ko: '파랑' },
//     green: { en: 'green', ko: '초록' },
//     yellow: { en: 'yellow', ko: '노랑' },
// };

export const Menu_btnPressed = {
    pressed: { en: 'when pressed', ko: '눌렸을 때' },
    notPressed: { en: 'when not pressed', ko: '눌리지 않았을 때' },
};

export const Menu_colordetector = {
    red: { en: 'red', ko: '빨강' },
    orange: { en: 'orange', ko: '주황' },
    yellow: { en: 'yellow', ko: '노랑' },
    green: { en: 'green', ko: '초록' },
    cyan: { en: 'cyan', ko: '청록' },
    blue: { en: 'blue', ko: '파랑' },
    purple: { en: 'purple', ko: '보라' },
};

export const Menu_detectorSelector = {
    face: { en: 'Face', ko: '얼굴' },
    cat: { en: 'Cat', ko: '고양이' },
    color: { en: 'Color', ko: '색상' },
    marker: { en: 'Marker', ko: '마커' },
};

export const Menu_screenSelector = {
    camera: { en: 'Camera', ko: '카메라' },
    emotion: { en: 'Emotion', ko: '표정' },
};

export const Menu_soundSelector = {
    catMeow: { en: 'Cat Meow', ko: '고양이 울음소리' },
    cameraShutter: { en: 'Camera Shutter', ko: '카메라 셔터' },
    fail1: { en: 'Fail Sound 1', ko: '실패음1' },
    fail2: { en: 'Fail Sound 2', ko: '실패음2' },
    horn1: { en: 'Horn 1', ko: '경적1' },
    horn2: { en: 'Horn 2', ko: '경적2' },
    siren: { en: 'Siren', ko: '사이렌' },
    success: { en: 'Success', ko: '성공' },
};

export const Menu_emotionSelector = {
    off: { en: 'Off', ko: '끄기' },
    stop: { en: 'Stop', ko: '정지' },
    blink: { en: 'Blink', ko: '깜박임' },
    smile: { en: 'Smile', ko: '웃음' },
    love: { en: 'Love', ko: '사랑' },
    shock: { en: 'Shock', ko: '충격' },
    surprise: { en: 'Surprise', ko: '놀람' },
    joy: { en: 'Joy', ko: '기쁨' },
    anger: { en: 'Anger', ko: '분노' },
    sleepy: { en: 'Sleepy', ko: '졸림' },
    sadness: { en: 'Sadness', ko: '슬픔' },
    dizzy: { en: 'Dizzy', ko: '어지러움' },
    sleep: { en: 'Sleep', ko: '잠들기' },
    wink: { en: 'Wink', ko: '윙크' },
    detect: { en: 'Detect', ko: '감지' },
};

export const Menu_ledPattern = {
    on: { en: 'Stay On', ko: '켜짐 유지' },
    blink: { en: 'Blink', ko: '깜박임' },
    doubleBlink: { en: 'Double Blink', ko: '두 번 깜박임' },
    fadeInOut: { en: 'Fade In/Out', ko: '밝아졌다 어두어짐' },
    fadeOut: { en: 'Fade Out', ko: '점점 어두워짐' },
    fadeIn: { en: 'Fade In', ko: '점점 밝아짐' },
    rainbow: { en: 'Rainbow Cycle', ko: '무지개색 변환' },
};


export const Menu_moveDirection = {
    forward: { en: 'forward', ko: '앞' },
    backward: { en: 'backward', ko: '뒤' },
};

export const Menu_motorDirection = {
    stop: { en: 'Stop', ko: '정지' },                 // value: '0'
    forward: { en: 'Forward Direction', ko: '전진 방향' }, // value: '1'
    backward: { en: 'Backward Direction', ko: '후진 방향' },  // value: '2'
};

export const Menu_turnDirection = {
    left: { en: 'Left', ko: '왼쪽' }, // value: '0' (Left Turn)
    right: { en: 'Right', ko: '오른쪽' }, // value: '1' (Right Turn)
};

export const Menu_moveSpeed = {
    slow: { en: 'Slow', ko: '느리게' },     // value: '1'
    normal: { en: 'Normal', ko: '보통' },   // value: '2'
    fast: { en: 'Fast', ko: '빠르게' },     // value: '3'
};

export const Menu_textColorSelector = {
    current: { en: 'Current Color', ko: '현재 색상' },  // value: '0'
    white: { en: 'White', ko: '흰색' },                  // value: '1'
    black: { en: 'Black', ko: '검정' },                  // value: '2'
    navy: { en: 'Navy', ko: '남색' },                    // value: '3'
    blue: { en: 'Blue', ko: '파랑' },                    // value: '4'
    skyBlue: { en: 'Sky Blue', ko: '하늘색' },             // value: '5'
    cyan: { en: 'Cyan', ko: '청록색' },                   // value: '6'
    teal: { en: 'Teal', ko: '틸색' },                     // value: '7'
    green: { en: 'Green', ko: '초록' },                   // value: '8'
    lightGreen: { en: 'Light Green', ko: '연두' },        // value: '9'
    lime: { en: 'Lime', ko: '라임색' },                   // value: '10'
    yellow: { en: 'Yellow', ko: '노랑' },                  // value: '11'
    amber: { en: 'Amber', ko: '호박색' },                  // value: '12'
    orange: { en: 'Orange', ko: '주황' },                  // value: '13'
    darkOrange: { en: 'Dark Orange', ko: '짙은 주황' },    // value: '14'
    brown: { en: 'Brown', ko: '갈색' },                   // value: '15'
    blueGray: { en: 'Blue Gray', ko: '청회색' },           // value: '16'
    gray: { en: 'Gray', ko: '회색' },                     // value: '17'
};

export const Menu_textSizeSelector = {
    current: { en: 'Current Size', ko: '현재 크기' }, // value: '0'
    size1: { en: '1', ko: '1' },                     // value: '1'
    size2: { en: '2', ko: '2' },                     // value: '2'
    size3: { en: '3', ko: '3' },                     // value: '3'
    size4: { en: '4', ko: '4' },                     // value: '4'
    size5: { en: '5', ko: '5' },                     // value: '5'
};

export const Menu_irSensorSelector = {
    frontRight: { en: 'Front Right', ko: '앞 오른쪽' }, // value: 'senFR'
    frontLeft: { en: 'Front Left', ko: '앞 왼쪽' },   // value: 'senFL'
    bottomRight: { en: 'Bottom Right', ko: '바닥 오른쪽' }, // value: 'senBR'
    bottomLeft: { en: 'Bottom Left', ko: '바닥 왼쪽' },   // value: 'senBL'
    bottomCenter: { en: 'Bottom Center', ko: '바닥 가운데' }, // value: 'senBC'
};

export const Menu_catFaceSelector = {
    state: { en: 'Detection State', ko: '감지 상태' },  // value: 'zumiCatDetected'
    xCoord: { en: 'X Coordinate', ko: 'X 좌표' },     // value: 'zumiCatCenter[0]'
    yCoord: { en: 'Y Coordinate', ko: 'Y 좌표' },     // value: 'zumiCatCenter[1]'
};


export const Menu_humanFaceSelector = {
    state: { en: 'Detection State', ko: '감지 상태' },  // value: 'zumiFaceDetected'
    xCoord: { en: 'X Coordinate', ko: 'X 좌표' },     // value: 'zumiFaceCenter[0]'
    yCoord: { en: 'Y Coordinate', ko: 'Y 좌표' },     // value: 'zumiFaceCenter[1]'
};

export const Menu_markerSelector = {
    id: { en: 'Detection ID', ko: '감지 ID' },         // value: 'zumiMarkerDetected'
    xCoord: { en: 'X Coordinate', ko: 'X 좌표' },     // value: 'zumiMarkerCenter[0]'
    yCoord: { en: 'Y Coordinate', ko: 'Y 좌표' },     // value: 'zumiMarkerCenter[1]'
};

export const Menu_colorSelector = {
    color: { en: 'Detected Color', ko: '감지 색상' },  // value: 'zumiColorDetected'
    xCoord: { en: 'X Coordinate', ko: 'X 좌표' },     // value: 'zumiColorCenter[0]'
    yCoord: { en: 'Y Coordinate', ko: 'Y 좌표' },     // value: 'zumiColorCenter[1]'
};