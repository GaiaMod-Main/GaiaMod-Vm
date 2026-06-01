// scratch-vm/src/extensions/scratch3_esp32serial/index.js
const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');

const {
    Zumi_Config,

    Form_Name,

    Form_groupConnect,
    Form_groupLED,
    Form_groupDisplay,
    Form_groupText,
    Form_groupMove,
    Form_groupSensors,
    Form_groupAI,

    Form_connectPort,
    Form_disconnectPort,
    Form_getConnectState,

    Form_ledControlByColor,
    Form_ledControl,
    Form_ledPattern,

    Form_play_sound_command,
    Form_camera_command,
    Form_emotion_command,

    Form_display_text_command,
    Form_display_text_add_command,
    Form_display_text_set_command,
    Form_display_text_pos_command,
    Form_display_text_clear_command,

    Form_move_stop,
    Form_move_dist,
    Form_move_dist_quick,
    Form_turn_angle,
    Form_turn_angle_quick,
    Form_control_motor,
    Form_control_motor_time,
    Form_move_infinite,
    Form_go_sensor,
    Form_linefollower,
    Form_linefollower_distance,
    Form_inefollower_infinite,


    Form_getIRSensorReading,

    Form_IRSensorReading_FL,
    Form_IRSensorReading_FR,
    Form_IRSensorReading_BL,
    Form_IRSensorReading_BC,
    Form_IRSensorReading_BR,

    Form_getBatReading,
    Form_getBtnReading,
    Form_boolean_getBtnReading,

    Form_detector_state_select,
    Form_getDetectorState,

    Form_getHumanDetectReading,
    Form_getCatDetectReading,
    Form_getMarkerDetectReading,
    Form_getColorDetectReading,

    Form_boolean_face_cat_detect,
    Form_boolean_color_detect,
    Form_boolean_marker_detect,

    Funtion_getBtnReading,
    Funtion_getDetectorState,

    Menu_lineChangeSelector,
    //Menu_detectorBtn,
    Menu_btnPressed,

    Menu_colordetector,
    Menu_detectorSelector,

    Menu_screenSelector,
    Menu_soundSelector,
    Menu_emotionSelector,
    Menu_ledPattern,
    Menu_moveDirection,

    Menu_motorDirection,
    Menu_turnDirection,
    Menu_moveSpeed,

    Menu_textColorSelector,
    Menu_textSizeSelector,
    Menu_irSensorSelector,

    Menu_catFaceSelector,


    Menu_humanFaceSelector,
    Menu_markerSelector,
    Menu_colorSelector,

} = require('./translation');


const iconURI = 'data:image/png;base64,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';

let theLocale = null;

//CommandType ENUM 변환 (명령어 코드)
const CommandType = {
    COMMAND_NONE: 0,
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 2,
    COMMAND_RIGHT: 3,
    COMMAND_GOBACK: 4,
    COMMAND_WAIT: 5,
    COMMAND_WAIT1: 6,
    COMMAND_SPEAK: 7,
    COMMAND_HUMAN: 8,
    COMMAND_HAND: 9,
    COMMAND_LED: 10,

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 25,

    COMMAND_GO_UNTIL_DIST: 26,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 28,
    COMMAND_GO_INFINITE: 29,
    COMMAND_TRACE_INFINITE: 30,

    COMMAND_LED_CONTROL: 31,
    COMMAND_MOTOR1_INFINITE: 32,
    COMMAND_MOTOR2_INFINITE: 33,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 50,
    COMMAND_QUICK_GOBACK: 51,
    COMMAND_QUICK_LEFT: 52,
    COMMAND_QUICK_RIGHT: 53,

    COMMAND_FREE_TURN_PYTHON: 70,

    COMMAND_GOSENSOR: 100,
    COMMAND_LINE_TRACING: 101,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 201,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 230,
    COMMAND_TEXT_SET: 231,
    COMMAND_TEXT_ADD: 232,

    COMMAND_SCREEN_TOGGLE: 240,
    COMMAND_EMOTION_CHANGE: 241,
    COMMAND_PLAY_SOUND: 242,

    COMMAND_MOTOR_CALIBRATION_READ: 245,
    COMMAND_MOTOR_CALIBRATION_START: 247,
    // EndOfType: 0xFF,
};

// CommandType_SIZE ENUM 변환 (커맨드 바이트 제외한 파라미터 개수)
// 파이썬 CommandType_SIZE[].value - 1 에 해당 (예: LED SIZE 3 -> 파라미터 3개)
const CommandType_DATA_LENGTH = {
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 1,
    COMMAND_RIGHT: 1,
    COMMAND_GOBACK: 1,
    COMMAND_WAIT: 4,  // 총 4바이트 (커맨드 1 + 파라미터 3)
    COMMAND_WAIT1: 5, // 총 5바이트 (커맨드 1 + 파라미터 4)
    COMMAND_SPEAK: 8, // 총 8바이트 (커맨드 1 + 파라미터 7)
    COMMAND_HUMAN: 4, // 총 4바이트 (커맨드 1 + 파라미터 3)
    COMMAND_HAND: 9,  // 총 9바이트 (커맨드 1 + 파라미터 8)
    COMMAND_LED: 3,   // r, g, b 세 가지 파라미터

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 0,

    COMMAND_GO_UNTIL_DIST: 26,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 2,
    COMMAND_GO_INFINITE: 3,
    COMMAND_TRACE_INFINITE: 30,

    COMMAND_LED_CONTROL: 31,
    COMMAND_MOTOR1_INFINITE: 3,
    COMMAND_MOTOR2_INFINITE: 3,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 1,
    COMMAND_QUICK_GOBACK: 1,
    COMMAND_QUICK_LEFT: 1,
    COMMAND_QUICK_RIGHT: 1,

    COMMAND_FREE_TURN_PYTHON: 4,

    COMMAND_GOSENSOR: 3,
    COMMAND_LINE_TRACING: 5,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 3,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 1,
    COMMAND_TEXT_SET: 5,
    COMMAND_TEXT_ADD: 1,

    COMMAND_SCREEN_TOGGLE: 1,
    COMMAND_EMOTION_CHANGE: 1,
    COMMAND_PLAY_SOUND: 1,

    COMMAND_MOTOR_CALIBRATION_START: 0,
    COMMAND_MOTOR_CALIBRATION_READ: 0,
    // EndOfType: 0xFF,
};

// RequestType ENUM 변환
// 비트 플래그로 사용됨 (예: this._currentRequest에 OR 연산)
const RequestType = {
    REQUEST_ENTRY_FACE_DETECT: 0x01,
    REQUEST_ENTRY_COLOR_DETECT: 0x02,
    REQUEST_ENTRY_APRIL_DETECT: 0x04,
   // REQUEST_ENTRY_EULER: 0x08,
    REQUEST_ENTRY_CAT_DETECT: 0x10,
};

// PacketDataIndex Enum을 대체하는 상수 객체
const PacketIndex = {
    // 패킷 헤더 길이 (파이썬의 self.headerLen)
    // HEADER_LENGTH: 2,
    // 상태 플래그
    DATA_COM: 2,
    DATA_INFO: 2, // 파이썬과 동일하게 2
    DATA_REQ: 3,
    DATA_PSTAT: 4,

    // IR 센서
    DATA_SEN_FR: 5,
    DATA_SEN_FL: 6,
    DATA_SEN_BR: 7,
    DATA_SEN_BC: 8,
    DATA_SEN_BL: 9,

    // 객체 감지 및 좌표
    DATA_DETECT_FACE: 10,
    DATA_DETECT_FACE_X: 11,
    DATA_DETECT_FACE_Y: 12,

    DATA_DETECT_COLOR: 13,
    DATA_DETECT_COLOR_X: 14,
    DATA_DETECT_COLOR_Y: 15,

    DATA_DETECT_MARKER: 16,
    DATA_DETECT_MARKER_X: 17,
    DATA_DETECT_MARKER_Y: 18,

    // 기타
    DATA_BTN_INPUT: 19,
    DATA_BATTERY: 20,

    DATA_DETECT_CAT: 23,
    DATA_DETECT_CAT_X: 24,
    DATA_DETECT_CAT_Y: 25
};

const ActionMode = {
    MODE_SEQUENTIAL: 0,
    MODE_IMMEDIATE: 1
};

class Scratch3Esp32Bluetooth {

    // Zumi AI 장치에서 사용되는 UUID 상수
    static SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
    static CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
    static DEVICE_NAME = 'zumi';
    // [NEW] 고정 HEX 패킷 정의: 24 52 0A 00 0A 0A 0A (7 바이트)


    constructor (runtime) {

        this.checkedSendLoop = 0;

        this.testMode = 0;
        this.actionMode = ActionMode.MODE_SEQUENTIAL;

        this.characteristic = null;
        this.device = null;
        console.log("Zumi Bluetooth Extension 초기화됨.");

        this.sendingLoopTime = 150;//basic 150ms

       // the_locale = this._setLocale();
        this.runtime = runtime;
        //this.serialPort = null;
        //this.reader = null;
        this.receivedData = '';


        this.isSending = false; // 현재 전송 중인지 확인하는 플래그
        this.isLoopRunning = false; // 주기적 전송 루프 상태
        //// 전송할 단일 명령(Uint8Array)을 저장할 변수
        this.nextCommandPayload = null;

        this.tSpd1 = 0;
        this.tSpd2 = 0;
        this.tDir = 0b01000000;

        this.motorTrigger = false;

        if ('bluetooth' in navigator) {
            console.log("Web Bluetooth API가 지원됩니다.");
        } else {
            console.error("이 브라우저에서는 Web Bluetooth API를 지원하지 않습니다 (Chrome/Edge 사용 권장).");
        }

        // 통신 상태 (StateLoading)
        this.StateLoading = {
            Ready: 0x00,
            Receiving: 0x01,
            Loaded: 0x02,
            Failure: 0x03
        };

        // 패킷 섹션 (Section)
        this.Section = {
            Start: 0x00,
            Header:0x01,  // 헤더
            Data: 0x02,
            End: 0x03 // 파이썬 코드에서 Header 섹션이 Data와 통합된 것으로 보여 생략
        };

        this._current_request = 0; // AI 카메라 감지 상태

        // 패킷 길이 및 헤더 (파이썬 Receiver와 통일)
        this.PACKET_DATA_LENGTH = 24; // 파이썬 Receiver.call의 index == 23에 대응
        this.PACKET_START_BYTE1 = 0x24; // $
        this.PACKET_START_BYTE2 = 0x52; // R
        this.HEADER_LENGTH = 2; // 파이썬 SerialConnectionHandler의 headerLen

        // 스크래치 확장 클래스 생성자 (Constructor) 내에 정의될 변수들
        // this.receiverData는 최종 패킷을 저장
        this.connectState = false;         // 현재 연결 상태 (초기: false)
        this.connectionTimeoutHandler = null; // 타이머 핸들러를 저장할 변수
        this.CONNECTION_TIMEOUT_MS = 3000; // 연결 확인 타임아웃 시간 (예: 3초)

        this.receiverState = this.StateLoading.Ready;
        this.receiverSection = this.Section.Start;
        this.receiverIndex = 0;
        this.receiverBuffer = [];
        this.receiverData = [];
        //this.receiverMessage = null;
        this.receiverSectionOld = this.Section.End;

        // === [상태 플래그 및 기본 데이터] ===
        this.reqINFO = 0;
        this.reqREQ = 0;
        this.reqPSTAT = 0;
        this.btn = 0;
        this.battery = 0;

        // === [IR 센서 값] ===
        this.senFL = 0;
        this.senFR = 0;
        this.senBL = 0;
        this.senBC = 0;
        this.senBR = 0;

        // === [객체 감지 데이터] ===
        this.zumiFaceDetected = false;
        this.zumiFaceCenter = [0, 0];
        this.zumiColorDetected = 0;
        this.zumiColorCenter = [0, 0];
        this.zumiMarkerDetected = 0;
        this.zumiMarkerCenter = [0, 0];
        this.zumiCatDetected = 0;
        this.zumiCatCenter = [0, 0];


        this.connectDevice();

        this.runtime.on('PROJECT_STOP_ALL', () => {
            //"// 플래그 초기화"
            console.log("PROJECT_STOP_ALL");
           // this.move_stop();
        });

    }

    _setLocale () {
        let nowLocale = '';
        // nowLocale = formatMessage.setup().locale;
        // console.log(nowLocale)
        switch (formatMessage.setup().locale) {
        case 'ko':
            nowLocale = 'ko';
            break;
        // case 'ja':
        //     nowLocale = 'ja';
        //     break;
        default:
            nowLocale = 'en';
            break;
        }
        return nowLocale;
    }

