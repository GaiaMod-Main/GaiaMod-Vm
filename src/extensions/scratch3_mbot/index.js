const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const { MBotAPI } = require('./dist/main.js');

const menuIconURI = "";
const blockIconURI = "";

const mbotIP = window.location.hostname;

const FT_TO_M = 0.3048;
const DEG_TO_RAD = Math.PI / 180;

class Scratch3MBot {
    mbot;
    mbot_odom;
    mbot_scan;
    loopRunning = false;
    stopLoop = false;

    constructor(runtime) {
        this.runtime = runtime;
        this.connectToServer();
    }

    connectToServer() {
        this.mbot = new MBotAPI.MBot(mbotIP);
        this.mbot.readHostname().then(hostname => console.log('hostname:', hostname));
        this.mbot.readChannels().then(chs => console.log('chs:', chs));
        this.mbot.drive(0, 0, 0);

        this.mbot.subscribe(MBotAPI.config.ODOMETRY.channel, odom => {
            this.mbot_odom = odom;
        });
        this.mbot.subscribe(MBotAPI.config.LIDAR.channel, scan => {
            this.mbot_scan = scan;
        });
    }

    getInfo() {
        return {
            id: 'mbot',
            name: formatMessage({
                id: 'mbot',
                default: 'MBot extension',
                description: 'Name of the MBot extension.'
            }),
            blockIconURI,
            menuIconURI,
            blocks: [
                {
                    opcode: 'driveTo',
                    text: formatMessage({
                        id: 'mbot.driveToBlock',
                        default: 'drive to x: [X], y: [Y]',
                        description: 'Drive the MBot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: { type: ArgumentType.NUMBER, defaultValue: 0.0 },
                        Y: { type: ArgumentType.NUMBER, defaultValue: 0.0 }
                    }
                },
                {
                    opcode: 'driveDirection',
                    text: formatMessage({
                        id: 'mbot.driveDirectionBlock',
                        default: 'drive to the [DIRECTION] at [SPEED] m/s',
                        description: 'Drive the MBot in the specified direction'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: { type: ArgumentType.STRING, menu: 'direction', defaultValue: 'front' },
                        SPEED:     { type: ArgumentType.NUMBER, defaultValue: 0.0 }
                    }
                },
                {
                    opcode: 'detectObstacle',
                    text: formatMessage({
                        id: 'mbot.detectObstacleBlock',
                        default: 'detect obstacle at [ANGLE] degrees within [DIST] meters',
                        description: 'Checks for an obstacle in the surrounding area'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIST:  { type: ArgumentType.NUMBER, defaultValue: 0.5 },
                        ANGLE: { type: ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: 'driveVel',
                    text: formatMessage({
                        id: 'mbot.driveVelBlock',
                        default: 'drive at vx: [VX] vy: [VY] wz: [WZ]°',
                        description: 'Drive at the specified vx, vy, and wz'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VX:     { type: ArgumentType.NUMBER, defaultValue: 0.5 },
                        VY:     { type: ArgumentType.NUMBER, defaultValue: 0.5 },
                        WZ:  { type: ArgumentType.NUMBER, defaultValue: 0 },
                    }
                },
                {
                    opcode: 'driveArc',
                    text: formatMessage({
                        id: 'mbot.driveArcBlock',
                        default: 'drive arc to the [ARCDIRECTION] at [VX] m/s with radius [RADIUS] m',
                        description: 'Drive the MBot in an arc.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ARCDIRECTION: { type: ArgumentType.STRING, menu: 'arcdirection', defaultValue: 'left' },
                        VX:           { type: ArgumentType.NUMBER, defaultValue: 0.5 },
                        RADIUS:       { type: ArgumentType.NUMBER, defaultValue: 1.0 }
                    }
                },
                {
                    opcode: 'driveTheta',
                    text: formatMessage({
                        id: 'mbot.driveThetaBlock',
                        default: 'drive at [THETA]° at [SPEED] m/s',
                        description: 'Drive the MBot at a given heading'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        THETA: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        SPEED: { type: ArgumentType.NUMBER, defaultValue: 0.5 }
                    }
                },
                {
                    opcode: 'driveDirectionForDist',
                    text: formatMessage({
                        id: 'mbot.driveDirectionforDistBlock',
                        default: 'drive [DIRECTION] [DIST] meters',
                        description: 'Drive in a straight line for a distance.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: { type: ArgumentType.STRING, menu: 'direction', defaultValue: 'front' },
                        DIST:      { type: ArgumentType.NUMBER, defaultValue: 1.0 }
                    }
                },
                { opcode: 'stop', text: formatMessage({id:'mbot.stopBlock', default:'stop MBot'}), blockType:BlockType.COMMAND },
                { opcode: 'angleToNearestObstacle',   text: formatMessage({id:'mbot.angleToNearestObstacle', default:'Angle to nearest obstacle'}),   blockType:BlockType.REPORTER },
                { opcode: 'distanceToNearestObstacle',text: formatMessage({id:'mbot.distanceToNearestObstacle', default:'Distance to nearest obstacle'}),blockType:BlockType.REPORTER },
                {
                    opcode: 'detectObstacleInDirection',
                    text: formatMessage({
                        id: 'mbot.detectObstacleInDirectionBlock',
                        default: 'detect obstacle [DIRECTION] within [DIST] meters'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        DIRECTION: { type: ArgumentType.STRING, menu: 'direction', defaultValue: 'front' },
                        DIST:      { type: ArgumentType.NUMBER, defaultValue: 0.5 }
                    }
                },
                { opcode: 'resetPosition',   text: formatMessage({id:'mbot.resetPositionBlock', default:'Reset position'}),   blockType:BlockType.COMMAND },
                { opcode: 'getXPosition',    text: formatMessage({id:'mbot.getXPositionBlock', default:'X Position'}),    blockType:BlockType.REPORTER },
                { opcode: 'getYPosition',    text: formatMessage({id:'mbot.getYPositionBlock', default:'Y Position'}),    blockType:BlockType.REPORTER },
                { opcode: 'getHeading',      text: formatMessage({id:'mbot.getHeadingBlock', default:'Heading'}),      blockType:BlockType.REPORTER }
            ],
            menus: {
                direction: {
                    acceptReporters: true,
                    items: [
                        { text: formatMessage({id:'mbot.dirFront', default:'front'}), value:'front' },
                        { text: formatMessage({id:'mbot.dirBack', default:'back'}),   value:'back'  },
                        { text: formatMessage({id:'mbot.dirLeft', default:'left'}),   value:'left'  },
                        { text: formatMessage({id:'mbot.dirRight',default:'right'}),  value:'right' }
                    ]
                },
                arcdirection: {
                    acceptReporters: true,
                    items: [
                        { text: formatMessage({id:'mbot.dirLeft', default:'left'}),  value:'left'  },
                        { text: formatMessage({id:'mbot.dirRight',default:'right'}), value:'right' }
                    ]
                }
            }
        };
    }

    driveTo(args) {
        const Kp = 0.5;
        const goalX = args.X * 1.0 + this.mbot_odom.data.x;
        const goalY = args.Y * 1.0 + this.mbot_odom.data.y;
        let distance_prev = 0;

        const interval = setInterval(() => {
            this.loopRunning = true;
            if (this.stopLoop) {
                this.loopRunning = false;
                this.stopLoop = false;
                clearInterval(interval);
                return;
            }
            if (!this.mbot_odom?.data) return;
            const dx = goalX - this.mbot_odom.data.x;
            const dy = goalY - this.mbot_odom.data.y;
            const distance = Math.hypot(dx, dy);
            
            if (Math.abs(distance - distance_prev) < 0.001) {
                this.loopRunning = false;
                this.stopLoop = false;
                clearInterval(interval);
                return;
            }

            distance_prev = distance;
            const vx = Math.min(Kp * dx, 0.5);
            const vy = Math.min(Kp * dy, 0.5);
            this.mbot.drive(vx, vy, 0);
            
        }, 100);
    }

    driveDirection(args) {
        const speed = args.SPEED * 1.0;
        let vx = 0, vy = 0;
        switch (args.DIRECTION) {
            case 'front': vx = speed; break;
            case 'back':  vx = -speed; break;
            case 'left':  vy = speed; break;
            case 'right': vy = -speed; break;
        }
        this.mbot.drive(vx, vy, 0);
    }

    angleToNearestObstacle () {
        if (this.mbot_scan == null) {
            return 0;
        }

        var min_range = 1000
        var min_theta = 0
        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            var range = this.mbot_scan.data.ranges[i]
            var theta = this.mbot_scan.data.thetas[i]
            if (range < min_range && range > 0) {
                min_range = range
                min_theta = theta
            }
        }
        return min_theta * 180 / Math.PI
    }

    distanceToNearestObstacle () {
        if (this.mbot_scan == null) {
            return 0;
        }

        var min_range = 1000
        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            var range = this.mbot_scan.data.ranges[i]
            if (range < min_range && range > 0) {
                min_range = range
            }
        }
        return min_range
    }

    detectObstacle(args) {
        if (!this.mbot_scan.data) return false;
        const dir = args.ANGLE * DEG_TO_RAD;
        const dist = args.DIST * 1.0;
        const sliceSize = 30 * DEG_TO_RAD;
        for (let i = 0; i < this.mbot_scan.data.ranges.length; i++) {
            const range = this.mbot_scan.data.ranges[i];
            const theta = this.mbot_scan.data.thetas[i];
            if (range > 0 && range < dist && Math.abs(theta - dir) < sliceSize) return true;
        }
        return false;
    }

    detectObstacleInDirection(args){
        let angleDeg;
        switch (args.DIRECTION){
            case 'front': angleDeg = 0; break;
            case 'left': angleDeg = 90; break;
            case 'back': angleDeg = 180; break;
            case 'right': angleDeg = 270; break;
            default: return false;
        }
        return this.detectObstacle({
            ANGLE: angleDeg,
            DIST: args.DIST * 1.0
        });
    }

    driveVel(args) {
        const vx = args.VX * 1.0;
        const vy = args.VY * 1.0 ;
        const wz = (args.WZ) * 1.0 * Math.PI / 180;

        this.mbot.drive(vx,vy,wz);
    }

    driveArc(args) {
        const vx = args.VX * 1.0;
        let radius = args.RADIUS * 1.0;
        if (args.ARCDIRECTION === 'right') radius = -radius;
        const omega = vx / radius;
        this.mbot.drive(vx, 0, omega);
    }

    driveTheta(args) {
        const thetaRad = (args.THETA) * 1.0 * Math.PI / 180;
        const speed   = args.SPEED * 1.0;
        const vx = speed * Math.cos(thetaRad);
        const vy = speed * Math.sin(thetaRad);

        this.mbot.drive(vx, vy, 0);
    }

    driveDirectionForDist(args) {
        const distance = args.DIST * 1.0;
        switch (args.DIRECTION) {
            case "front":
                this.driveTo({"X": distance, "Y": 0});
                break;
            case "left":
                this.driveTo({"X": 0, "Y": distance});
                break;
            case "right":
                this.driveTo({"X": 0, "Y": -distance});
                break;
            case "back":
                this.driveTo({"X": -distance, "Y": 0});
                break;
            default:
                return;
        }
    }
        
    stop() {
        if (this.loopRunning) {
            this.stopLoop = true;
        }
        this.mbot.drive(0, 0, 0);
    }

    getYPosition() {
        return this.mbot_odom.data.y;
    }

    getHeading() {
        return this.mbot_odom.data.theta * 180 / Math.PI;
    }
}
    

module.exports = Scratch3MBot;