    /**
     * 확장자 정보를 정의합니다.
     */
    getInfo () {

       // 기존의 'const locale = this.runtime.getLocale();' 이 줄을 제거해야 합니다.
       // the_locale = this._setLocale();
        //this.connectPort();
        //console.log("_setLocale");

        theLocale = this._setLocale(); //언어 설정 읽어오기

        return {
            id: 'zumiAIB',

            // color1: '#4C97FF',
            // color2: '#3373CC',
            // color3: '#2853A6',

            // color1: '#5CB85C',
            // color2: '#4A944A',
            // color3: '#387738',

            // color1: '#4A6FA5',
            // color2: '#3A5884',
            // color3: '#2B4263',

            color1: '#204ECF', // 블록 기본 색
            color2: '#193EAA', // 블록 테두리/음영
            color3: '#132F85', // 입력 영역 강조

            name: Form_Name[theLocale], // 확장자 메뉴 이름 (필요시 translation.js에서 가져오는 것으로 변경 가능)

            //왼편 확장 대표 아이콘 : base64 인코딩
            // blockIconURI: iconURI, // 아이콘 URI
            // blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB2aW... [긴 SVG 문자열]', // 예시 코드
            // blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxNy41IiBmaWxsPSIjRkY2Njg4Ii8+PHRleHQgZmlsbD0iI0ZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB4PSIxMiIgeT0iMjgiPlM8L3RleHQ+PC9zdmc+',
            // blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAxJJREFUSEu9l01oE0EUx/+zm22atlSrtiC0FEWstH6AiJciKh40pRc9pJ4sCOJFpApCwYN3T1o9GjwXRfyAUsST14AIniqKUKjWgtWkpslmszu+tzv52M3GxsT2l0x25u3O/Pe9+YyQxPtlB1deWlizJCICkPQBKFONZFszSFj0e26vgZm44VrEu6+2nHhSwI4YoGssFCLIhJgagbxyW8yYAkO7gKeJKMRoMictG4jootl2N4ZUWXo1B9w5FYG2kgUM8nDTBBlqXAiBrjbg9WcJzdA841agk9a3NRJV5S1DI8UaUbfb+csDoMXktaMarkIMP8zJnpjg++4TeqQd6KBQUPxbxaYBaq9TxjSpT4GiI7GzQ/NEt5OoIFURi8JZSuFL8iqyq2kIjkWTsKed7QYGLkwjNjoJK23CJltZlD2FbkDPLODt9WFV7f9x/EYSbUcvw8rnXVHlioRo07A0d88rhjCeSKhcOGfiZ9HevU2V/Hx6dhcGdVmpf8vx45jbdlGV/MwkH+HV7CzGL4YL9+8ZxJu5eaRSKWXxQy75hqy/00R4H9oFXj1pEeE3C4MnIGEVTfcaJFgrXCWIios7DcJQ5rr3AzQmWuYfH69DQ62Upo5WJ7yauzvx/cZeyv9UnfDkaagz6zme6bX8SqfdK81A91pDoF2fqMErRAjTU1MYPDCE+ecvlMVPZuUHdg/248jIiLIEkI5PV4kKOAWg98QlrxjC4sJHlQtneXFJ5WoZOD2JYlWQKp5aJvT9J3Hs5mN0x2h1IhMfXfiA0UyKUIpR64cSt9Bz/jZsXn/JxlSWQYZCIKJRGN1UiWr5gl2nu1zCe8UNqZkBnHUWpLMSlXt9a28Z3pZU1oXv1Wl1Q7x2hTtWBCzaZfoqa281tOPQ1KgkWsSobnOJ63qCJbikeT78zROu0GoqIWA7NjTH8WK/FTgc3i4dWl+npB29+m02B3bsN03LsX3Up/fjUfzM08iygwPIg00tJ/rJFCQO9wlMHIzwAVzKD98dXJuzsJz1/lZUw5VagevzYT5OHj4Y44MX8AckpVAZykJ1kwAAAABJRU5ErkJggg==',
            // blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKdUExURQAAADOZ5jyZ9zye9zyg+zyf+zuf+Tyf+Tyg+zug+zee+Tmc9lWq/0mS/zyc+Tud+UCs/z+n/z+m/z6n/z2m/zqc+Dmc+VWq/zqe9zyd+j6m/zud+Dud9zud+Duc9zue+T6k/zuc+Dma8zmb+D6l/zue+jyc9Tud+j2j/z2i/zud+Dud+juc+Dud+Duf+jyh/T2h/Tyg/Dye9juZ6TqW5TqX5TuX5Tya7Due+Dyf+juX6i9upBw/XxY1URY2Uxg3UyNJbTR8vT2g+jud+T2g+C1roQsSGAAAAAIAABgvQTaAwDyh/zyf/DmR4Bs/WwoKCiUpKB0gIAgICCQmJSImJQIDAwQFBCRQdECp/z2h/zyg/jaI0hczSkBCQ83S04+TlAQIBzI0M73Av6KlpRcbHAEAABxCY0Gs/zaI0xc0S1hbXP///7m7uxAWFEZIR/b5+M/R0SswMB1DZRc0TFVYWLa4uBEXFUNGRe/y8szNziwwMB1DZFRXWLa3uBAWFe/z8svMzSsvMLa4uREXFkRGRvDz88vNzVVXWLi6uhAUE0JFRPD09M7P0CktLTs9Pb/FxYmMjAQGBiosLK2ysaCiohUXFzyg/TmO2xw8VgEBAQQFBgMEBAQFBQYHBwQEBCFNckCq/z2f9ipjkwYIChIlMzN5tzuf+zqX5ythjhQpPBAlOBAmORAmOBAlNxo1TTFyqjqd+EGn/0Ck+EGk+UGk+kCk+UGl+zyj/zqc+Dud+jud+jyd+Dud+Dyi/zqd9zqc9jyf+zqd+Tic+Dmc9Due+Tyh/jud+Tuf+Cuq/zud9zyd+Duf/Dyh/Tyg/Dug/Dug/Tyg/Tyf+zuc+D+c+jOZ/zmg9zmd9zud+Due+jqd+Tud+Tuc+juc+Dqc9Tyc9Fro8bMAAADfdFJOUwAKPISvsrKys6yBNgYHVdj//////9NQA0LW//7//////9k/lP//nb7//77GvsT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8TEtv+9jf/9lUPU/85FBlvS+Pv7+/v7+NBdBUOXubq5ubq3mkjoNDx5AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwUlEQVQ4T2NgYGRiZmFlAwF2VhTAwcnFzcPAwMvHLyAoJAgGQqhAWERUTJxBQlJKWgYKZFGBnLyCohKDsgqUiw2oyqsxqGtAOViBphaDliaUjRVoajPo4FegCzFBT98AExiqwhXoGRmbmKIBEzNzCz2oAksraxtbO3Rg7+DoBFHg7OLq5o4FeHh6eYMV+Pj6gQX8AwLBtHtQcEgoiA4Lj4jUBfoiKjoGLB4bF58AZiQmJaeA6NS0dKACLc2ojEyweFZ2Ti6YkZdfUAiiU4tgCorB4iXZpWVgRnlFZRWITq1GVVCTXVsHZpTXNzSCaHQFJdlNzWBGS2sbxAo0Be3ZHZ1gRld3Ty+IBirwBvsC6si+/gkTwYxJk6dMBdEeUBOmTZ8BFp85azaYdnefMxdMzZu/AKxAfuGixWABNJC6ZCkkJGWXLV+xctVqNLBm7br1KhugsamqsHHT5s1bUMDWbRu37wBFFiTBODs770QHzqAEswtsAm6guZuQAl2GPXhT9d59DPsjgUkPFzhw8BDD4SNHfVRxgAM+x44znDh56vSZs0BwDh2cv3Dx0mUGBoYrV69dv3Hz5s1b6OD2nbv3GBgAt7keqNrw6tEAAAAASUVORK5CYII=',

            blockIconURI: 'data:image/png;base64,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',

            blocks: [

                // {
                //     opcode: 'openConfig',
                //     blockType: BlockType.COMMAND,
                //     text: '설정 열기',
                // },

                //-------------------------------------------//
                // connection
                //-------------------------------------------//
                {
                    opcode: 'groupConnect',
                    blockType: BlockType.LABEL,
                    text: Form_groupConnect[theLocale],
                },
                {
                    opcode: 'connectPort',
                    blockType: BlockType.COMMAND,
                    text: Form_connectPort[theLocale],
                },
                {
                    opcode: 'disconnectPort',
                    blockType: BlockType.COMMAND,
                    text: Form_disconnectPort[theLocale],
                },
                // {
                //     opcode: 'getConnectState',
                //     blockType: BlockType.REPORTER,
                //     text: Form_getConnectState[theLocale],
                //     arguments: {}
                // },
                // '---',
                // {
                //     opcode: 'toggleNotify',
                //     blockType: BlockType.COMMAND,
                //     text: '데이터 알림 [STATE] 설정',
                //     arguments: {
                //         STATE: {
                //             type: ArgumentType.STRING,
                //             menu: 'notifyMenu'
                //         }
                //     }
                // },
                '---',

                //-------------------------------------------//
                // LED
                //-------------------------------------------//
                {
                    opcode: 'groupLED',
                    blockType: BlockType.LABEL,
                    text: Form_groupLED[theLocale],
                },
                {   // 색상을 선택 수정된 COMMAND_LED 블록 정의
                    opcode: 'ledControlByColor',
                    blockType: BlockType.COMMAND,
                    text: Form_ledControlByColor[theLocale],
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR, // 색상 선택기 UI 사용
                            defaultValue: '#FF0000' // 기본값은 빨간색 (HEX 코드)
                        }
                    }
                },
                { // 색상 값을 변수로 받음
                    opcode: 'ledControl',
                    blockType: BlockType.COMMAND,
                    text: Form_ledControl[theLocale],
                    arguments: {
                        R_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                        G_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                        B_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        }
                    }
                },
                { // 패턴 변경
                    opcode: 'ledPattern',
                    blockType: BlockType.COMMAND,
                    text: Form_ledPattern[theLocale],
                    arguments: {
                        PATTERN: {
                            type: ArgumentType.STRING,
                            menu: 'ledPattern',
                            defaultValue: '1'
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            acceptReporters: true,
                        }
                    }
                },
                '---',

                //-------------------------------------------//
                // display
                //-------------------------------------------//
                {
                    opcode: 'groupDisplay',
                    blockType: BlockType.LABEL,
                    text: Form_groupDisplay[theLocale],
                },
                { //사운드 : AI 인식 이후 사운드 에러 발생
                    opcode: 'play_sound_command',
                    blockType: BlockType.COMMAND,
                    text: Form_play_sound_command[theLocale],
                    arguments: {
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'soundSelector',
                            defaultValue: '0'
                        }
                    }
                },
                { //화면 전환
                    opcode: 'show_camera_command',
                    blockType: BlockType.COMMAND,
                    text: Form_camera_command[theLocale],
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'screenSelector',
                            defaultValue: 'camera'
                        }
                    }
                },
                { //표정
                    opcode: 'change_emotion_command',
                    blockType: BlockType.COMMAND,
                    text: Form_emotion_command[theLocale],
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            menu: 'emotionSelector',
                            defaultValue: '3'
                        },
                    }
                },
                '---',

                //-------------------------------------------//
                // text
                //-------------------------------------------//
                {
                    opcode: 'groupText',
                    blockType: BlockType.LABEL,
                    text: Form_groupText[theLocale],
                },
                { //text 쓰기
                    opcode: 'display_text_command',
                    blockType: BlockType.COMMAND,
                    text: Form_display_text_command[theLocale],
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello Zumi!'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },
                { //text 이어쓰기
                    opcode: 'display_text_add_command',
                    blockType: BlockType.COMMAND,
                    text: Form_display_text_add_command[theLocale],
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello Zumi!'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },
                { // 글자 색상 및 크기 설정
                    opcode: 'display_text_set_command',
                    blockType: BlockType.COMMAND,
                    text: Form_display_text_set_command[theLocale],
                    arguments: {
                        TEXT_COLOR_VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'textColorSelector',
                            defaultValue: '1'
                        },
                        TEXT_SIZE_VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'textSizeSelector',
                            defaultValue: '5'
                        }
                    }
                },
                { // 글자 위치
                    opcode: 'display_text_pos_command',
                    blockType: BlockType.COMMAND,
                    text: Form_display_text_pos_command[theLocale],
                    arguments: {
                        TEXT_X_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            acceptReporters: true,
                        },
                        TEXT_Y_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            acceptReporters: true,
                        },
                    }
                },
                { // text 지우기
                    opcode: 'display_text_clear_command',
                    blockType: BlockType.COMMAND,
                    text: Form_display_text_clear_command[theLocale],
                },
                '---',

                //---------------------------------------------------//
                // move
                //---------------------------------------------------//
                {
                    opcode: 'groupMove',
                    blockType: BlockType.LABEL,
                    text:  Form_groupMove[theLocale],
                },

                { // 주미의 모든 움직임을 즉시 멈춤
                    opcode: 'move_stop',
                    blockType: BlockType.COMMAND,
                    text: Form_move_stop[theLocale],
                    arguments: {}
                },
                '---',

                { // 지정된 거리 만큼 이동
                    opcode: 'move_dist',
                    blockType: BlockType.COMMAND,
                    text: Form_move_dist[theLocale],
                    arguments: {
                        MOVE_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'moveDirection',
                            defaultValue: '0'
                        },
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                        MOVE_DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                    }
                },
                { // 빠르게 지정된 거리 만큼 이동
                    opcode: 'move_dist_quick',
                    blockType: BlockType.COMMAND,
                    text: Form_move_dist_quick[theLocale],
                    arguments: {
                        MOVE_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'moveDirection',
                            defaultValue: '0'
                        },
                        MOVE_DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                    }
                },
                '---',
                { // 지정된 각도만큼 회전
                    opcode: 'turn_angle',
                    blockType: BlockType.COMMAND,
                    text: Form_turn_angle[theLocale],
                    arguments: {
                        TURN_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'turnDirection',
                            defaultValue: '0'
                        },
                        TURN_ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 90,
                            acceptReporters: true,
                        },
                        TURN_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                    }
                },
                { // 빠르게 지정된 각도만큼 회전
                    opcode: 'turn_angle_quick',
                    blockType: BlockType.COMMAND,
                    text: Form_turn_angle_quick[theLocale],
                    arguments: {
                        TURN_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'turnDirection',
                            defaultValue: '0'
                        },
                        TURN_ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 90,
                            acceptReporters: true,
                        },
                    }
                },
                '---',

                { // 모터를 작동
                    opcode: 'control_motor',
                    blockType: BlockType.COMMAND,
                    text: Form_control_motor[theLocale],
                    arguments: {
                        MOTOR_SELECTION: {
                            type: ArgumentType.STRING,
                            menu: 'turnDirection',
                            defaultValue: '0'
                        },

                        MOVE_DIRECTION: {
                            type: ArgumentType.NUMBER,
                            menu: 'motorDirection',
                            defaultValue: '1'
                        },
                        MOVE_SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                            acceptReporters: true,
                        },
                    }
                },
                { // 시간동안 모터를 작동
                    opcode: 'control_motor_time',
                    blockType: BlockType.COMMAND,
                    text: Form_control_motor_time[theLocale],
                    arguments: {

                        MOVE_TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            acceptReporters: true,
                        },
                        MOVE_DIRECTION1: {
                            type: ArgumentType.NUMBER,
                            menu: 'motorDirection',
                            defaultValue: '1'
                        },
                        MOVE_SPEED1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                            acceptReporters: true,
                        },
                        MOVE_DIRECTION2: {
                            type: ArgumentType.NUMBER,
                            menu: 'motorDirection',
                            defaultValue: '1'
                        },
                        MOVE_SPEED2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                            acceptReporters: true,
                        },
                    }
                },
                '---',

                { // 지정된 속도와 방향으로 주미가 계속 이동하도록 명령
                    opcode: 'move_infinite',
                    blockType: BlockType.COMMAND,
                    text: Form_move_infinite[theLocale],
                    arguments: {
                        MOVE_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'moveDirection',
                            defaultValue: '0'
                        },
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                    }
                },
                { //  전방 센서에 무언가가 감지될 때까지 주미가 직진
                    opcode: 'go_sensor',
                    blockType: BlockType.COMMAND,
                    text: Form_go_sensor[theLocale],
                    arguments: {
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                        LEFT_SENSOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 150,
                            acceptReporters: true,
                        },
                        RIGHT_SENSOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 150,
                            acceptReporters: true,
                        },
                    }
                },
                '---',

                { // 지정된 시간 동안 또는 교차로를 감지할 때까지 작동
                    opcode: 'linefollower',
                    blockType: BlockType.COMMAND,
                    text: Form_linefollower[theLocale],
                    arguments: {
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                        LEFT_SENSOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                            acceptReporters: true,
                        },
                        RIGHT_SENSOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                            acceptReporters: true,
                        },
                        CENTER_SENSOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100,
                            acceptReporters: true,
                        },
                        LINE_TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            acceptReporters: true,
                        },
                    }
                },
                { // 라인을 따라 지정된 거리만큼 주미가 이동하도록 명령
                    opcode: 'linefollower_distance',
                    blockType: BlockType.COMMAND,
                    text: Form_linefollower_distance[theLocale],
                    arguments: {
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                        LINE_DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5,
                            acceptReporters: true,
                        },
                    }
                },
                { // 라인을 따라 지정된 속도로 계속 주미가 이동
                    opcode: 'linefollower_infinite',
                    blockType: BlockType.COMMAND,
                    text: Form_inefollower_infinite[theLocale],
                    arguments: {
                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed',
                            defaultValue: '2'
                        },
                    }
                },
                '---',
                //---------------------------------------------------//
                // 센서 값
                //---------------------------------------------------//
                {
                    opcode: 'groupSensors',
                    blockType: BlockType.LABEL,
                    text: Form_groupSensors[theLocale],
                },

                { // 센서 FL
                    opcode: 'IRSensorReading_FL',
                    blockType: BlockType.REPORTER,
                    text: Form_IRSensorReading_FL[theLocale],
                    arguments: {
                    }
                },
                { // 센서 FR
                    opcode: 'IRSensorReading_FR',
                    blockType: BlockType.REPORTER,
                    text: Form_IRSensorReading_FR[theLocale],
                    arguments: {
                    }
                },
                { // 센서 BL
                    opcode: 'IRSensorReading_BL',
                    blockType: BlockType.REPORTER,
                    text: Form_IRSensorReading_BL[theLocale],
                    arguments: {
                    }
                },
                { // 센서 BR
                    opcode: 'IRSensorReading_BR',
                    blockType: BlockType.REPORTER,
                    text: Form_IRSensorReading_BR[theLocale],
                    arguments: {
                    }
                },
                { // 센서 BC
                    opcode: 'IRSensorReading_BC',
                    blockType: BlockType.REPORTER,
                    text: Form_IRSensorReading_BC[theLocale],
                    arguments: {
                    }
                },

                { // 센서 값
                    opcode: 'getIRSensorReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getIRSensorReading[theLocale],
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.STRING,
                            menu: 'irSensorSelector',
                            defaultValue: 'senFR'
                        }
                    }
                },
                { // 배터리 값
                    opcode: 'getBatReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getBatReading[theLocale],
                    arguments: {
                    }
                },
                { // 버튼 값
                    opcode: 'getBtnReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getBtnReading[theLocale],
                    arguments: {
                    }
                },
                { // 버튼 값 boolean
                    opcode: 'boolean_getBtnReading',
                    blockType: BlockType.BOOLEAN,
                    text: Form_boolean_getBtnReading[theLocale],
                    arguments: {
                       BTN_SEL: {
                            type: ArgumentType.STRING,
                            menu: 'detectorBtn',
                            defaultValue: '8'
                        },
                       BTN_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'btnPressed',
                            defaultValue: '0'
                        },
                    }
                },
                '---',
                //---------------------------------------------------//
                // AI 카메라
                //---------------------------------------------------//
                {
                    opcode: 'groupAI',
                    blockType: BlockType.LABEL,
                    text: Form_groupAI[theLocale],
                },
                {
                    opcode: 'detector_state_select',
                    blockType: BlockType.COMMAND,
                    text: Form_detector_state_select[theLocale],
                    arguments: {
                        DETECTOR: {
                            type: ArgumentType.STRING,
                            menu: 'detectorSelector',
                            defaultValue: 'REQUEST_ENTRY_FACE_DETECT'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'getDetectorState',
                    blockType: BlockType.REPORTER,
                    text: Form_getDetectorState[theLocale],
                    arguments: {
                    }
                },
                '---',

                {
                    opcode: 'getHumanDetectReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getHumanDetectReading[theLocale],
                    arguments: {
                        DETECT: {
                            type: ArgumentType.STRING,
                            menu: 'humanFaceSelector',
                            defaultValue: 'zumiFaceDetected'
                        }
                    }
                },
                {
                    opcode: 'getCatDetectReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getCatDetectReading[theLocale],
                    arguments: {
                        DETECT: {
                            type: ArgumentType.STRING,
                            menu: 'catFaceSelector',
                            defaultValue: 'zumiCatDetected'
                        }
                    }
                },
                {
                    opcode: 'getMarkerDetectReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getMarkerDetectReading[theLocale],
                    arguments: {
                        DETECT: {
                            type: ArgumentType.STRING,
                            menu: 'markerSelector',
                            defaultValue: 'zumiMarkerDetected'
                        }
                    }
                },
                {
                    opcode: 'getColorDetectReading',
                    blockType: BlockType.REPORTER,
                    text: Form_getColorDetectReading[theLocale],
                    arguments: {
                        DETECT: {
                            type: ArgumentType.STRING,
                            menu: 'colorSelector',
                            defaultValue: 'zumiColorDetected'
                        }
                    }
                },
                '---',

                { //-- 얼굴 인식 boolean--///
                    opcode: 'boolean_face_cat_detect',
                    blockType: BlockType.BOOLEAN,
                    text: Form_boolean_face_cat_detect[theLocale],
                    arguments: {
                       FACE_SEL: {
                            type: ArgumentType.STRING,
                            menu: 'faceDetector',
                            defaultValue: 'zumiFaceDetected'
                        },
                    }
                },
                { //-- 색상 인식 boolean--///
                    opcode: 'boolean_color_detect',
                    blockType: BlockType.BOOLEAN,
                    text: Form_boolean_color_detect[theLocale],
                    arguments: {
                       COLOR_SEL: {
                            type: ArgumentType.STRING,
                            menu: 'colordetector',
                            defaultValue: '0'
                        },
                    }
                },
                { //-- 마커 인식 boolean--///
                    opcode: 'boolean_marker_detect',
                    blockType: BlockType.BOOLEAN,
                    text: Form_boolean_marker_detect[theLocale],
                    arguments: {
                       ID_SEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '15'
                        },
                    }
                },


            ],


            //---------------------------------------------------//
            // 메뉴 목록
            //---------------------------------------------------//
            menus: {
                notifyMenu: {
                    acceptsReporters: true,
                    items: ['활성화', '비활성화']
                },

                lineChangeSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_lineChangeSelector.on[theLocale], value: 'on' },
                        { text: Menu_lineChangeSelector.off[theLocale], value: 'off' }
                    ]
                },

                detectorBtn: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_colordetector.red[theLocale], value: '8' },
                        { text: Menu_colordetector.blue[theLocale], value: '4' },
                        { text: Menu_colordetector.green[theLocale], value: '2' },
                        { text: Menu_colordetector.yellow[theLocale], value: '1' },
                    ]
                },

                btnPressed: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_btnPressed.pressed[theLocale], value: '0'},
                        { text: Menu_btnPressed.notPressed[theLocale], value: '1'},
                    ]
                },

                faceDetector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_detectorSelector.face[theLocale], value: 'zumiFaceDetected'},
                        { text: Menu_detectorSelector.cat[theLocale], value: 'zumiCatDetected'},
                    ]
                },

                colordetector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_colordetector.red[theLocale], value: '0'},
                        { text: Menu_colordetector.orange[theLocale], value: '1'},
                        { text: Menu_colordetector.yellow[theLocale], value: '2'},
                        { text: Menu_colordetector.green[theLocale], value: '3'},
                        { text: Menu_colordetector.cyan[theLocale], value: '4'},
                        { text: Menu_colordetector.blue[theLocale], value: '5'},
                        { text: Menu_colordetector.purple[theLocale], value: '6'},
                    ]
                },

                detectorSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_detectorSelector.face[theLocale], value: 'REQUEST_ENTRY_FACE_DETECT'},
                        { text: Menu_detectorSelector.cat[theLocale], value: 'REQUEST_ENTRY_CAT_DETECT'},
                        { text: Menu_detectorSelector.color[theLocale], value: 'REQUEST_ENTRY_COLOR_DETECT'},
                        { text: Menu_detectorSelector.marker[theLocale], value: 'REQUEST_ENTRY_APRIL_DETECT'},
                    ]
                },

                screenSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_screenSelector.camera[theLocale], value: 'camera' },
                        { text: Menu_screenSelector.emotion[theLocale], value: 'emotion' }
                    ]
                },

                soundSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_soundSelector.catMeow[theLocale], value: '0' },
                        { text: Menu_soundSelector.cameraShutter[theLocale], value: '1' },
                        { text: Menu_soundSelector.fail1[theLocale], value: '2' },
                        { text: Menu_soundSelector.fail2[theLocale], value: '3' },
                        { text: Menu_soundSelector.horn1[theLocale], value: '4' },
                        { text: Menu_soundSelector.horn2[theLocale], value: '5' },
                        { text: Menu_soundSelector.siren[theLocale], value: '6' },
                        { text: Menu_soundSelector.success[theLocale], value: '7' },
                    ]
                },

                emotionSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_emotionSelector.off[theLocale], value: '0' },
                        { text: Menu_emotionSelector.stop[theLocale], value: '2' },
                        { text: Menu_emotionSelector.blink[theLocale], value: '3' },
                        { text: Menu_emotionSelector.smile[theLocale], value: '4' },
                        { text: Menu_emotionSelector.love[theLocale], value: '5' },
                        { text: Menu_emotionSelector.shock[theLocale], value: '6' },
                        { text: Menu_emotionSelector.surprise[theLocale], value: '7' },
                        { text: Menu_emotionSelector.joy[theLocale], value: '8' },
                        { text: Menu_emotionSelector.anger[theLocale], value: '9' },
                        { text: Menu_emotionSelector.sleepy[theLocale], value: '10' },
                        { text: Menu_emotionSelector.sadness[theLocale], value: '11' },
                        { text: Menu_emotionSelector.dizzy[theLocale], value: '12' },
                        { text: Menu_emotionSelector.sleep[theLocale], value: '13' },
                        { text: Menu_emotionSelector.wink[theLocale], value: '14' },
                        { text: Menu_emotionSelector.detect[theLocale], value: '15' },
                    ]
                },

                ledPattern: {
                    items: [
                        { text: Menu_ledPattern.on[theLocale], value: '0' },
                        { text: Menu_ledPattern.blink[theLocale], value: '1' },
                        { text: Menu_ledPattern.doubleBlink[theLocale], value: '2' },
                        { text: Menu_ledPattern.fadeInOut[theLocale], value: '3' },
                        { text: Menu_ledPattern.fadeOut[theLocale], value: '4' },
                        { text: Menu_ledPattern.fadeIn[theLocale], value: '5' },
                        { text: Menu_ledPattern.rainbow[theLocale], value: '6' }
                    ]
                },

                moveDirection: {
                    items: [
                        { text: Menu_moveDirection.forward[theLocale], value: '0' },
                        { text: Menu_moveDirection.backward[theLocale], value: '1' }
                    ]
                },

                motorDirection: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_motorDirection.stop[theLocale], value: '0' },
                        { text: Menu_motorDirection.forward[theLocale], value: '1' },
                        { text: Menu_motorDirection.backward[theLocale], value: '2' },
                    ]
                },

                turnDirection: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_turnDirection.left[theLocale], value: '0' },
                        { text: Menu_turnDirection.right[theLocale], value: '1' }
                    ]
                },

                moveSpeed: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_moveSpeed.slow[theLocale], value: '1' },
                        { text: Menu_moveSpeed.normal[theLocale], value: '2' },
                        { text: Menu_moveSpeed.fast[theLocale], value: '3' }
                    ]
                },

                textColorSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_textColorSelector.current[theLocale], value: '0' },
                        { text: Menu_textColorSelector.white[theLocale], value: '1' },
                        { text: Menu_textColorSelector.black[theLocale], value: '2' },
                        { text: Menu_textColorSelector.navy[theLocale], value: '3' },
                        { text: Menu_textColorSelector.blue[theLocale], value: '4' },
                        { text: Menu_textColorSelector.skyBlue[theLocale], value: '5' },
                        { text: Menu_textColorSelector.cyan[theLocale], value: '6' },
                        { text: Menu_textColorSelector.teal[theLocale], value: '7' },
                        { text: Menu_textColorSelector.green[theLocale], value: '8' },
                        { text: Menu_textColorSelector.lightGreen[theLocale], value: '9' },
                        { text: Menu_textColorSelector.lime[theLocale], value: '10' },
                        { text: Menu_textColorSelector.yellow[theLocale], value: '11' },
                        { text: Menu_textColorSelector.amber[theLocale], value: '12' },
                        { text: Menu_textColorSelector.orange[theLocale], value: '13' },
                        { text: Menu_textColorSelector.darkOrange[theLocale], value: '14' },
                        { text: Menu_textColorSelector.brown[theLocale], value: '15' },
                        { text: Menu_textColorSelector.blueGray[theLocale], value: '16' },
                        { text: Menu_textColorSelector.gray[theLocale], value: '17' },
                    ]
                },

                textSizeSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_textSizeSelector.current[theLocale], value: '0' },
                        { text: Menu_textSizeSelector.size1[theLocale], value: '1' },
                        { text: Menu_textSizeSelector.size2[theLocale], value: '2' },
                        { text: Menu_textSizeSelector.size3[theLocale], value: '3' },
                        { text: Menu_textSizeSelector.size4[theLocale], value: '4' },
                        { text: Menu_textSizeSelector.size5[theLocale], value: '5' },
                    ]
                },

                irSensorSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_irSensorSelector.frontRight[theLocale], value: 'senFR' },
                        { text: Menu_irSensorSelector.frontLeft[theLocale], value: 'senFL' },
                        { text: Menu_irSensorSelector.bottomRight[theLocale], value: 'senBR' },
                        { text: Menu_irSensorSelector.bottomLeft[theLocale], value: 'senBL' },
                        { text: Menu_irSensorSelector.bottomCenter[theLocale], value: 'senBC' }
                    ]
                },


                catFaceSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_catFaceSelector.state[theLocale], value: 'zumiCatDetected' },
                        { text: Menu_catFaceSelector.xCoord[theLocale], value: 'zumiCatCenter[0]' },
                        { text: Menu_catFaceSelector.yCoord[theLocale], value: 'zumiCatCenter[1]' },
                    ]
                },
                humanFaceSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_humanFaceSelector.state[theLocale], value: 'zumiFaceDetected' },
                        { text: Menu_humanFaceSelector.xCoord[theLocale], value: 'zumiFaceCenter[0]' },
                        { text: Menu_humanFaceSelector.yCoord[theLocale], value: 'zumiFaceCenter[1]' },
                    ]
                },

                markerSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_markerSelector.id[theLocale], value: 'zumiMarkerDetected' },
                        { text: Menu_markerSelector.xCoord[theLocale], value: 'zumiMarkerCenter[0]' },
                        { text: Menu_markerSelector.yCoord[theLocale], value: 'zumiMarkerCenter[1]' },
                    ]
                },

                colorSelector: {
                    acceptReporters: false,
                    items: [
                        { text: Menu_colorSelector.color[theLocale], value: 'zumiColorDetected' },
                        { text: Menu_colorSelector.xCoord[theLocale], value: 'zumiColorCenter[0]' },
                        { text: Menu_colorSelector.yCoord[theLocale], value: 'zumiColorCenter[1]' },
                    ]
                },
            }
        }
    }


    // ===============================================
    // --- 블록 함수 구현 ---
    // ===============================================


    // ===============================================
    // 개별 블록 함수 (group 구분)
    // ===============================================

        groupConnect(args){
            this._openConfig();
            //this._openConfig();
            // vm.connectionStatus = "no";
            // vm.emit('CONNECTION_STATUS', vm.connectionStatus);
         //   this.connectionAlive = newStatus;
            // var newStatus ="ok"
            // this.runtime.emit('CONNECTION_STATUS', newStatus);
        }

        connectPort(args){
            this.connectDevice();
        }

        disconnectPort(args){
            this.disconnectDevice();
        }

        getConnectState(){
            return this.isConnected();
        }

        groupLED(args){
            // var newStatus ="no"
            // this.runtime.emit('CONNECTION_STATUS', newStatus);
        }

        groupDisplay(args){
            // var newStatus ="loading"
            // this.runtime.emit('CONNECTION_STATUS', newStatus);
        }

        groupText(args){
        }

        groupMove(args){
        }

        groupSensors(args){
        }

        groupAI(args){
        }



    // ===============================================
    // 개별 블록 함수 (동작 상태 확인 함수)
    // ===============================================

    // 공용으로 사용할 조건 대기 함수
    waitForCondition(conditionFn, timeout = null) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkTimer = setInterval(() => {
                if (conditionFn()) {
                    clearInterval(checkTimer);
                    resolve(true);
                } else if (timeout && (Date.now() - startTime) > timeout) {
                    clearInterval(checkTimer);
                    resolve(false); // 시간 초과
                }
            }, 50); // 50ms마다 상태 체크
        });
    }

    async sendAndAwaitZumi(mode, command, ...args) {
        const MAX_RETRIES = 5;      // 최대 재전송 횟수
        const START_TIMEOUT = 250; // 명령 시작(1이 되기까지) 대기 시간 (1초)
        console.log(`- 명령 시작`);
        for (let i = 0; i < MAX_RETRIES; i++) {
            console.log(`명령 전송 시도 (${i + 1}/${MAX_RETRIES})...`);

            this.sendCommand(command, ...args);

            // 1. 명령이 시작되었는지(reqPSTAT == 1) 확인하는 타임아웃 로직
            const started = await this.waitForCondition(() => this.reqPSTAT !== 0, START_TIMEOUT);

            if (started)
            {
                if(mode == ActionMode.MODE_SEQUENTIAL)
                {
                    console.log("명령 수신 확인 (Zumi 구동 시작)");
                    // 2. 이제 명령이 끝날 때까지(reqPSTAT == 0) 무제한 대기
                    await this.waitForCondition(() => this.reqPSTAT === 0);
                    console.log("* 명령 수행 완료");
                    return ; // 성공적으로 완료됨
                }
                else
                {
                    console.log("* 명령 수행 완료");
                    return ; // 성공적으로 완료됨
                }
            }

            console.warn("명령 전송 실패 또는 응답 없음. 재시도합니다...");
        }

        console.error("* 최대 재시도 횟수를 초과했습니다. 통신 상태를 확인하세요.");
        return ;
    }


    // pstat이 변경되지 않는 명령들을 sendingloop에서 전송을 완료하는게 목적
    async waitForSendLoopCheck(mode, command, ...args) {
        const MAX_RETRIES = 5;      // 최대 재전송 횟수
        const START_TIMEOUT = 100; // 명령 시작(1이 되기까지) 대기 시간 (1초)

        this.checkedSendLoop = 1;
        this.sendCommand(command, ...args);
        console.log(`- 명령 시작`);
        if(mode ==  ActionMode.MODE_SEQUENTIAL)
        {
            for (let i = 0; i < MAX_RETRIES; i++) {
                console.log(`sendingloop 기다리기 (${i + 1}/${MAX_RETRIES})...`);

            // this.sendCommand(command, ...args);

                // 1. 명령이 시작되었는지(reqPSTAT == 1) 확인하는 타임아웃 로직
                const started = await this.waitForCondition(() => this.checkedSendLoop !== 1, START_TIMEOUT);
                if (started)
                {
                    console.log("* sendingloop 전송 완료");
                    return ; // 성공적으로 완료됨
                }

                console.warn("* sendingloop 실패 또는 응답 없음. 재시도합니다...");
            }
            console.error("* sendingloop 횟수를 초과했습니다. 통신 상태를 확인하세요.");
            return ;
        }
        // else
        // {
        //     return true;
        // }
    }


    // pstat이 변경되지 않는 명령들을 sendingloop에서 전송을 완료하는게 목적
    async waitForSendLoopCheck_text(mode, payloadBytes) {
        const MAX_RETRIES = 5;      // 최대 재전송 횟수
        const START_TIMEOUT = 100; // 명령 시작(1이 되기까지) 대기 시간 (1초)

        this.checkedSendLoop = 1;
        this.makePacket(payloadBytes);
        console.log(`- 명령 시작`);
        if(mode ==  ActionMode.MODE_SEQUENTIAL)
        {
            for (let i = 0; i < MAX_RETRIES; i++) {
                console.log(`sendingloop 기다리기 (${i + 1}/${MAX_RETRIES})...`);

            // this.sendCommand(command, ...args);

                // 1. 명령이 시작되었는지(reqPSTAT == 1) 확인하는 타임아웃 로직
                const started = await this.waitForCondition(() => this.checkedSendLoop !== 1, START_TIMEOUT);
                if (started)
                {
                    console.log("* sendingloop 전송 완료");
                    return ; // 성공적으로 완료됨
                }

                console.warn("* sendingloop 실패 또는 응답 없음. 재시도합니다...");
            }
            console.error("* sendingloop 횟수를 초과했습니다. 통신 상태를 확인하세요.");
            return ;
        }
        // else
        // {
        //     return true;
        // }
    }

    // ===============================================
    // 개별 블록 함수 (LED)
    // ===============================================

    ledControlByColor (args) {
        const hexColor = args.COLOR; // 예: "#FF0000"
        // 2. HEX 코드를 R, G, B 10진수 값 (0~255)으로 변환
        // HEX 문자열에서 # 제거 후 R, G, B 값을 각각 16진수에서 10진수로 파싱
        // substr(1)로 # 제거, substr(1, 2)는 R, substr(3, 2)는 G, substr(5, 2)는 B
        const r255 = parseInt(hexColor.substr(1, 2), 16);
        const g255 = parseInt(hexColor.substr(3, 2), 16);
        const b255 = parseInt(hexColor.substr(5, 2), 16);

        // 3. Zumi 프로토콜 요구사항에 맞게 0~255 값을 0~10 범위로 정규화
        // (10 / 255)를 곱하여 0~10 범위로 변환 후, 정수(바이트)로 변환
        const r10 = Math.round(r255 * (10 / 255));
        const g10 = Math.round(g255 * (10 / 255));
        const b10 = Math.round(b255 * (10 / 255));

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_LED,
            r10,
            g10,
            b10
        );
    }

    ledControl (args) {
        // 24 52 0A 00 0A 0A 0A
        const r = parseInt(args.R_VALUE);
        const g = parseInt(args.G_VALUE);
        const b = parseInt(args.B_VALUE);
        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_LED,
            r,
            g,
            b
        );
    }

    ledPattern(args){
        // 24 52 0A 00 0A 0A 0A
        const pattern = parseInt(args.PATTERN);
        const timeInSeconds = parseFloat(args.TIME);

        // 2. 시간 계산 및 바이트 분할 (파이썬 로직 반영)
        // 파이썬: time = int(time * 1000)
        let timeInMs = Math.floor(timeInSeconds * 1000); // 밀리초(ms) 단위로 변환

        // 255ms 초과 여부에 따라 상위/하위 바이트를 분리합니다.
        let timeHigh = 0;
        let timeLow = 0;

        if (timeInMs < 256) { // 256ms 미만 (0x00FF 이하)
            timeLow = timeInMs;
        } else {
            timeHigh = Math.floor(timeInMs / 256); // 상위 바이트 (몫)
            timeLow = timeInMs % 256;              // 하위 바이트 (나머지)
        }

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_PATTERN_LED, // 통신 명령 코드
            pattern,             // LED 패턴 값 (0~6)
            timeHigh,            // 시간 상위 바이트
            timeLow              // 시간 하위 바이트
        );
    }


    // ===============================================
    // 개별 블록 함수 (소리 화면)
    // ===============================================

    play_sound_command(args) {
        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_PLAY_SOUND,
            args.NOTE
        );
    }

    change_emotion_command(args) {
        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_EMOTION_CHANGE,
            args.EMOTION
        );
    }

    show_camera_command(args) {
        let cameraON = 2
        if (args.STATE === 'camera') {
            cameraON = 1
        }
        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_SCREEN_TOGGLE,
            cameraON
        );
    }


    // ===============================================
    // 개별 블록 함수 (text 역할)
    // ===============================================

    /**
     * 스크래치 드롭다운에서 선택된 문자열 값을 불리언(true/false) 값으로 변환하여 반환합니다.
     * @param {object} args - 스크래치 블록에서 전달된 인수 객체.
     * args.VALUE: 드롭다운에서 선택된 문자열 ('참' 또는 '거짓').
     * @returns {boolean} 변환된 불리언 값 (true 또는 false).
     */

    // display_text (새로운 텍스트 출력)
    display_text_command(args) {
        let newlineVal = 0
        if (args.STATE === 'on') {
            newlineVal = 1
        }
        this._sendTextBase(CommandType.COMMAND_TEXT_INPUT, args.TEXT, newlineVal);
    }

    // display_text_add (텍스트 이어 출력)
    display_text_add_command(args) {
        let newlineVal = 0
        if (args.STATE === 'on') {
            newlineVal = 1
        }
        this._sendTextBase(CommandType.COMMAND_TEXT_ADD, args.TEXT, newlineVal);
    }

    // display_text_clear (디스플레이 초기화)
    display_text_clear_command() {
        this._sendTextBase(CommandType.COMMAND_TEXT_INPUT, '', 0);
    }

    // display_text_set (색상 및 크기 설정)
    display_text_set_command(args) {
        // 인수는 0-255 범위의 정수여야 하지만, 파이썬에서 이미 0~22, 0~5로 제한됨.
        const color = args.TEXT_COLOR_VALUE; // 텍스트 색상 코드 (0-22)
        const size = args.TEXT_SIZE_VALUE;   // 텍스트 크기 (0-5)
        const usePos = 0;         // 위치 설정 안함 (0)

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_TEXT_SET,
            color,
            size,
            usePos,
            0,
            0
        );
    }

    // display_text_pos (위치 설정 및 비트 연산)
    display_text_pos_command(args) {
        // 1. 인수 추출
        let posX = parseInt(args.TEXT_X_VALUE);
        let posY = parseInt(args.TEXT_Y_VALUE);

        const usePos = 1; // 위치 설정 사용 (1)

        // 2. 오프셋 설정 (파이썬 로직: pos_x = pos_x + 500)
        posX += 500;
        posY += 500;

        // 3. 범위 확인 (파이썬과 동일하게 에러 처리/무시)
        // 스크래치 확장에서는 보통 에러 대신 경고를 출력하거나 유효한 범위 내로 클램프합니다.
        if (!(0 <= posX && posX <= 2047 && 0 <= posY && posY <= 2047)) {
            console.error("Error: pos_x and pos_y must be between 0 and 2047 after offset.");
            // 유효하지 않은 경우 통신을 시도하지 않고 종료할 수 있습니다.
            // return Promise.resolve();
        }

        // 4. 비트 연산 및 바이트 구성 (파이썬 로직을 JS 비트 연산으로 변환)

        // pos_x와 pos_y는 이제 0-2047 범위의 값입니다. (11비트 필요)
        // buf2: pos_x의 하위 8비트 추출
        // 파이썬: buf2 = pos_x & 0xFF
        const buf2 = posX & 0xFF;

        // buf3: pos_y의 하위 8비트 추출
        // 파이썬: buf3 = pos_y & 0xFF
        const buf3 = posY & 0xFF;

        // buf1 구성
        let buf1 = 0;

        // pos_x의 상위 3비트 추출 및 buf1의 비트 6, 5, 4 위치에 저장
        // 파이썬: upper_bits_pos_x = (pos_x >> 8) & 0x07; buf1 |= upper_bits_pos_x << 4
        const upper_bits_pos_x = (posX >> 8) & 0x07;
        buf1 |= upper_bits_pos_x << 4;

        // pos_y의 상위 3비트 추출 및 buf1의 비트 3, 2, 1 위치에 저장
        // 파이썬: upper_bits_pos_y = (pos_y >> 8) & 0x07; buf1 |= upper_bits_pos_y << 1
        const upper_bits_pos_y = (posY >> 8) & 0x07;
        buf1 |= upper_bits_pos_y << 1;

        // usePos 플래그 비트 추출 및 buf1의 비트 7 위치에 저장
        // 파이썬: usePos_bit = usePos & 0x01; buf1 |= usePos_bit << 7
        const usePos_bit = usePos & 0x01;
        buf1 |= usePos_bit << 7;

        // color와 size는 0으로 고정하여 좌표 설정 명령만 전달합니다.

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_TEXT_SET,
            0,
            0,
            buf1,
            buf2,
            buf3
        );
    }


    _sendTextBase(commandType, text, newlineOption) {
        const encoder = new TextEncoder();
        let encoded_bytes = encoder.encode(text);

        // 최대 길이(27 바이트) 제한 적용
        if (encoded_bytes.length > 27) {
            encoded_bytes = encoded_bytes.slice(0, 27);
        }

        // 텍스트 바이트 배열 구성: [CommandType, ...encoded_bytes, (\n), \x00]
        let final_bytes_array = [commandType];

        for (const byte of encoded_bytes) {
            final_bytes_array.push(byte);
        }

        // 줄바꿈 (\n, ASCII 10) 추가
        if (newlineOption === 1) {
            final_bytes_array.push(10);
        }

        // 종료 바이트 (\x00, ASCII 0) 추가
        final_bytes_array.push(0);

        const final_bytes = new Uint8Array(final_bytes_array);

        //this.makePacket(final_bytes);
       return this.waitForSendLoopCheck_text(
                this.actionMode,
                final_bytes
            );
    }


    // ===============================================
    // 개별 블록 함수 (동작 상태 확인 함수)
    // ===============================================

    waitForStatusChange() {
        var seq = 0;
        return new Promise(resolve => {
            // 1. 상태를 확인하는 함수 정의 (주기적인 확인 필요)

            console.log("wait PSTAT start");
            const checkStatus = () => {
                // this.reqPSTAT 값이 0이 아니면

                if(seq == 0)
                {
                    if (this.reqPSTAT !== 0) {
                        seq = 1;
                        // clearInterval(intervalId); // 2. 타이머를 멈추고
                        // resolve(this.reqPSTAT); // 3. 대기를 완료합니다.
                    } else {
                        // 아직 0이면 계속 기다립니다.
                        // 이 코드가 주 실행 스레드를 막지 않으면서 주기적으로 상태를 확인합니다.
                    }
                }
                else if(seq == 1)
                {
                    if (this.reqPSTAT !== 1) {
                        clearInterval(intervalId); // 2. 타이머를 멈추고
                        resolve(this.reqPSTAT); // 3. 대기를 완료합니다.
                        console.log("wait PSTAT checked");
                    } else {
                        // 아직 0이면 계속 기다립니다.
                        // 이 코드가 주 실행 스레드를 막지 않으면서 주기적으로 상태를 확인합니다.
                    }
                }


            };

            // 4. 짧은 간격(예: 50ms)으로 상태를 주기적으로 확인하는 타이머 시작
            // (참고: 상태 업데이트가 '이벤트 리스너'로 구현되어 있다면, setInterval 대신 이벤트 리스너를 사용하는 것이 더 효율적입니다.)
            const intervalId = setInterval(checkStatus, 50);
        });
    }


    // ===============================================
    // 개별 블록 함수 (move 역할)
    // ===============================================

    //지정된 거리만큼 주미를 전진시킵니다.
    async move_dist(args)
    {
        let speed = parseInt(args.MOVE_SPEED);
        let dir = parseInt(args.MOVE_DIRECTION);
        let dist = parseInt(args.MOVE_DIST);

        if(speed < 1) {speed = 1};
        if(speed > 3) {speed = 3};

        if(dist < 0) {dist = 0};
        if(dist > 300) {dist = 300};

        if(dir < 0) {dir = 0};
        if(dir > 1) {dir = 1};


        return this.sendAndAwaitZumi(
                    this.actionMode,
                    CommandType.COMMAND_GO_UNTIL_DIST,
                    speed,
                    dist,
                    dir
                );
    }

    // 빠르게 지정된 거리 만큼 이동
    async move_dist_quick(args) {

        let dir = parseInt(args.MOVE_DIRECTION);
        let dist = parseInt(args.MOVE_DIST);

        if(dir < 0) {dir = 0};
        if(dir > 1) {dir = 1};

        if(dist < 0) {dist = 0};
        if(dist > 300) {dist = 300};

        if(dir == 0)
        {
            return this.sendAndAwaitZumi(
                    this.actionMode,
                    CommandType.COMMAND_QUICK_GOGO,
                    dist,
                );
        }
        else
        {
            return this.sendAndAwaitZumi(
                    this.actionMode,
                    CommandType.COMMAND_QUICK_GOBACK,
                    dist,
                );
        }
    }


    // 회전
    /**
     * 지정된 방향, 각도, 속도로 주미 로봇을 회전시키는 명령을 전송합니다.
     * 이 함수는 파이썬의 send_turn 역할을 수행합니다.
     * @param {object} args - { DIRECTION: string (0|1), DEGREE: number, SPEED: string (1|2|3) }
     */

    async turn_angle(args) {

        let dir = parseInt(args.TURN_DIRECTION); // 0 (왼쪽) 또는 1 (오른쪽)
        let deg = Math.round(parseFloat(args.TURN_ANGLE)); // 각도는 정수화
        let speed = parseInt(args.TURN_SPEED);

        // 속도 제한 (1~3)
        if (speed < 1) speed = 1;
        if (speed > 3) speed = 3;

        // 방향 제한 (0~1) - 드롭다운에서 이미 보장되지만 코드 무결성을 위해 유지
        if (dir < 0) dir = 0;
        if (dir > 1) dir = 1;

        // 2. 각도 바이트 분할 (파이썬 로직 반영)
        let degHigh = 0;
        let degLow = 0;

        if (deg < 256) { // 256도 미만 (0x00FF 이하)
            degLow = deg;
        } else {
            degHigh = Math.floor(deg / 256); // 상위 바이트 (몫)
            degLow = deg % 256;              // 하위 바이트 (나머지)
        }

        return this.sendAndAwaitZumi(
                    this.actionMode,
                    CommandType.COMMAND_FREE_TURN_PYTHON,
                    speed,
                    degLow,
                    degHigh,
                    dir
                );
    }

    // 빠르게 지정된 각도만큼 회전
    async turn_angle_quick(args) {

        let dir = parseInt(args.TURN_DIRECTION); // 0 (왼쪽) 또는 1 (오른쪽)
        let deg = Math.round(parseFloat(args.TURN_ANGLE)); // 각도는 정수화

        if (deg > 360) {
            deg = 360;
        }

        // Math.floor()를 사용하여 정수형 나누기(int(deg / 5))를 구현합니다.
        deg = Math.floor(deg / 5);

        if(dir == 0)
        {
            return this.sendAndAwaitZumi(
                        this.actionMode,
                        CommandType.COMMAND_QUICK_LEFT,
                        deg,
                    );
        }
        else
        {
            return this.sendAndAwaitZumi(
                        this.actionMode,
                        CommandType.COMMAND_QUICK_RIGHT,
                        deg,
                    );
        }
    }

    // 전방 센서에 무언가가 감지될 때까지 주미가 직진
    go_sensor(args)
    {
        let speed = parseInt(args.MOVE_SPEED); // 0 (왼쪽) 또는 1 (오른쪽)
        let senL = parseInt(args.LEFT_SENSOR); // 0 (왼쪽) 또는 1 (오른쪽)
        let senR = parseInt(args.RIGHT_SENSOR); // 0 (왼쪽) 또는 1 (오른쪽)

        if(speed < 1) speed = 1
        if(speed > 3) speed = 3

        if(senL < 0) senL = 0
        if(senL > 255) senL = 255

        if(senR < 0) senR = 0
        if(senR > 255) senR = 255

        return this.sendAndAwaitZumi(
                this.actionMode,
                CommandType.COMMAND_GOSENSOR,
                speed,
                senL,
                senR
            );
    }

    // 지정된 속도와 방향으로 주미가 계속 이동하도록 명령
    move_infinite(args)
    {
        let dir = parseInt(args.MOVE_DIRECTION);
        let speed = parseInt(args.MOVE_SPEED);

        if(speed < 1) {speed = 1};
        if(speed > 3) {speed = 3};

        if(dir < 0) {dir = 0};
        if(dir > 1) {dir = 1};

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_GO_INFINITE,
            speed,
            0,
            dir
        );
    }


    //  모터를 작동
    control_motor(args)
    {
        let sel = parseInt(args.MOTOR_SELECTION); // 0 (왼쪽) 또는 1 (오른쪽)
        let dir = parseInt(args.MOVE_DIRECTION);
        let speed = parseInt(args.MOVE_SPEED);

        if (speed < 0) speed = 0;
        else if (speed > 250) speed = 250;

        if(dir < 0) dir = 0
        if(dir > 2) dir = 2

        //10단계
        if(sel == 0) //왼쪽 모터
        {
            if(dir == 1) dir = 2;
            else if(dir == 2) dir = 1;

            this.tSpd1 = speed;
            this.tDir = this.tDir & 0b11110000;
            this.tDir = this.tDir | dir;
        }

        else //오른쪽 모터
        {
            this.tSpd2 = speed;
            this.tDir = this.tDir & 0b11001111;
            this.tDir = this.tDir | (dir<<4)
        }

        this.sendCommand(
            CommandType.COMMAND_MOTOR1_INFINITE,
            this.tSpd1,
            this.tSpd2,
            this.tDir
        );

    }

    control_motor_time(args)
    {
        let time = args.MOVE_TIME; // 0 (왼쪽) 또는 1 (오른쪽)

        let dirL = parseInt(args.MOVE_DIRECTION1);
        let speedL = parseInt(args.MOVE_SPEED1);

        let dirR = parseInt(args.MOVE_DIRECTION2);
        let speedR = parseInt(args.MOVE_SPEED2);

        time = parseInt(time * 10)
        if(time < 0) time = 0;
        if(time > 250) time = 250;

        if(time == 1) time = 2;

        if(speedL < 0) speedL = 0;
        if(speedR > 250) speedL = 250;

        if(speedR < 0) speedR = 0;
        if(speedR > 250) speedR = 250;

        if(dirL < 0) dirL = 0;
        if(dirL > 2) dirL = 2;

        // 오른쪽 모터 반대
        if(dirL == 1) dirL = 2;
        else if(dirL == 2) dirL = 1;

        if(dirR < 0) dirR = 0;
        if(dirR > 2) dirR = 2;

        let dir = 0b01000000;
        dir = dir | dirL;
        dir = dir | (dirR<<4);

        return this.sendAndAwaitZumi(
                    this.actionMode,
                    CommandType.COMMAND_MOTOR_TIME,
                    speedL,
                    speedR,
                    dir,
                    time
                );
    }

    // 라인 감지 센서를 이용하여 라인을 따라 주미가 이동
    linefollower(args)
    {
        let speed = parseInt(args.MOVE_SPEED); // 0 (왼쪽) 또는 1 (오른쪽)
        let senBL = parseInt(args.LEFT_SENSOR); // 0 (왼쪽) 또는 1 (오른쪽)
        let senBR = parseInt(args.RIGHT_SENSOR); // 0 (왼쪽) 또는 1 (오른쪽)
        let senBC = parseInt(args.CENTER_SENSOR); // 0 (왼쪽) 또는 1 (오른쪽)
        let time = args.LINE_TIME; // 0 (왼쪽) 또는 1 (오른쪽)

        if(speed < 0)  speed = 0;
        if(speed > 3)  speed = 3;

        if(senBL < 0) senBL = 0;
        if(senBL > 255) senBL = 255;

        if(senBR < 0) senBR = 0;
        if(senBR > 255) senBR = 255;

        if(senBC < 0) senBC = 0;
        if(senBC > 255) senBC = 255;

        time = parseInt(time * 10);
        if(time < 0) time = 0;
        if(time > 250) time = 250;

        return this.sendAndAwaitZumi(
                this.actionMode,
                CommandType.COMMAND_LINE_TRACING,
                speed,
                senBL,
                senBR,
                senBC,
                time
            );
    }

    // 라인을 따라 지정된 거리만큼 주미가 이동하도록 명령
    linefollower_distance(args)
    {
        let speed = parseInt(args.MOVE_SPEED); // 0 (왼쪽) 또는 1 (오른쪽)
        let dist = parseInt(args.LINE_DISTANCE); // 0 (왼쪽) 또는 1 (오른쪽)

        if(speed < 0) speed = 0;
        if(speed > 3) speed = 3;

        if(dist < 0) dist = 0;
        if(dist > 255) dist = 255;

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_LINE_TRACE_DIST,
            speed,
            dist,
        );
    }

    // 라인을 따라 지정된 속도로 계속 주미가 이동
    linefollower_infinite(args)
    {
        let speed = parseInt(args.MOVE_SPEED); // 0 (왼쪽) 또는 1 (오른쪽)

        if(speed < 0) speed = 0;
        if(speed > 3) speed = 3;

        return this.waitForSendLoopCheck(
            this.actionMode,
            CommandType.COMMAND_TRACE_INFINITE,
            speed,
        );
    }

    move_stop(args)
    {
        // this.sendCommand(
        //     CommandType.COMMAND_MOTION_STOP
        // );
        return this.sendAndAwaitZumi(
            this.actionMode,
            CommandType.COMMAND_MOTION_STOP
        );
    }

    // ===============================================
    // 개별 블록 함수 (sensor)
    // ===============================================

    /**
     * 드롭다운 메뉴로 선택된 IR 센서 값을 반환합니다.
     * 이 함수는 ZumiExtension 클래스의 속성에 직접 접근합니다.
     * @param {object} args - 블록 인수를 포함하는 객체 (예: { SENSOR: 'senFR' })
     * @returns {number} 선택된 센서의 최신 값
     */
    getIRSensorReading(args) {
        const sensorKey = args.SENSOR; // 'senFR', 'senFL', 'senBC' 등의 문자열

        // this.dataStore 대신, this 객체의 속성(this[sensorKey])에 직접 접근하여 값을 가져옵니다.
        if (this.hasOwnProperty(sensorKey)) {
            return this[sensorKey];
        }

        // 해당 속성이 없거나 유효하지 않은 경우 0을 반환합니다.
        return 0;
    }


    IRSensorReading_FL(args) {
        return this.senFL;
    }
    IRSensorReading_FR(args) {
        return this.senFR;
    }
    IRSensorReading_BL(args) {
        return this.senBL;
    }
    IRSensorReading_BC(args) {
        return this.senBC;
    }
    IRSensorReading_BR(args) {
        return this.senBR;
    }

    /**
     * 버튼 값을 반환합니다.
     * 8,4,2,1,0
     */
    getBtnReading() {

    // 1. 버튼 값(숫자)에 따른 문자열 키(key)를 결정합니다.
        let colorKey;

        if (this.btn === 8) {
            colorKey = 'red';
        } else if (this.btn === 4) {
            colorKey = 'blue';
        } else if (this.btn === 2) {
            colorKey = 'green';
        } else if (this.btn === 1) {
            colorKey = 'yellow';
        } else {
            colorKey = 'none'; // 매핑되지 않은 값은 'none'
        }

        // 2. 결정된 키를 사용하여 FUNTION_BtnValueMap에서 해당 언어의 문자열을 반환합니다.
       // const locale = theLocale || 'ko';

        return Funtion_getBtnReading[colorKey][theLocale];



        // if(this.btn == 8) {
        //     return '빨강';
        // }
        // else if(this.btn == 4) {
        //     return '파랑';
        // }
        // else if(this.btn == 2) {
        //     return '초록';
        // }
        // else if(this.btn == 1) {
        //     return '노랑';
        // }
        // else {
        //     return '없음';
        // }
    }

    /**
     * 배터리 값을 반환합니다.(퍼센트)
     */
    getBatReading() {
        return this.battery;
    }

    /**
     * boolean 버튼 상태
     */
    boolean_getBtnReading(args) {
        let _btn = parseInt(args.BTN_SEL);
        let _stat = parseInt(args.BTN_STATE);

        let bStat = this.btn;

        var result = false;

        if (_stat == 0) //press
        {
            if((_btn == 8)&&(bStat == 8)) result = true;
            else if((_btn == 4) && (bStat == 4)) result = true;
            else if((_btn == 2) && (bStat == 2)) result = true;
            else if((_btn == 1) && (bStat == 1)) result = true;
            else result = false;
        }
        else if (_stat == 1) //release
        {
            if ((_btn == 8) && (bStat == 8)) result = false;
            else if ((_btn == 4) && (bStat == 4)) result = false;
            else if ((_btn == 2) && (bStat == 2)) result = false;
            else if ((_btn == 1) && (bStat == 1)) result = false;
            else result = true;
        }

        return result;
    }

    // ===============================================
    // 개별 블록 함수 (AI)
    // ===============================================

    /**
     * 감지 상태 선택
     */
    detector_state_select(args){
        const requestKey = args.DETECTOR;

        if (RequestType.hasOwnProperty(requestKey)) {
            const requestValue = RequestType[requestKey];

            if(args.STATE == 'on'){
                this._current_request |= requestValue;
               // console.log(this._current_request);
                // this.sendCommand(CommandType.COMMAND_NONE)
                return this.waitForSendLoopCheck(
                    this.actionMode,
                    CommandType.COMMAND_NONE
                );
            }
            else{
                this._current_request &= ~requestValue;
               // console.log(this._current_request);
              // this.sendCommand(CommandType.COMMAND_NONE)
                return this.waitForSendLoopCheck(
                    this.actionMode,
                    CommandType.COMMAND_NONE
                );
            }
        }
        else {
            console.error(`오류: 알 수 없는 요청 키이거나 정의되지 않은 값입니다: ${requestKey}`);
        }
    }

    /**
     *  인식 상태 값을 반환합니다.
     */
    getDetectorState(){
        let isFaceDetectionActive = false;
        let isCatDetectionActive = false;
        let isColorDetectionActive = false;
        let isMarkerDetectionActive = false;

        if (this._current_request & RequestType.REQUEST_ENTRY_FACE_DETECT)
        {
            isFaceDetectionActive = true;
        }
        if (this._current_request & RequestType.REQUEST_ENTRY_CAT_DETECT)
        {
            isCatDetectionActive = true;
        }
        if (this._current_request & RequestType.REQUEST_ENTRY_COLOR_DETECT)
        {
            isColorDetectionActive = true;
        }
        if (this._current_request & RequestType.REQUEST_ENTRY_APRIL_DETECT)
        {
            isMarkerDetectionActive = true;
        }

        // const s = (b) => b ? 'ON' : 'OFF';
        // return `얼굴:${s(isFaceDetectionActive)} 고양이:${s(isCatDetectionActive)} 색상:${s(isColorDetectionActive)} 마커:${s(isMarkerDetectionActive)}`;

        // 상태를 ON/OFF 대신 '켜짐'/'꺼짐' 다국어 문자열로 반환하는 함수
        const s = (b) => b ? Funtion_getDetectorState.on[theLocale] : Funtion_getDetectorState.off[theLocale];
        const sep = Funtion_getDetectorState.separator[theLocale];

        // 다국어 라벨을 사용하여 최종 문자열 구성
        const faceLabel = Funtion_getDetectorState.face[theLocale];
        const catLabel = Funtion_getDetectorState.cat[theLocale];
        const colorLabel = Funtion_getDetectorState.color[theLocale];
        const markerLabel = Funtion_getDetectorState.marker[theLocale];

        return `${faceLabel}${sep}${s(isFaceDetectionActive)} ${catLabel}${sep}${s(isCatDetectionActive)} ${colorLabel}${sep}${s(isColorDetectionActive)} ${markerLabel}${sep}${s(isMarkerDetectionActive)}`;
    }


    /**
     * boolean 얼굴,고양이 감지 상태
     */
    boolean_face_cat_detect(args) {

        const detectKey = args.FACE_SEL;

        if(detectKey == 'zumiFaceDetected')
        {
            return this.zumiFaceDetected;
        }
        else //if(detectKey == 'zumiCatDetected')
        {
            return this.zumiCatDetected;
        }
    }

    boolean_color_detect(args) {

        let col = parseInt(args.COLOR_SEL);
        let result = this.zumiColorDetected;

        if ((result == 0x00) && (col == '0')) result = true;
        else if ((result == 0x01) && (col == '1')) result = true;
        else if ((result == 0x02) && (col == '2')) result = true;
        else if ((result == 0x03) && (col == '3')) result = true;
        else if ((result == 0x04) && (col == '4')) result = true;
        else if ((result == 0x05) && (col == '5')) result = true;
        else if ((result == 0x06) && (col == '6')) result = true;
        else result = false;

        return result;
    }

    boolean_marker_detect(args) {

        let id = parseInt(args.ID_SEL);
        let result = this.zumiMarkerDetected;

        if(result <11) result +=1;
        else if(result == 14) result = 12;
        else if(result == 15) result = 13;
        else if(result == 16) result = 14;
        else if(result == 18) result = 15;
        else if(result == 19) result = 16;
        else if(result == 20) result = 17;

        if(id == result) result = true;
        else result = false;

        return result;
    }

    /**
     * 드롭다운 메뉴로 선택된 고양이 감지 값을 반환합니다.
     * 이 함수는 ZumiExtension 클래스의 속성에 직접 접근합니다.
     * @param {object} args - 블록 인수를 포함하는 객체 (예: { SENSOR: 'senFR' })
     * @returns {number} 선택된 센서의 최신 값
     */

    getCatDetectReading(args) {
        const detectKey = args.DETECT;
        var result = 0;
        var detect = this.zumiCatDetected;

        if(detectKey == 'zumiCatDetected')
        {
            result = detect;
        }
        else if(detectKey == 'zumiCatCenter[0]')
        {
            let Xg = this.zumiCatCenter[0];

            if (detect == 0x00) result = -999;
            else result = ((200 / 2) - Xg) + 20;
        }
        else if(detectKey == 'zumiCatCenter[1]')
        {
            let Yg = this.zumiCatCenter[1];

            if (detect == 0x00) result = -999;
            else result = ((200 / 2) - Yg) + 30;
        }
        return result;
    }

    getHumanDetectReading(args) {
        const detectKey = args.DETECT;
        var result = 0;
        var detect = this.zumiFaceDetected;

        if(detectKey == 'zumiFaceDetected')
        {
            result = detect;
        }
        else if(detectKey == 'zumiFaceCenter[0]')
        {
            let Xg = this.zumiFaceCenter[0];

            if (detect == 0x00) result = -999;
            else result = ((200 / 2) - Xg) + 10;
        }
        else if(detectKey == 'zumiFaceCenter[1]')
        {
            let Yg = this.zumiFaceCenter[1];

            if (detect == 0x00) result = -999;
            else result = ((200 / 2) - Yg) + 35;
        }
        return result;
    }

    getMarkerDetectReading(args) {
        const detectKey = args.DETECT;
        var result = 0;
        var id = this.zumiMarkerDetected;

        if(detectKey == 'zumiMarkerDetected')
        {
            result = id;

            if(id <11) result +=1;
            else if(id == 14) result = 12;
            else if(id == 15) result = 13;
            else if(id == 16) result = 14;
            else if(id == 18) result = 15;
            else if(id == 19) result = 16;
            else if(id == 20) result = 17;

            else if(id == 0xFE) result = -1;
        }
        else if(detectKey == 'zumiMarkerCenter[0]')
        {
            let Xg = this.zumiMarkerCenter[0];
            if(id == 0xFE) result = -999;
            else result = (200 / 2) - Xg;
        }
        else if (detectKey == 'zumiMarkerCenter[1]')
        {
            let Yg = this.zumiMarkerCenter[1];
            if (id == 0xFE) result = -999;
            else result = ((200 / 2) - Yg)+ 35;
        }
        return result;
    }

    getColorDetectReading(args) {
        const detectKey = args.DETECT;
        var result = 0;
        var color = this.zumiColorDetected;

        if(detectKey == 'zumiColorDetected')
        {
            result = color;

            if((color == 0xFE)) result = 'NONE';
            else if (color == 0x00)  result = 'RED';
            else if (color == 0x01)  result = 'ORANGE';
            else if (color == 0x02)  result = 'YELLOW';
            else if (color == 0x03)  result = 'GREEN';
            else if (color == 0x04)  result = 'CYAN';
            else if (color == 0x05)  result = 'BLUE';
            else if (color == 0x06)  result = 'PURPLE';
        }
        else if(detectKey == 'zumiColorCenter[0]')
        {
            let Xg = this.zumiColorCenter[0];
            if (color == 0xFE) result = -999;
            else result = ((200 / 2) - Xg) +20;
        }
        else if (detectKey == 'zumiColorCenter[1]')
        {
            let Yg = this.zumiColorCenter[1];
            if (color == 0xFE) result = -999;
            else result = ((200 / 2) - Yg) +35;
        }
        return result;
    }


        // ===============================================
        // 연결 상태 전송 -> GUI 표시
        // ===============================================
        sendGUI_ConnectionStatus(value)
        {
            //var newStatus ="ok"
            this.runtime.emit('CONNECTION_STATUS', value);
        };





        // ===============================================
        // 데이터 수신
        // ===============================================

        /**
         * 연결 타임아웃 타이머를 시작/재설정하고, 타임아웃 발생 시 연결 상태를 false로 변경합니다.
         */
        _resetConnectionTimeout() {
            // 1. 기존 타이머가 있다면 취소합니다. (이전 패킷 수신이 성공했으므로)
            if (this.connectionTimeoutHandler) {
                clearTimeout(this.connectionTimeoutHandler);
            }

            // 2. 새로운 타이머를 설정합니다. 지정된 시간 내에 다음 패킷이 오지 않으면 실행됩니다.
            this.connectionTimeoutHandler = setTimeout(() => {
                // 타임아웃 발생!
                if (this.connectState === true) {
                    this.connectState = false; // 연결 상태를 끊김(false)으로 변경
                }
            }, this.CONNECTION_TIMEOUT_MS);
        }

        /**
         * 데이터 저장소 업데이트
         */
        _updateDataStore(dataArray) {

            const offset = this.HEADER_LENGTH;

            // 1. 상태 플래그 업데이트
            this.reqINFO = dataArray[PacketIndex.DATA_INFO - offset];
            this.reqREQ = dataArray[PacketIndex.DATA_REQ - offset];
            this.reqPSTAT = dataArray[PacketIndex.DATA_PSTAT - offset];
            this.btn = dataArray[PacketIndex.DATA_BTN_INPUT - offset];
            this.battery = dataArray[PacketIndex.DATA_BATTERY - offset];

            // 2. IR 센서 업데이트
            this.senFR = dataArray[PacketIndex.DATA_SEN_FR - offset];
            this.senFL = dataArray[PacketIndex.DATA_SEN_FL - offset];
            this.senBR = dataArray[PacketIndex.DATA_SEN_BR - offset];
            this.senBC = dataArray[PacketIndex.DATA_SEN_BC - offset];
            this.senBL = dataArray[PacketIndex.DATA_SEN_BL - offset];

            // 3. 객체 감지 데이터 업데이트 (Boolean과 좌표)
            // 얼굴
            this.zumiFaceDetected = dataArray[PacketIndex.DATA_DETECT_FACE - offset] === 1;
            this.zumiFaceCenter[0] = dataArray[PacketIndex.DATA_DETECT_FACE_X - offset];
            this.zumiFaceCenter[1] = dataArray[PacketIndex.DATA_DETECT_FACE_Y - offset];

            // 색상
            this.zumiColorDetected = dataArray[PacketIndex.DATA_DETECT_COLOR - offset];
            this.zumiColorCenter[0] = dataArray[PacketIndex.DATA_DETECT_COLOR_X - offset];
            this.zumiColorCenter[1] = dataArray[PacketIndex.DATA_DETECT_COLOR_Y - offset];

            // 마커
            this.zumiMarkerDetected = dataArray[PacketIndex.DATA_DETECT_MARKER - offset];
            this.zumiMarkerCenter[0] = dataArray[PacketIndex.DATA_DETECT_MARKER_X - offset];
            this.zumiMarkerCenter[1] = dataArray[PacketIndex.DATA_DETECT_MARKER_Y - offset];

            // 고양이
            this.zumiCatDetected = dataArray[PacketIndex.DATA_DETECT_CAT - offset] === 1;
            this.zumiCatCenter[0] = dataArray[PacketIndex.DATA_DETECT_CAT_X - offset];
            this.zumiCatCenter[1] = dataArray[PacketIndex.DATA_DETECT_CAT_Y - offset];

            //console.log(this.zumiMarkerDetected);
        }

        /**
         * 시리얼 포트로부터 데이터 읽기 (비동기 리스너)
         */
        _processReceiverByte(data) {
            // 1. Failure 상태 초기화
            if (this.receiverState === this.StateLoading.Failure) {
                this.receiverState = this.StateLoading.Ready;
            }

            // 2. Ready 상태: 초기화 및 Start 섹션 진입
            if (this.receiverState === this.StateLoading.Ready) {
                this.receiverSection = this.Section.Start;
                this.receiverIndex = 0;
            }

            else if (this.receiverState === this.StateLoading.Loaded){
                return this.receiverState;
            }

            // 3. section check
            if (this.receiverSection !== this.receiverSectionOld) {
                this.receiverIndex = 0;
                this.receiverSectionOld = this.receiverSection;
            }

            // 4. Section.Start: 헤더 확인
            if (this.receiverSection === this.Section.Start) {
                if (this.receiverIndex === 0) {
                    if (data === this.PACKET_START_BYTE1) { // 0x24 ($)
                        this.receiverState = this.StateLoading.Receiving;
                    } else {
                        this.receiverState = this.StateLoading.Failure;
                       // this.receiverMessage = "Error: Invalid Start Byte 1";
                      //  console.log(receiverMessage);
                        return this.receiverState;
                    }
                } else if (this.receiverIndex === 1) {
                    if (data === this.PACKET_START_BYTE2) { // 0x52 (R)
                        this.receiverSection = this.Section.Data; // 데이터 섹션으로 이동
                        this.receiverBuffer = []; // 데이터 저장 버퍼 초기화
                    } else {
                        this.receiverState = this.StateLoading.Failure;
                       // this.receiverMessage = "Error: Invalid Start Byte 2";
                       // console.log(receiverMessage);
                        return this.receiverState;
                    }
                }
            }

            // 5. Section.Data: 데이터 본문 수집
            else if (this.receiverSection === this.Section.Data) {
                this.receiverBuffer.push(data);
                if (this.receiverIndex === (this.PACKET_DATA_LENGTH - 1)) {
                    this.receiverSection = this.Section.End; // End 섹션으로 이동
                }
            }

            // 6. Section.End: 패킷 완료 (파이썬 코드에서 CRC/꼬리가 생략된 것으로 추정)
            else if (this.receiverSection === this.Section.End) {

                if (this.receiverIndex === 1) {
                    this.receiverData = [...this.receiverBuffer]; // 최종 데이터 복사
                    this.receiverState = this.StateLoading.Loaded;
                   // this.receiverMessage = "Success: Receive complete";

                    // =======================================================
                    // 수신 완료 시 연결 상태 설정 및 타이머 재설정
                    this.connectState = true;
                    this._resetConnectionTimeout(); // 다음 패킷을 기다리는 타이머 시작!
                    // =======================================================

                    return this.receiverState;
                }
            }

            // 6. 인덱스 증가 (Receiving 상태일 때만)
            if (this.receiverState === this.StateLoading.Receiving) {
                this.receiverIndex++;
            }

            return this.receiverState;
        }

        // Receiver 상태를 초기화하는 보조 함수
        _resetReceiverState() {
            this.receiverState = this.StateLoading.Ready;
            this.receiverSection = this.Section.Start;
            this.receiverIndex = 0;
            this.receiverBuffer = []; // 수신 버퍼 클리어
          //  this.receiverMessage = null;
        }


    /**
     * 웹 시리얼 포트에서 수신된 원시 데이터(Uint8Array)를 처리하고
     * 패킷을 재조립하여 데이터 저장소를 업데이트합니다.
     * * @param {Uint8Array} data - 시리얼 포트에서 읽은 원시 바이트 데이터.
     */
        processRawData(data) {
            // 1. 수신된 원시 데이터를 내부 버퍼에 추가합니다.
            // this.bufferHandler는 bytearray (Uint8Array)와 유사한 역할입니다.
            // 여기서는 간단히 배열로 처리하겠습니다.
            if (!this.bufferHandler) {
                this.bufferHandler = []; // 초기화
            }

            // Uint8Array의 각 요소를 일반 배열에 추가
            for (const byte of data) {
                this.bufferHandler.push(byte);
            }

            // 2. 버퍼에 데이터가 남아있는 한, 바이트 단위로 Receiver 로직을 수행합니다.
            while (this.bufferHandler.length > 0) {
                // 버퍼의 첫 번째 바이트를 꺼내서 처리합니다. (파이썬의 pop(0)과 유사)
                const byte = this.bufferHandler.shift();

                // **3. Receiver 로직 (State Machine) 실행**
                const stateLoading = this._processReceiverByte(byte);

                // 4. 패킷 완료 확인 및 처리
                if (stateLoading === this.StateLoading.Loaded) {

                    this._updateDataStore(this.receiverData);

                    // Receiver 상태 초기화 (다음 패킷을 받을 준비)
                    this._resetReceiverState();

                    //console.log("Packet received and data store updated.");

                    // 루프를 다시 시작하여 버퍼에 남아있는 데이터가 있는지 확인합니다.
                    continue;
                }
                // 5. 오류 처리 (파이썬의 StateLoading.Failure)
                if (stateLoading === this.StateLoading.Failure) {
                    // console.error("Receiver Error:", this.receiverMessage);
                    // Receiver 상태 초기화
                    this._resetReceiverState();
                    // 버퍼에 남아있는 데이터는 다음 패킷의 시작일 수 있으므로 버퍼를 비우지 않습니다.
                }
            }
        }

        // async readSerial() {
        //     if (!this.serialPort || !this.serialPort.readable) return;
        //     this.reader = this.serialPort.readable.getReader();
        //     while (true) {
        //         try {
        //             const { value, done } = await this.reader.read();
        //             if (done) break;
        //             this.processRawData(value); // Receiver 역할 수행
        //         } catch (error) {
        //             // 포트가 닫힌 경우 등
        //             break;
        //         }
        //     }
        // }

        // -----------------------------------------------------
        // [추가된 부분] Notify 관련 로직
        // -----------------------------------------------------

        /**
         * Characteristic 값이 변경될 때마다 호출되는 리스너 함수.
         * @param {Event} event
         */
        handleCharacteristicValueChanged(event) {
            const value = event.target.value; // DataView 객체

            // DataView를 Uint8Array로 변환
            const byteArray = new Uint8Array(value.buffer);

            // 수신된 데이터를 콘솔에 출력하여 확인합니다.
            //console.log('--- BLE NOTIFY RECEIVED ---');
            //console.log('Raw Data (Uint8Array):', byteArray);

            this.processRawData(byteArray); // Receiver 역할 수행

            // // 텍스트로 변환하여 출력 (옵션)
            // try {
            //     const textDecoder = new TextDecoder('utf-8');
            //     const textValue = textDecoder.decode(value.buffer);
            //     console.log('Text Value:', textValue);
            // } catch (e) {
            //     console.warn('Received data is not valid UTF-8 text.', e);
            // }

            // Scratch 런타임에 이벤트를 발생시켜 스크래치 블록에서 데이터를 사용할 수 있게 할 수 있습니다.
            // 예: this.runtime.emit('ZUMI_DATA_RECEIVED', byteArray);
           // console.log('-----------------------------');
        }

        // ===============================================
        // 데이터 전송
        // ===============================================

        // 커맨드와 파라미터 형태 구성
        async sendCommand(commandType, ...params) {

            const commandName = Object.keys(CommandType).find(key => CommandType[key] === commandType);
            if (!commandName) {
                console.error(`Unknown commandType: ${commandType}`);
                return;
            }

            // 1. 데이터 본문 구성 (파이썬 Command_variable_byte.toArray()의 일부)
            const paramLength = CommandType_DATA_LENGTH[commandName] || 0;
            // 커맨드 바이트(1) + 파라미터(N)
            const payloadBytes = new Uint8Array(1 + paramLength);

            payloadBytes[0] = commandType;

            for (let i = 0; i < params.length && i < paramLength; i++) {
                // 파라미터는 1바이트 크기로 전송
                payloadBytes[i + 1] = params[i] & 0xFF;
            }

            if((commandType == CommandType.COMMAND_MOTOR1_INFINITE) || (commandType== CommandType.COMMAND_MOTOR2_INFINITE))
            {
                this.motorTrigger = true;
            }
            else
            {
                this.motorTrigger = false;
            }

            // 전송 데이터 패킷 구성
            await this.makePacket(payloadBytes);
        }

        // 실제 보낼 데이터 패킷 구성
        async makePacket(payloadBytes) {

            // 전체 전송 데이터 배열 구성 (파이썬 makeTransferDataArray 역할)
            const HEADER1 = 0x24; // '$'
            const HEADER2 = 0x52; // 'R'

            // 전체 메시지 길이: 헤더(2) + 커맨드(1) + 리퀘스트(1) + 파라미터(paramLength)
            const fullMessageLength = 4 + payloadBytes.length-1;

            const dataArray = new Uint8Array(fullMessageLength);
            let index = 0;

            // 헤더 ($R)
            dataArray[index++] = HEADER1;
            dataArray[index++] = HEADER2;

            // 커맨드 바이트
            dataArray[index++] = payloadBytes[0];

            // 리퀘스트 바이트
            dataArray[index++] = this._current_request;

            // 파라미터 데이터
            // payloadBytes.slice(1)은 commandType을 제외한 파라미터들만 포함 (파이썬 data[1:]에 해당)
            dataArray.set(payloadBytes.slice(1), index);


            // 새로운 명령으로 단일 버퍼를 덮어씁니다.
            this.nextCommandPayload = dataArray;
        }

        // 실제 데이터 전송
        async transferData(dataArray) {

            if (this.device == null) {
                console.warn("bluetooth not ready. Cannot transfer.");
                return;
            }

            this.isSending = true; // 전송 시작 플래그 ON
            try {
                // 명령을 보낼 때마다 새로운 writer 객체를 획득 (락 획득)
               // writer = this.serialPort.writable.getWriter();

                // 쓰기 작업
                //await writer.write(dataArray);
                await this.characteristic.writeValue(dataArray);
            } catch (error) {
                // 락 획득 또는 쓰기 작업 중 오류 발생 시
                console.error("bluetooth Write Error:", error);

            } finally {
                // 오류 여부와 관계없이 락 해제
                // if (writer) {
                //     writer.releaseLock();
                // }
                this.isSending = false; // 전송 완료/실패 후 플래그 OFF
            }
        }

        // 루프 시작 함수 (connectPort 성공 시 호출)
        startSendingLoop() {
            if (this.isLoopRunning) return;
            this.isLoopRunning = true;
            console.log("Starting " + this.sendingLoopTime + "ms sending loop...");

            this.setNotify();

            // 첫 호출 시 바로 실행하고, 재귀적으로 setTimeout을 사용하여 주기를 제어
            this.sendingLoop();
        }

        // sendingLoopTime 시간마다 실행될 실제 루프
        async sendingLoop() {
            const startTime = Date.now();
            // 1. 현재 전송 중이 아니라면, 데이터를 보낼지 결정
            if (!this.isSending && this.device != null) {
                let dataToSend;

                if (this.nextCommandPayload) {
                    // 2. 보낼 데이터가 있다면 큐에서 꺼냄 (명령 데이터)
                    dataToSend = this.nextCommandPayload;
                    this.nextCommandPayload = null; // 사용했으므로 버퍼 비우기

                    await this.transferData(dataToSend);

                    this.checkedSendLoop = 0;
                }
                else if (this.motorTrigger == true){
                    // 모터가 작동중인 경우, 모터를 멈추지 않도록 보냄
                    const sendACK= new Uint8Array([
                        0x24,
                        0x52,
                        CommandType.COMMAND_MOTOR1_INFINITE,
                        this._current_request,
                        this.tSpd1,
                        this.tSpd2,
                        this.tDir
                    ]);

                    await this.transferData(sendACK); // 디버그 시 정지

                }
                else {
                    // 3. 보낼 데이터가 없다면 기본 ACK/유지 명령을 보냄 (50ms 주기 유지)
                    // ACK/Heartbeat 명령의 payloadBytes를 여기에 직접 만듭니다.
                    // (예: COMMAND_WAIT를 0바이트로 전송하거나, 별도의 ACK 커맨드를 정의해야 함)
                    // 임시: COMMAND_GOGO (파라미터 0개)를 ACK처럼 사용
                    // const commandType = CommandType.COMMAND_NONE;
                    // dataToSend = new Uint8Array([commandType]);

                //  const sendACK= [0x24,0x52,0x00,this._current_request,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF]; //stop
                    // 올바른 Uint8Array 형식으로 변경
                    const sendACK = new Uint8Array([
                        0x24, // HEADER1 '$'
                        0x52, // HEADER2 'R'
                        0x00, // COMMAND_TYPE (예: ACK/NOP)
                        this._current_request,
                        0x00, 0x00, 0x00, 0x00, 0x00, // 파라미터 및 기타 데이터
                        0xFF, 0xFF // 아마도 패킷 끝/체크섬 등
                    ]);

                    await this.transferData(sendACK); // 디버그 시 정지
                }

                // 데이터 전송 실행 (비동기로 실행되나, 다음 루프를 막지는 않음)
                // transferData를 사용하여 락 획득/해제는 내부에서 처리
            }

            // 2. 남은 시간 계산 후 다음 루프 예약
            const elapsedTime = Date.now() - startTime;
            // 주기를 유지하도록 딜레이를 계산합니다.
            const delay = Math.max(0, this.sendingLoopTime - elapsedTime);

            // ️ setTimeout을 사용하여 다음 루프 실행을 예약합니다.
            if (this.isLoopRunning) {
                setTimeout(() => {
                    this.sendingLoop(); // 자기 자신을 다시 호출하여 루프를 지속
                }, delay);
            }
        }





        // ===============================================
        // 블루투스 연결 및 설정
        // ===============================================

        /**
         * [Zumi BLE 장치 연결] 블록의 실제 로직.
         * Web Bluetooth API를 사용하여 장치를 검색하고 연결합니다.
         * @returns {Promise<void>} 비동기 작업 결과
         */
        async connectDevice() {
            // 이미 연결되어 있다면 재시도하지 않습니다.
            if (this.device && this.device.gatt.connected) {
                console.log("이미 연결되어 있습니다.");
                return;
            }


            if (!navigator.bluetooth) {
                // [수정된 부분] Web Bluetooth 미지원 시 명확한 메시지 출력
                const errorMessage = ' 이 브라우저는 Web Bluetooth를 지원하지 않습니다 (Chrome/Edge 사용 권장).';
                // alert(errorMessage); // alert 대신 Scratch 환경에 맞는 UI 메시지를 사용하는 것이 좋습니다.
                console.error(errorMessage);
                return Promise.reject('Web Bluetooth API를 사용할 수 없습니다.');
            }

            console.log(`장치 검색 및 연결 시도: ${Scratch3Esp32Bluetooth.DEVICE_NAME}`);



            try {
                // 1. 장치 요청 (검색) - ️ 이 부분을 수정해야 합니다.
                const device = await navigator.bluetooth.requestDevice({
                    // name 대신 namePrefix를 사용하여 "ZumiAI-"로 시작하는 모든 장치를 검색합니다.
                    filters: [{
                        namePrefix: Scratch3Esp32Bluetooth.DEVICE_NAME
                    }],
                    optionalServices: [Scratch3Esp32Bluetooth.SERVICE_UUID]
                });

                this.device = device;





            // try {
            //     // 1. 장치 요청 (검색)
            //     const device = await navigator.bluetooth.requestDevice({
            //         filters: [{ name: Scratch3Esp32Bluetooth.DEVICE_NAME }],
            //         optionalServices: [Scratch3Esp32Bluetooth.SERVICE_UUID]
            //     });

            //     this.device = device;

                // 2. 연결 해제 이벤트 리스너 등록
                this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

                console.log(`장치 연결 중 (${device.name})...`);

                // 3. GATT 서버 연결
                const server = await device.gatt.connect();

                // 4. 서비스 가져오기
                const service = await server.getPrimaryService(Scratch3Esp32Bluetooth.SERVICE_UUID);

                // 5. Characteristic 가져오기
                this.characteristic = await service.getCharacteristic(Scratch3Esp32Bluetooth.CHARACTERISTIC_UUID);

                // 6. Notify 리스너를 미리 추가합니다. (notifications 시작/중지 시 활성화)
                this.characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this));

                console.log(' ZumiAI 장치 연결 성공!');

                this.sendGUI_ConnectionStatus("ok")

                this.startSendingLoop();


            } catch (error) {
                console.error(' BLE 연결 오류:', error);
                this.device = null;
                this.characteristic = null;

                // "Bluetooth adapter not available." 오류를 명확하게 구분하여 안내
                if (error.message && error.message.includes('Bluetooth adapter not available')) {
                    // alert(' 블루투스 어댑터 오류: 컴퓨터의 블루투스가 켜져 있는지 확인하고 브라우저를 재시작해 보세요.');
                    console.error('Bluetooth 어댑터에 접근할 수 없습니다. OS 설정 확인 필요.');
                    return Promise.reject('Bluetooth 어댑터에 접근할 수 없습니다. OS 설정 확인 필요.');
                }

                // Scratch에게 기타 오류 발생을 알립니다.
               // return Promise.reject(`연결 실패: ${error.message}`);
            }
        }

        // ===============================================
        // 개별 블록 함수 (블루투스 연결 및 설정)
        // ===============================================
        /**
         * [장치 연결 끊기] 블록의 실제 로직.
         * 연결된 장치의 GATT 서버 연결을 끊습니다.
         */
        disconnectDevice() {
            if (this.device && this.device.gatt.connected) {
                console.log('연결 해제 요청 중...');
                // onDisconnected 이벤트가 자동으로 실행되어 상태를 정리합니다.
                this.device.gatt.disconnect();

                this.sendGUI_ConnectionStatus("no")
            } else {
                console.log('이미 연결이 끊어져 있습니다.');
            }
        }

        /**
         * 연결 해제 이벤트 핸들러.
         * 장치와 연결이 끊어졌을 때 호출됩니다.
         */
        onDisconnected() {
            console.log(' 장치와 연결이 해제되었습니다.');

            this.isLoopRunning = false; // 루프 중지 플래그 설정
            this.receivedData = '';

            this.device = null;
            this.characteristic = null;

            // 필요하다면 Scratch 런타임에 이벤트를 발생시킬 수 있습니다.
            // 예: this.runtime.emit('BLE_DISCONNECTED');
        }

        /**
         * [장치가 연결되었는가?] 블록의 실제 로직.
         * @returns {boolean} 현재 장치에 연결되어 있으면 true
         */
        isConnected() {
            // 장치 객체가 있고, GATT 서버가 연결 상태인지 확인
            return !!(this.device && this.device.gatt.connected);
        }


        /**
         * [데이터 알림 활성화/비활성화] 블록의 실제 로직.
         * @param {object} args - STATE ('활성화' 또는 '비활성화')
         * @returns {Promise<void>}
         */
        // async toggleNotify(args) {
        //     if (!this.characteristic) {
        //         console.error('Notify를 설정할 Characteristic이 없습니다. 먼저 장치에 연결하세요.');
        //         return;
        //     }

        //     const state = args.STATE.toLowerCase();

        //     try {
        //         if (state === '활성화' && !this.isNotifying) {
        //             await this.characteristic.startNotifications();
        //             this.isNotifying = true;
        //             console.log(' BLE Notify 활성화 완료.');
        //         } else if (state === '비활성화' && this.isNotifying) {
        //             await this.characteristic.stopNotifications();
        //             this.isNotifying = false;
        //             console.log(' BLE Notify 비활성화 완료.');
        //         } else {
        //             console.log(`Notify 상태가 이미 ${state}입니다.`);
        //         }
        //     } catch (error) {
        //         console.error('Notify 설정 중 오류 발생:', error);
        //         return Promise.reject(`Notify 설정 실패: ${error.message}`);
        //     }
        // }
        async setNotify() {
            if (!this.characteristic) {
                console.error('Notify를 설정할 Characteristic이 없습니다. 먼저 장치에 연결하세요.');
                return;
            }

           // const state = args.STATE.toLowerCase();

            try {
                await this.characteristic.startNotifications();
                this.isNotifying = true;
                console.log(' BLE Notify 활성화 완료.');

                // if (state === '활성화' && !this.isNotifying) {
                //     await this.characteristic.startNotifications();
                //     this.isNotifying = true;
                //     console.log(' BLE Notify 활성화 완료.');
                // }
                // else if (state === '비활성화' && this.isNotifying)
                // {
                //     await this.characteristic.stopNotifications();
                //     this.isNotifying = false;
                //     console.log(' BLE Notify 비활성화 완료.');
                // }
                // else
                // {
                //     console.log(`Notify 상태가 이미 ${state}입니다.`);
                // }
            }
            catch (error) {
                console.error('Notify 설정 중 오류 발생:', error);
                return Promise.reject(`Notify 설정 실패: ${error.message}`);
            }
        }


        // // -----------------------------------------------------
        // // [NEW] 고정 패킷 전송 로직
        // // -----------------------------------------------------

        // /**
        //  * [고정 패킷 (24 52 0A 00 0A 0A 0A) 전송] 블록의 실제 로직.
        //  * 미리 정의된 HEX 명령을 장치로 전송합니다.
        //  * @returns {Promise<void>}
        //  */
        // async sendFixedCommand() {
        //     if (!this.characteristic) {
        //         console.error('Characteristic이 없습니다. 먼저 장치에 연결하세요.');
        //         return;
        //     }

        //     try {
        //         const FIXED_COMMAND_BYTES = [0x24, 0x52, 0x0A, 0x00, 0x0A, 0x0A, 0x0A];

        //         // 1. 고정 바이트 배열을 Uint8Array로 변환하여 dataBuffer 생성
        //         // Web Bluetooth API의 writeValue 메서드는 Typed Array(Uint8Array)를 기대합니다.
        //         const dataBuffer = new Uint8Array(FIXED_COMMAND_BYTES).buffer;

        //         // 2. 값 쓰기 (Write with Response)
        //         await this.characteristic.writeValue(dataBuffer);

        //         console.log(` 고정 패킷 전송 성공: ${FIXED_COMMAND_BYTES}`);
        //     } catch (error) {
        //         console.error(' 고정 패킷 전송 오류:', error);
        //         return Promise.reject(`고정 패킷 전송 실패: ${error.message}`);
        //     }
        // }

        // async sendFixedCommand1() {
        //     if (!this.characteristic) {
        //         console.error('Characteristic이 없습니다. 먼저 장치에 연결하세요.');
        //         return;            }

        //     try {
        //         const FIXED_COMMAND_BYTES = [0x24, 0x52, 0x0A, 0x00, 0x00, 0x00, 0x00];

        //         // 1. 고정 바이트 배열을 Uint8Array로 변환하여 dataBuffer 생성
        //         // Web Bluetooth API의 writeValue 메서드는 Typed Array(Uint8Array)를 기대합니다.
        //         const dataBuffer = new Uint8Array(FIXED_COMMAND_BYTES).buffer;

        //         // 2. 값 쓰기 (Write with Response)
        //         await this.characteristic.writeValue(dataBuffer);

        //         console.log(` 고정 패킷 전송 성공: ${FIXED_COMMAND_BYTES}`);
        //     } catch (error) {
        //         console.error(' 고정 패킷 전송 오류:', error);
        //         return Promise.reject(`고정 패킷 전송 실패: ${error.message}`);
        //     }
        // }




openConfig() {
    this._openConfig();
}

_openConfig() {
    // 이미 열려있으면 삭제
    const oldModal = document.getElementById('zumi-config-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'zumi-config-modal';
    modal.style = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 20px;
            border-radius: 12px;
            width: 320px;
            font-size: 16px;
        ">
            <h3>${Zumi_Config.title[theLocale]}</h3>

            <!--
            <div style="text-align:center; margin-bottom:10px;">
                <img src="data:image/png;base64,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"
                    width="100" height="100">
            </div>
            -->
<!--
            <label>통신 간격 선택</label><br>
            <select id="esp32-port-select" style="width:100%; margin-bottom: 10px;">
                <option>100 ms</option>
                <option>150 ms</option>
                <option>200 ms</option>
            </select>
-->
            <label>${Zumi_Config.actionMode[theLocale]}</label><br>

            <select id="esp32-mode" style="width:100%; margin-bottom: 10px;">
                <option value="0">${Zumi_Config.modeSequential[theLocale]}</option>
                <option value="1">${Zumi_Config.modeImmediate[theLocale]}</option>
            </select>


            <div style="margin-top: 15px; text-align:right;">
                <button id="esp32-save-btn">${Zumi_Config.save[theLocale]}</button>
                <button id="esp32-close-btn">${Zumi_Config.close[theLocale]}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 닫기 버튼 이벤트
    document.getElementById('esp32-close-btn').onclick = () => modal.remove();

    // 저장 버튼 이벤트
    document.getElementById('esp32-save-btn').onclick = () => {
      //  this.testMode = document.getElementById('esp32-port-select').value;
       // this.actionMode = document.getElementById('esp32-mode').value;
        this.actionMode = Number(
            document.getElementById('esp32-mode').value
        );
        console.log('Saved config:',this.actionMode);

        modal.remove();
    };
}




}

module.exports = Scratch3Esp32Bluetooth;