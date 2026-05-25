const formatMessage = require('format-message');
const nets = require('nets');
const languageNames = require('scratch-translate-extension-languages');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Clone = require('../../util/clone');
const log = require('../../util/log');


const editorExtensionId = 'bfjihladgnccpchokgeeicpjcakdmkbe';


/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iODkuMDE5MTU3bW0iCiAgIGhlaWdodD0iODkuMDE5MTU3bW0iCiAgIHZpZXdCb3g9IjAgMCA4OS4wMTkxNiA4OS4wMTkxNTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzMzIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJkcmF3aW5nMS5zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyNyIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4zNSIKICAgICBpbmtzY2FwZTpjeD0iNzc2LjAyNTA2IgogICAgIGlua3NjYXBlOmN5PSIxODMuMzY4MDciCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6c25hcC1nbG9iYWw9ImZhbHNlIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTEwMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI4MTAiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjMxNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMzkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iZmFsc2UiCiAgICAgc2hvd2JvcmRlcj0idHJ1ZSIKICAgICBib3JkZXJsYXllcj0iZmFsc2UiCiAgICAgdW5pdHM9Im1tIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMuMzUyMjk4LC03OC4wOTIxOTkpIj4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eTowO3N0cm9rZS13aWR0aDowLjI2NDU4MzMyIgogICAgICAgaWQ9InBhdGg0NjAzIgogICAgICAgc29kaXBvZGk6dHlwZT0iYXJjIgogICAgICAgc29kaXBvZGk6Y3g9IjM0LjM5NTgzMiIKICAgICAgIHNvZGlwb2RpOmN5PSI5MS43NTg5MTkiCiAgICAgICBzb2RpcG9kaTpyeD0iNDUuNzM1MTE5IgogICAgICAgc29kaXBvZGk6cnk9IjEzLjk4NTExOSIKICAgICAgIHNvZGlwb2RpOnN0YXJ0PSIwIgogICAgICAgc29kaXBvZGk6ZW5kPSIxLjgxNDY3MzkiCiAgICAgICBkPSJNIDgwLjEzMDk1MSw5MS43NTg5MTkgQSA0NS43MzUxMTksMTMuOTg1MTE5IDAgMCAxIDYyLjU2MTYyNSwxMDIuNzc3MzMgNDUuNzM1MTE5LDEzLjk4NTExOSAwIDAgMSAyMy4zNTIyOTgsMTA1LjMzMDIgTCAzNC4zOTU4MzIsOTEuNzU4OTE5IFoiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMzUyNzc3OCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBkPSJtIDY0LjU4Mjk0Nyw3OC41OTk0MTUgYyAtMi43ODY5NDQsMC43NDA4MzQgLTUuODU2MTExLDIuMjU3Nzc4IC04LjM2MDgzMyw0LjE2Mjc3OSAtMTEuMzk0NzIzLDguNjA3Nzc4IC0yMS41MTk0NDYsMzAuMzM4ODg2IC0yMi4yMjUwMDIsNDcuNjYwMjc2IC0wLjIxMTY2Nyw1LjYwOTE3IDAuMTQxMTExLDcuNzI1ODQgMi4xODcyMjIsMTMuMDUyNzggMy41OTgzMzQsOS4zNDg2MSAxMS4yODg4OSwxOC43Njc3OCAxOC4wOTc1MDIsMjIuMTU0NDUgMi45OTg2MTEsMS40ODE2NyAzLjA2OTE2NiwxLjQ4MTY3IDYuNzM4MDU2LDEuNDgxNjcgMi44OTI3NzgsLTAuMDM1MyA0LjU1MDgzMywtMC4yNDY5NSA3LjMwMjUsLTAuOTg3NzggMTAuNjg5MTY3LC0yLjgyMjIyIDIwLjAwMjUwMSwtNy41MTQxNyAyNS4yNTg4OTEsLTEyLjYyOTQ1IDMuMTA0NDQ0LC0zLjA2OTE2IDMuNjMzNjExLC00LjQ4MDI4IDQuNjU2NjY3LC0xMy4wMTc1IDIuMzk4ODksLTE5LjcyMDI4IDIuOTI4MDYsLTMwLjc5NzUgMS44MzQ0NCwtMzcuNTAwMjggLTEuMTI4ODg1LC02LjgwODYxIC0zLjU2MzA1MiwtMTQuNzEwODMzIC01LjMyNjk0MSwtMTcuMzkxOTQ0IC0xLjc5OTE2NiwtMi43ODY5NDUgLTkuNzcxOTQ1LC01LjQ2ODA1NiAtMjAuNjM3NTAxLC03LjAyMDI3OCAtNC41ODYxMTEsLTAuNjM1IC03LjAyMDI3OCwtMC42MzUgLTkuNTI1MDAxLDAuMDM1MjggeiBtIDkuMTAxNjY4LDEyLjE3MDgzNSBjIDUuOTI2NjY3LDEuMjcgMTAuNDA2OTQ1LDYuMjQ0MTY3IDEyLjQ4ODMzNCwxMy44OTk0NCAwLjcwNTU1NSwyLjU3NTI4IDAuNzc2MTExLDMuNjY4ODkgMC43NzYxMTEsMTIuNTIzNjIgMCw3LjU4NDcyIC0wLjEwNTgzMywxMC41NDgwNSAtMC41OTk3MjIsMTMuNTgxOTQgLTEuMDkzNjEyLDYuOTE0NDUgLTIuMzYzNjEyLDEwLjYxODYxIC01LjA4MDAwMSwxNC43MTA4NCAtMy40NTcyMjIsNS4yNTYzOSAtOC43MTM2MTEsNy44MzE2NiAtMTYuODk4MDU2LDguMjkwMjcgLTMuNzA0MTY3LDAuMjExNjcgLTQuMDIxNjY3LDAuMTQxMTIgLTUuOTI2NjY3LC0wLjcwNTU1IC02LjgwODYxMiwtMy4xMzk3MiAtMTEuNDY1Mjc5LC0xMy45NyAtMTEuNTAwNTU3LC0yNi43NDA1NiAtMC4wMzUyOCwtOS44MDcyMiA2LjE3MzYxMiwtMjMuODQ3NzggMTMuODk5NDQ2LC0zMS41NzM2MTEgNC42NTY2NjcsLTQuNjU2NjY3IDYuNzAyNzc4LC01LjI5MTY2NyAxMi44NDExMTIsLTMuOTg2Mzg5IHoiCiAgICAgICBpZD0icGF0aDM1IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmOTVmMDI7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDM1Mjc3NzgiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgZD0ibSA2Mi43NDg1MDMsMTA2LjA4MDgxIGMgLTYuOTQ5NzIzLDEuNzYzODkgLTEyLjAyOTcyMyw3LjEyNjExIC0xMy41NDY2NjgsMTQuMjg3NSAtMS41ODc1LDcuNjIgMi40MzQxNjcsMTUuODc1IDkuNDU0NDQ1LDE5LjQzODA1IDcuMzAyNTAxLDMuNzA0MTcgMTUuODA0NDQ2LDIuMjIyNSAyMS4zNDMwNTcsLTMuNjY4ODkgMy4xNzUsLTMuMzg2NjYgNC41ODYxMTIsLTYuNjY3NSA0LjkzODg4OSwtMTEuMzU5NDQgMC41NjQ0NDUsLTguMTEzODkgLTQuMzM5MTY2LC0xNS40NTE2NyAtMTIuMDY1LC0xOC4yMDMzMyAtMi43MTYzODksLTAuOTUyNTEgLTcuMzczMDU2LC0xLjE5OTQ1IC0xMC4xMjQ3MjMsLTAuNDkzODkgeiIKICAgICAgIGlkPSJwYXRoMzciIC8+CiAgICA8cGF0aAogICAgICAgaWQ9InBhdGgzNy02IgogICAgICAgZD0ibSA2NC43MjAxOTYsMTE0Ljg1NzYyIGMgLTMuNzUwMjksMC45NTI0MyAtNi40OTE2MSwzLjg0Nzg0IC03LjMxMDE5Nyw3LjcxNDc1IC0wLjg1NjY1Niw0LjExNDU1IDEuMzEzNTQ3LDguNTcxOTYgNS4xMDE5MDcsMTAuNDk1ODggMy45NDA2NiwyLjAwMDEzIDguNTI4NTUsMS4yMDAwNyAxMS41MTczNSwtMS45ODEwNiAxLjcxMzMzLC0xLjgyODcgMi40NzQ4MSwtMy42MDAyNCAyLjY2NTE3LC02LjEzMzcyIDAuMzA0NTksLTQuMzgxMjMgLTIuMzQxNTQsLTguMzQzMzcgLTYuNTEwNjQsLTkuODI5MTcgLTEuNDY1ODMsLTAuNTE0MzIgLTMuOTc4NzIsLTAuNjQ3NjcgLTUuNDYzNTksLTAuMjY2NjggeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjAxOTA0Mjg3IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwMDgwMDA7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuODU3MTQyOTMiCiAgICAgICBkPSIiCiAgICAgICBpZD0icGF0aDQ3MTMiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywyMy4zNTIyOTgsNzguMDkyMTk5KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyLjg1NzE0MjkzIgogICAgICAgZD0iTSAxMjkuNjQxNzIsMjc5LjgwNDg0IEMgMTA3LjA3MDQsMjY1LjUyNjY1IDk0LjIyOTM4MywyMzUuNTAwNDggOTIuMTM5NzA3LDE5Mi4xMTM4MSA5MC44Njc1OTMsMTY1LjcwMTY5IDkxLjQzODIzMywxNjEuNDU4MjIgOTkuMzQ4MDMxLDEzOC41MTAzNCAxMTIuNjUxMTUsOTkuOTE1MzYzIDEzOC4wMjk1NCw2Mi4xMjE5ODEgMTU3LjM1MzE4LDUyLjEyOTMzOSBjIDI2LjA4NTQ5LC0xMy40ODkzMyA1OS4yOTc0LDMuMDM5MjU1IDc0LjI4NDU4LDM2Ljk2OTIzNSA3Ljg4NzU0LDE3Ljg1Njg3NiAxMC40NDI1NSw2MS4wNzg2NzYgNS44OTE2Niw5OS42NjYzMjYgLTcuNDk3OTcsNjMuNTc2MzQgLTMwLjkzNDQxLDkxLjU3Mzg4IC03OS43Mzc5Nyw5NS4yNTYyNSAtMTUuODY5OCwxLjE5NzQyIC0yMC43NDYyLDAuNDY3MDIgLTI4LjE0OTczLC00LjIxNjMxIHogbSA2Ni4zMDQ0NiwtNDUuNTcyNTEgYyAyNC41NjQ2MiwtMTIuNjI5NzEgMzYuNzg1MjMsLTMzLjIyOTQ0IDM2Ljc4NTIzLC02Mi4wMDcxOSAwLC0zNy41NDcyOCAtMjMuMTM5NTEsLTYzLjkzNjg1IC02MC4xNDksLTY4LjU5NzIzIC00MC4yNDIwNiwtNS4wNjc0MzMgLTc2LjE3MDM2MywyNy4wNDYyMiAtNzYuNjM2ODg3LDY4LjUwMDA0IC0wLjU3ODQ1LDUxLjM5OTIzIDU0LjQwNTc5Nyw4NS41NDY2MyAxMDAuMDAwNjU3LDYyLjEwNDM4IHoiCiAgICAgICBpZD0icGF0aDQ3MTUiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywyMy4zNTIyOTgsNzguMDkyMTk5KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyLjg1NzE0MjkzIgogICAgICAgZD0iTSAxMjkuNjQxNzIsMjc5LjgwNDg0IEMgMTA3LjA3MDQsMjY1LjUyNjY1IDk0LjIyOTM4MywyMzUuNTAwNDggOTIuMTM5NzA3LDE5Mi4xMTM4MSA5MC44Njc1OTMsMTY1LjcwMTY5IDkxLjQzODIzMywxNjEuNDU4MjIgOTkuMzQ4MDMxLDEzOC41MTAzNCAxMTIuNjUxMTUsOTkuOTE1MzYzIDEzOC4wMjk1NCw2Mi4xMjE5ODEgMTU3LjM1MzE4LDUyLjEyOTMzOSBjIDI2LjE0MzA4LC0xMy41MTkxMTIgNTkuMjk2ODgsMy4wMzg0MTYgNzQuMzU4MTksMzcuMTM1NjQ0IDcuOTAxNywxNy44ODg2MjcgMTAuNTU5MjIsNjUuODY2Mjk3IDUuNjc4NzIsMTAyLjUyMDkyNyAtOC4xNzc0Miw2MS40MTU3OCAtMzEuNjUyNDQsODguNjE3NTYgLTc5LjU5ODY0LDkyLjIzNTI0IC0xNS44Njk4LDEuMTk3NDIgLTIwLjc0NjIsMC40NjcwMiAtMjguMTQ5NzMsLTQuMjE2MzEgeiBtIDY5LjIwOTk3LC00Ny41NzgyIGMgNjAuNTMyODgsLTM1LjQ3NDYzIDM1LjgwNTQ3LC0xMjguMzY1MTIgLTM0LjExNzY1LC0xMjguMTY1NjggLTUxLjgxMDg4LDAuMTQ3NzcgLTg0LjkxMjcyNyw1NS41MTk0NSAtNjAuMjYzOSwxMDAuODA3NDcgMTguODE3NCwzNC41NzM3NiA2MS4xMzY5Myw0Ni44NDA4NSA5NC4zODE1NSwyNy4zNTgyMSB6IgogICAgICAgaWQ9InBhdGg0NzE3IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsMjMuMzUyMjk4LDc4LjA5MjE5OSkiIC8+CiAgPC9nPgo8L3N2Zz4K';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iODkuMDE5MTU3bW0iCiAgIGhlaWdodD0iODkuMDE5MTU3bW0iCiAgIHZpZXdCb3g9IjAgMCA4OS4wMTkxNiA4OS4wMTkxNTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzMzIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJkcmF3aW5nMS5zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyNyIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4zNSIKICAgICBpbmtzY2FwZTpjeD0iNzc2LjAyNTA2IgogICAgIGlua3NjYXBlOmN5PSIxODMuMzY4MDciCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6c25hcC1nbG9iYWw9ImZhbHNlIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTEwMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI4MTAiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjMxNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMzkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iZmFsc2UiCiAgICAgc2hvd2JvcmRlcj0idHJ1ZSIKICAgICBib3JkZXJsYXllcj0iZmFsc2UiCiAgICAgdW5pdHM9Im1tIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMuMzUyMjk4LC03OC4wOTIxOTkpIj4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eTowO3N0cm9rZS13aWR0aDowLjI2NDU4MzMyIgogICAgICAgaWQ9InBhdGg0NjAzIgogICAgICAgc29kaXBvZGk6dHlwZT0iYXJjIgogICAgICAgc29kaXBvZGk6Y3g9IjM0LjM5NTgzMiIKICAgICAgIHNvZGlwb2RpOmN5PSI5MS43NTg5MTkiCiAgICAgICBzb2RpcG9kaTpyeD0iNDUuNzM1MTE5IgogICAgICAgc29kaXBvZGk6cnk9IjEzLjk4NTExOSIKICAgICAgIHNvZGlwb2RpOnN0YXJ0PSIwIgogICAgICAgc29kaXBvZGk6ZW5kPSIxLjgxNDY3MzkiCiAgICAgICBkPSJNIDgwLjEzMDk1MSw5MS43NTg5MTkgQSA0NS43MzUxMTksMTMuOTg1MTE5IDAgMCAxIDYyLjU2MTYyNSwxMDIuNzc3MzMgNDUuNzM1MTE5LDEzLjk4NTExOSAwIDAgMSAyMy4zNTIyOTgsMTA1LjMzMDIgTCAzNC4zOTU4MzIsOTEuNzU4OTE5IFoiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMzUyNzc3OCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBkPSJtIDY0LjU4Mjk0Nyw3OC41OTk0MTUgYyAtMi43ODY5NDQsMC43NDA4MzQgLTUuODU2MTExLDIuMjU3Nzc4IC04LjM2MDgzMyw0LjE2Mjc3OSAtMTEuMzk0NzIzLDguNjA3Nzc4IC0yMS41MTk0NDYsMzAuMzM4ODg2IC0yMi4yMjUwMDIsNDcuNjYwMjc2IC0wLjIxMTY2Nyw1LjYwOTE3IDAuMTQxMTExLDcuNzI1ODQgMi4xODcyMjIsMTMuMDUyNzggMy41OTgzMzQsOS4zNDg2MSAxMS4yODg4OSwxOC43Njc3OCAxOC4wOTc1MDIsMjIuMTU0NDUgMi45OTg2MTEsMS40ODE2NyAzLjA2OTE2NiwxLjQ4MTY3IDYuNzM4MDU2LDEuNDgxNjcgMi44OTI3NzgsLTAuMDM1MyA0LjU1MDgzMywtMC4yNDY5NSA3LjMwMjUsLTAuOTg3NzggMTAuNjg5MTY3LC0yLjgyMjIyIDIwLjAwMjUwMSwtNy41MTQxNyAyNS4yNTg4OTEsLTEyLjYyOTQ1IDMuMTA0NDQ0LC0zLjA2OTE2IDMuNjMzNjExLC00LjQ4MDI4IDQuNjU2NjY3LC0xMy4wMTc1IDIuMzk4ODksLTE5LjcyMDI4IDIuOTI4MDYsLTMwLjc5NzUgMS44MzQ0NCwtMzcuNTAwMjggLTEuMTI4ODg1LC02LjgwODYxIC0zLjU2MzA1MiwtMTQuNzEwODMzIC01LjMyNjk0MSwtMTcuMzkxOTQ0IC0xLjc5OTE2NiwtMi43ODY5NDUgLTkuNzcxOTQ1LC01LjQ2ODA1NiAtMjAuNjM3NTAxLC03LjAyMDI3OCAtNC41ODYxMTEsLTAuNjM1IC03LjAyMDI3OCwtMC42MzUgLTkuNTI1MDAxLDAuMDM1MjggeiBtIDkuMTAxNjY4LDEyLjE3MDgzNSBjIDUuOTI2NjY3LDEuMjcgMTAuNDA2OTQ1LDYuMjQ0MTY3IDEyLjQ4ODMzNCwxMy44OTk0NCAwLjcwNTU1NSwyLjU3NTI4IDAuNzc2MTExLDMuNjY4ODkgMC43NzYxMTEsMTIuNTIzNjIgMCw3LjU4NDcyIC0wLjEwNTgzMywxMC41NDgwNSAtMC41OTk3MjIsMTMuNTgxOTQgLTEuMDkzNjEyLDYuOTE0NDUgLTIuMzYzNjEyLDEwLjYxODYxIC01LjA4MDAwMSwxNC43MTA4NCAtMy40NTcyMjIsNS4yNTYzOSAtOC43MTM2MTEsNy44MzE2NiAtMTYuODk4MDU2LDguMjkwMjcgLTMuNzA0MTY3LDAuMjExNjcgLTQuMDIxNjY3LDAuMTQxMTIgLTUuOTI2NjY3LC0wLjcwNTU1IC02LjgwODYxMiwtMy4xMzk3MiAtMTEuNDY1Mjc5LC0xMy45NyAtMTEuNTAwNTU3LC0yNi43NDA1NiAtMC4wMzUyOCwtOS44MDcyMiA2LjE3MzYxMiwtMjMuODQ3NzggMTMuODk5NDQ2LC0zMS41NzM2MTEgNC42NTY2NjcsLTQuNjU2NjY3IDYuNzAyNzc4LC01LjI5MTY2NyAxMi44NDExMTIsLTMuOTg2Mzg5IHoiCiAgICAgICBpZD0icGF0aDM1IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmOTVmMDI7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDM1Mjc3NzgiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgZD0ibSA2Mi43NDg1MDMsMTA2LjA4MDgxIGMgLTYuOTQ5NzIzLDEuNzYzODkgLTEyLjAyOTcyMyw3LjEyNjExIC0xMy41NDY2NjgsMTQuMjg3NSAtMS41ODc1LDcuNjIgMi40MzQxNjcsMTUuODc1IDkuNDU0NDQ1LDE5LjQzODA1IDcuMzAyNTAxLDMuNzA0MTcgMTUuODA0NDQ2LDIuMjIyNSAyMS4zNDMwNTcsLTMuNjY4ODkgMy4xNzUsLTMuMzg2NjYgNC41ODYxMTIsLTYuNjY3NSA0LjkzODg4OSwtMTEuMzU5NDQgMC41NjQ0NDUsLTguMTEzODkgLTQuMzM5MTY2LC0xNS40NTE2NyAtMTIuMDY1LC0xOC4yMDMzMyAtMi43MTYzODksLTAuOTUyNTEgLTcuMzczMDU2LC0xLjE5OTQ1IC0xMC4xMjQ3MjMsLTAuNDkzODkgeiIKICAgICAgIGlkPSJwYXRoMzciIC8+CiAgICA8cGF0aAogICAgICAgaWQ9InBhdGgzNy02IgogICAgICAgZD0ibSA2NC43MjAxOTYsMTE0Ljg1NzYyIGMgLTMuNzUwMjksMC45NTI0MyAtNi40OTE2MSwzLjg0Nzg0IC03LjMxMDE5Nyw3LjcxNDc1IC0wLjg1NjY1Niw0LjExNDU1IDEuMzEzNTQ3LDguNTcxOTYgNS4xMDE5MDcsMTAuNDk1ODggMy45NDA2NiwyLjAwMDEzIDguNTI4NTUsMS4yMDAwNyAxMS41MTczNSwtMS45ODEwNiAxLjcxMzMzLC0xLjgyODcgMi40NzQ4MSwtMy42MDAyNCAyLjY2NTE3LC02LjEzMzcyIDAuMzA0NTksLTQuMzgxMjMgLTIuMzQxNTQsLTguMzQzMzcgLTYuNTEwNjQsLTkuODI5MTcgLTEuNDY1ODMsLTAuNTE0MzIgLTMuOTc4NzIsLTAuNjQ3NjcgLTUuNDYzNTksLTAuMjY2NjggeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjAxOTA0Mjg3IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwMDgwMDA7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuODU3MTQyOTMiCiAgICAgICBkPSIiCiAgICAgICBpZD0icGF0aDQ3MTMiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywyMy4zNTIyOTgsNzguMDkyMTk5KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyLjg1NzE0MjkzIgogICAgICAgZD0iTSAxMjkuNjQxNzIsMjc5LjgwNDg0IEMgMTA3LjA3MDQsMjY1LjUyNjY1IDk0LjIyOTM4MywyMzUuNTAwNDggOTIuMTM5NzA3LDE5Mi4xMTM4MSA5MC44Njc1OTMsMTY1LjcwMTY5IDkxLjQzODIzMywxNjEuNDU4MjIgOTkuMzQ4MDMxLDEzOC41MTAzNCAxMTIuNjUxMTUsOTkuOTE1MzYzIDEzOC4wMjk1NCw2Mi4xMjE5ODEgMTU3LjM1MzE4LDUyLjEyOTMzOSBjIDI2LjA4NTQ5LC0xMy40ODkzMyA1OS4yOTc0LDMuMDM5MjU1IDc0LjI4NDU4LDM2Ljk2OTIzNSA3Ljg4NzU0LDE3Ljg1Njg3NiAxMC40NDI1NSw2MS4wNzg2NzYgNS44OTE2Niw5OS42NjYzMjYgLTcuNDk3OTcsNjMuNTc2MzQgLTMwLjkzNDQxLDkxLjU3Mzg4IC03OS43Mzc5Nyw5NS4yNTYyNSAtMTUuODY5OCwxLjE5NzQyIC0yMC43NDYyLDAuNDY3MDIgLTI4LjE0OTczLC00LjIxNjMxIHogbSA2Ni4zMDQ0NiwtNDUuNTcyNTEgYyAyNC41NjQ2MiwtMTIuNjI5NzEgMzYuNzg1MjMsLTMzLjIyOTQ0IDM2Ljc4NTIzLC02Mi4wMDcxOSAwLC0zNy41NDcyOCAtMjMuMTM5NTEsLTYzLjkzNjg1IC02MC4xNDksLTY4LjU5NzIzIC00MC4yNDIwNiwtNS4wNjc0MzMgLTc2LjE3MDM2MywyNy4wNDYyMiAtNzYuNjM2ODg3LDY4LjUwMDA0IC0wLjU3ODQ1LDUxLjM5OTIzIDU0LjQwNTc5Nyw4NS41NDY2MyAxMDAuMDAwNjU3LDYyLjEwNDM4IHoiCiAgICAgICBpZD0icGF0aDQ3MTUiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4yNjQ1ODMzMywwLDAsMC4yNjQ1ODMzMywyMy4zNTIyOTgsNzguMDkyMTk5KSIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyLjg1NzE0MjkzIgogICAgICAgZD0iTSAxMjkuNjQxNzIsMjc5LjgwNDg0IEMgMTA3LjA3MDQsMjY1LjUyNjY1IDk0LjIyOTM4MywyMzUuNTAwNDggOTIuMTM5NzA3LDE5Mi4xMTM4MSA5MC44Njc1OTMsMTY1LjcwMTY5IDkxLjQzODIzMywxNjEuNDU4MjIgOTkuMzQ4MDMxLDEzOC41MTAzNCAxMTIuNjUxMTUsOTkuOTE1MzYzIDEzOC4wMjk1NCw2Mi4xMjE5ODEgMTU3LjM1MzE4LDUyLjEyOTMzOSBjIDI2LjE0MzA4LC0xMy41MTkxMTIgNTkuMjk2ODgsMy4wMzg0MTYgNzQuMzU4MTksMzcuMTM1NjQ0IDcuOTAxNywxNy44ODg2MjcgMTAuNTU5MjIsNjUuODY2Mjk3IDUuNjc4NzIsMTAyLjUyMDkyNyAtOC4xNzc0Miw2MS40MTU3OCAtMzEuNjUyNDQsODguNjE3NTYgLTc5LjU5ODY0LDkyLjIzNTI0IC0xNS44Njk4LDEuMTk3NDIgLTIwLjc0NjIsMC40NjcwMiAtMjguMTQ5NzMsLTQuMjE2MzEgeiBtIDY5LjIwOTk3LC00Ny41NzgyIGMgNjAuNTMyODgsLTM1LjQ3NDYzIDM1LjgwNTQ3LC0xMjguMzY1MTIgLTM0LjExNzY1LC0xMjguMTY1NjggLTUxLjgxMDg4LDAuMTQ3NzcgLTg0LjkxMjcyNyw1NS41MTk0NSAtNjAuMjYzOSwxMDAuODA3NDcgMTguODE3NCwzNC41NzM3NiA2MS4xMzY5Myw0Ni44NDA4NSA5NC4zODE1NSwyNy4zNTgyMSB6IgogICAgICAgaWQ9InBhdGg0NzE3IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsMjMuMzUyMjk4LDc4LjA5MjE5OSkiIC8+CiAgPC9nPgo8L3N2Zz4K';

/**
 * The url of the synthesis server.
 * @type {string}
 */
const SERVER_HOST = 'https://synthesis-service.scratch.mit.edu';

/**
 * How long to wait in ms before timing out requests to synthesis server.
 * @type {int}
 */
const SERVER_TIMEOUT = 10000; // 10 seconds

/**
 * Volume for playback of speech sounds, as a percentage.
 * @type {number}
 */
const SPEECH_VOLUME = 250;

/**
 * An id for one of the voices.
 */
const ALTO_ID = 'ALTO';

/**
 * An id for one of the voices.
 */
const TENOR_ID = 'TENOR';

/**
 * An id for one of the voices.
 */
const SQUEAK_ID = 'SQUEAK';

/**
 * An id for one of the voices.
 */
const GIANT_ID = 'GIANT';

/**
 * Playback rate for the tenor voice, for cases where we have only a female gender voice.
 */
const FEMALE_TENOR_RATE = 0.89; // -2 semitones

/**
 * Playback rate for the giant voice, for cases where we have only a female gender voice.
 */
const FEMALE_GIANT_RATE = 0.79; // -4 semitones

/**
 * Language ids. The value for each language id is a valid Scratch locale.
 */
const ARABIC_ID = 'ar';
const CHINESE_ID = 'zh-cn';
const DANISH_ID = 'da';
const DUTCH_ID = 'nl';
const ENGLISH_ID = 'en';
const ENGLISH_US_ID = 'en-us';
const FRENCH_ID = 'fr';
const GERMAN_ID = 'de';
const HINDI_ID = 'hi';
const ICELANDIC_ID = 'is';
const ITALIAN_ID = 'it';
const JAPANESE_ID = 'ja';
const KOREAN_ID = 'ko';
const NORWEGIAN_ID = 'nb';
const POLISH_ID = 'pl';
const PORTUGUESE_BR_ID = 'pt-br';
const PORTUGUESE_ID = 'pt';
const ROMANIAN_ID = 'ro';
const RUSSIAN_ID = 'ru';
const SPANISH_ID = 'es';
const SPANISH_419_ID = 'es-419';
const SWEDISH_ID = 'sv';
const TURKISH_ID = 'tr';
const WELSH_ID = 'cy';

/**
 * Min and max values for lip variable.
 */
const LIP_MIN = 5.0;
const LIP_MAX = 8.0;

/**
 * Class for the Ohbot blocks.
 * @constructor
 */
class Scratch3OhbotBlocks {
	constructor(runtime) {
		/**
		 * The runtime instantiating this block package.
		 * @type {Runtime}
		 */
		this.runtime = runtime;

		/**
		 * Map of soundPlayers by sound id.
		 * @type {Map<string, SoundPlayer>}
		 */
		this._soundPlayers = new Map();

		this._stopAll = this._stopAll.bind(this);
		if (this.runtime) {
			this.runtime.on('PROJECT_STOP_ALL', this._stopAll);
		}

		this._onTargetCreated = this._onTargetCreated.bind(this);
		if (this.runtime) {
			runtime.on('targetWasCreated', this._onTargetCreated);
		}

		/**
		 * A list of all Scratch locales that are supported by the extension.
		 * @type {Array}
		 */
		this._supportedLocales = this._getSupportedLocales();

		/**
		 * Float for lip variable. Limits: 5.00 -> 8.00
		 */
		this._lip = LIP_MIN;
    
	}

	/**
	 * An object with info for each voice.
	 */
	get VOICE_INFO() {
		return {
			[ALTO_ID]: {
				name: formatMessage({
					id: 'ohbot.alto',
					default: 'alto',
					description: 'Name for a voice with ambiguous gender'
				}),
				gender: 'female',
				playbackRate: 1
			},
			[TENOR_ID]: {
				name: formatMessage({
					id: 'ohbot.tenor',
					default: 'tenor',
					description: 'Name for a voice with ambiguous gender'
				}),
				gender: 'male',
				playbackRate: 1
			},
			[SQUEAK_ID]: {
				name: formatMessage({
					id: 'ohbot.squeak',
					default: 'squeak',
					description: 'Name for a funny voice with a high pitch'
				}),
				gender: 'female',
				playbackRate: 1.19 // +3 semitones
			},
			[GIANT_ID]: {
				name: formatMessage({
					id: 'ohbot.giant',
					default: 'giant',
					description: 'Name for a funny voice with a low pitch'
				}),
				gender: 'male',
				playbackRate: 0.84 // -3 semitones
			}
		};
	}

	/**
	 * An object with information for each language.
	 *
	 * A note on the different sets of locales referred to in this extension:
	 *
	 * SCRATCH LOCALE
	 *		Set by the editor, and used to store the language state in the project.
	 *		Listed in l10n: https://github.com/LLK/scratch-l10n/blob/master/src/supported-locales.js
	 * SUPPORTED LOCALE
	 *		A Scratch locale that has a corresponding extension locale.
	 * EXTENSION LOCALE
	 *		A locale corresponding to one of the available spoken languages
	 *		in the extension. There can be multiple supported locales for a single
	 *		extension locale. For example, for both written versions of chinese,
	 *		zh-cn and zh-tw, we use a single spoken language (Mandarin). So there
	 *		are two supported locales, with a single extension locale.
	 * SPEECH SYNTH LOCALE
	 *		A different locale code system, used by our speech synthesis service.
	 *		Each extension locale has a speech synth locale.
	 */
	get LANGUAGE_INFO() {
		return {
			[ARABIC_ID]: {
				name: 'Arabic',
				locales: ['ar'],
				speechSynthLocale: 'arb',
				singleGender: true
			},
			[CHINESE_ID]: {
				name: 'Chinese (Mandarin)',
				locales: ['zh-cn', 'zh-tw'],
				speechSynthLocale: 'cmn-CN',
				singleGender: true
			},
			[DANISH_ID]: {
				name: 'Danish',
				locales: ['da'],
				speechSynthLocale: 'da-DK'
			},
			[DUTCH_ID]: {
				name: 'Dutch',
				locales: ['nl'],
				speechSynthLocale: 'nl-NL'
			},
			[ENGLISH_ID]: {
				name: 'English',
				locales: ['en', 'en-GB'],
				speechSynthLocale: 'en-GB'
			},
			[ENGLISH_US_ID]: {
				name: 'English (US)',
				locales: ['en-us'],
				speechSynthLocale: 'en-US'
			},
			[FRENCH_ID]: {
				name: 'French',
				locales: ['fr'],
				speechSynthLocale: 'fr-FR'
			},
			[GERMAN_ID]: {
				name: 'German',
				locales: ['de'],
				speechSynthLocale: 'de-DE'
			},
			[HINDI_ID]: {
				name: 'Hindi',
				locales: ['hi'],
				speechSynthLocale: 'hi-IN',
				singleGender: true
			},
			[ICELANDIC_ID]: {
				name: 'Icelandic',
				locales: ['is'],
				speechSynthLocale: 'is-IS'
			},
			[ITALIAN_ID]: {
				name: 'Italian',
				locales: ['it'],
				speechSynthLocale: 'it-IT'
			},
			[JAPANESE_ID]: {
				name: 'Japanese',
				locales: ['ja', 'ja-hira'],
				speechSynthLocale: 'ja-JP'
			},
			[KOREAN_ID]: {
				name: 'Korean',
				locales: ['ko'],
				speechSynthLocale: 'ko-KR',
				singleGender: true
			},
			[NORWEGIAN_ID]: {
				name: 'Norwegian',
				locales: ['nb', 'nn'],
				speechSynthLocale: 'nb-NO',
				singleGender: true
			},
			[POLISH_ID]: {
				name: 'Polish',
				locales: ['pl'],
				speechSynthLocale: 'pl-PL'
			},
			[PORTUGUESE_ID]: {
				name: 'Portuguese (European)',
				locales: ['pt'],
				speechSynthLocale: 'pt-PT'
			},
			[PORTUGUESE_BR_ID]: {
				name: 'Portuguese (Brazilian)',
				locales: ['pt-br'],
				speechSynthLocale: 'pt-BR'
			},
			[ROMANIAN_ID]: {
				name: 'Romanian',
				locales: ['ro'],
				speechSynthLocale: 'ro-RO',
				singleGender: true
			},
			[RUSSIAN_ID]: {
				name: 'Russian',
				locales: ['ru'],
				speechSynthLocale: 'ru-RU'
			},
			[SPANISH_ID]: {
				name: 'Spanish (European)',
				locales: ['es'],
				speechSynthLocale: 'es-ES'
			},
			[SPANISH_419_ID]: {
				name: 'Spanish (Latin American)',
				locales: ['es-419'],
				speechSynthLocale: 'es-US'
			},
			[SWEDISH_ID]: {
				name: 'Swedish',
				locales: ['sv'],
				speechSynthLocale: 'sv-SE',
				singleGender: true
			},
			[TURKISH_ID]: {
				name: 'Turkish',
				locales: ['tr'],
				speechSynthLocale: 'tr-TR',
				singleGender: true
			},
			[WELSH_ID]: {
				name: 'Welsh',
				locales: ['cy'],
				speechSynthLocale: 'cy-GB',
				singleGender: true
			}
		};
	}

	/**
	 * The key to load & store a target's ohbot state.
	 * @return {string} The key.
	 */
	static get STATE_KEY() {
		return 'Scratch.ohbot';
	}

	/**
	 * The default state, to be used when a target has no existing state.
	 * @type {OhbotState}
	 */
	static get DEFAULT_OHBOT_STATE() {
		return {
			voiceId: ALTO_ID
		};
	}

	/**
	 * A default language to use for speech synthesis.
	 * @type {string}
	 */
	get DEFAULT_LANGUAGE() {
		return ENGLISH_ID;
	}

	/**
	 * @param {Target} target - collect	state for this target.
	 * @returns {OhbotState} the mutable state associated with that target. This will be created if necessary.
	 * @private
	 */
	_getState(target) {
		let state = target.getCustomState(Scratch3OhbotBlocks.STATE_KEY);
		if (!state) {
			state = Clone.simple(Scratch3OhbotBlocks.DEFAULT_OHBOT_STATE);
			target.setCustomState(Scratch3OhbotBlocks.STATE_KEY, state);
		}
		return state;
	}

	/**
	 * When a Target is cloned, clone the state.
	 * @param {Target} newTarget - the newly created target.
	 * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
	 * @listens Runtime#event:targetWasCreated
	 * @private
	 */
	_onTargetCreated(newTarget, sourceTarget) {
		if (sourceTarget) {
			const state = sourceTarget.getCustomState(Scratch3OhbotBlocks.STATE_KEY);
			if (state) {
				newTarget.setCustomState(Scratch3OhbotBlocks.STATE_KEY, Clone.simple(state));
			}
		}
	}

	/**
	 * @returns {object} metadata for this extension and its blocks.
	 */
	getInfo() {
		// Only localize the default input to the "speak" block if we are in a
		// supported language.
		let defaultTextToSpeak = 'hello';
		if (this.isSupportedLanguage(this.getEditorLanguage())) {
			defaultTextToSpeak = formatMessage({
				id: 'ohbot.defaultTextToSpeak',
				default: 'hello',
				description: 'The default text to speak'
			});
		}

		const defaultAskQuestion = formatMessage({
			id: 'ohbot.defaultAskQuestion',
			default: 'what is your name?',
			description: 'The default question for speak and wait'
		});

		return {
			id: 'ohbot',
			name: formatMessage({
				id: 'ohbot.categoryName',
				default: 'Ohbot',
				description: 'Name of the Ohbot extension'
			}),
			blockIconURI: blockIconURI,
			menuIconURI: menuIconURI,
			blocks: [
				{
					opcode: 'setMotorPosition',
					text: formatMessage({
						id: 'ohbot.setMotorPosition',
						default: 'set [MOTOR] to [POSITION]',
						description: 'Set the position of an Ohbot motor'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						MOTOR: {
							type: ArgumentType.STRING,
							menu: 'motors',
							defaultValue: 'HeadTurn'
						},
						POSITION: {
							type: ArgumentType.STRING,
							defaultValue: '5'
						}
					}
				},
				{
					opcode: 'changeMotorPosition',
					text: formatMessage({
						id: 'ohbot.changeMotor',
						default: 'change [MOTOR] by [POSITION]',
						description: 'Move an Ohbot motor'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						MOTOR: {
							type: ArgumentType.STRING,
							menu: 'motors',
							defaultValue: 'HeadTurn'
						},
						POSITION: {
							type: ArgumentType.STRING,
							defaultValue: '1'
						}
					}
				},
				{
					opcode: 'setMotorSpeed',
					text: formatMessage({
						id: 'ohbot.moveMotor',
						default: 'set [MOTOR] speed to [SPEED]',
						description: 'Set the speed of an Ohbot motor'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						MOTOR: {
							type: ArgumentType.STRING,
							menu: 'motors',
							defaultValue: 'HeadTurn'
						},
						SPEED: {
							type: ArgumentType.STRING,
							defaultValue: '5'
						}
					}
				},
				{
					opcode: 'setEyeShape',
					text: formatMessage({
						id: 'ohbot.setEyeShape',
						default: 'set eyeshape to [EYESHAPE]',
						description: 'Set the Picohs eyeshape'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						EYESHAPE: {
							type: ArgumentType.STRING,
							menu: 'eyeshapes',
							defaultValue: 'Eyeball'
						}
					}
				}
                ,
                //{
                //    opcode: 'displaySymbol',
                //    text: formatMessage({
                //        id: 'ohbot.displaySymbol',
                //        default: 'display [MATRIX]',
                //        description: 'display a pattern on the micro:bit display'
                //    }),
                //    blockType: BlockType.COMMAND,
                //    arguments: {
                //        MATRIX: {
                //            type: ArgumentType.MATRIX,
                //            defaultValue: '01010101011000101010001000101010101100010101000100'
                //        }
                //    }
                //},
				{
					opcode: 'setNamedColour',
					text: formatMessage({
						id: 'ohbot.setNamedColour',
						default: 'set colour to [COLOURNAME]',
						description: 'Set named Ohbot eye colour or Picoh base colour'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						COLOURNAME: {
							type: ArgumentType.STRING,
							menu: 'namedColours',
							defaultValue: 'off'
						}
					}
				},
				{
					opcode: 'setRGBColour',
					text: formatMessage({
						id: 'ohbot.setRGBColour',
						default: 'set colour RGB [RGB] to [RGBCOLOUR]',
						description: 'Set RGB Ohbot eye colour or Picoh base colour'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						RGB: {
							type: ArgumentType.STRING,
							menu: 'rgbColours',
							defaultValue: 'red'
						},
						RGBCOLOUR: {
							type: ArgumentType.STRING,
							defaultValue: '5'
						}
					}
				},
				{
					opcode: 'reset',
					text: formatMessage({
						id: 'ohbot.reset',
						default: 'reset',
						description: 'Reset Ohbot or Picoh'
					}),
					blockType: BlockType.COMMAND
				},
				{
					opcode: 'speakNoWait',
					text: formatMessage({
						id: 'ohbot.speakNoWaitBlock',
						default: 'speak [WORDS]',
						description: 'Speak'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						WORDS: {
							type: ArgumentType.STRING,
							defaultValue: defaultTextToSpeak
						}
					}
				},
				{
					opcode: 'speakAndWait',
					text: formatMessage({
						id: 'ohbot.speakAndWaitBlock',
						default: 'speak [WORDS] until done',
						description: 'Speak and wait until done'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						WORDS: {
							type: ArgumentType.STRING,
							defaultValue: defaultTextToSpeak
						}
					}
				},
				{
					opcode: 'askAndWait',
					text: formatMessage({
						id: 'ohbot.askAndWaitBlock',
						default: 'speak [QUESTION] and wait',
						description: 'Speak a question and wait for an answer'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						QUESTION: {
							type: ArgumentType.STRING,
							defaultValue: defaultAskQuestion
						}
					}
				},
				{
					opcode: 'setVoice',
					text: formatMessage({
						id: 'ohbot.setVoiceBlock',
						default: 'set voice to [VOICE]',
						description: 'Set the voice for speech synthesis'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						VOICE: {
							type: ArgumentType.STRING,
							menu: 'voices',
							defaultValue: ALTO_ID
						}
					}
				},
				{
					opcode: 'setLanguage',
					text: formatMessage({
						id: 'ohbot.setLanguageBlock',
						default: 'set language to [LANGUAGE]',
						description: 'Set the language for speech synthesis'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						LANGUAGE: {
							type: ArgumentType.STRING,
							menu: 'languages',
							defaultValue: this.getCurrentLanguage()
						}
					}
				},
				{
					opcode: 'getLip',
					text: formatMessage({
						id: 'ohbot.getLip',
						default: 'lip',
						description: 'Get the lip variable'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'oh_mouseX',
					text: formatMessage({
						id: 'ohbot.mouseX',
						default: 'mouse x',
						description: 'Get the mouse x variable scaled 0-10'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'oh_mouseY',
					text: formatMessage({
						id: 'ohbot.mouseY',
						default: 'mouse y',
						description: 'Get the mouse y variable scaled 0-10'
					}),
					blockType: BlockType.REPORTER
				}
			],
			menus: {
				motors: {
					acceptReporters: true,
					items: 'HeadTurn HeadNod HeadRoll EyeTurn EyeTilt TopLip BottomLip LidBlink'
						.split(' ')
						.map(name => ({ text: name, value: name }))
				},
				namedColours: {
					acceptReporters: true,
					items: 'off red green blue yellow orange purple white'
						.split(' ')
						.map(name => ({ text: name, value: name }))
				},
				rgbColours: {
					acceptReporters: true,
					items: 'red green blue'
						.split(' ')
						.map(name => ({ text: name, value: name }))
				},
				voices: {
					acceptReporters: true,
					items: this.getVoiceMenu()
				},
				languages: {
					acceptReporters: true,
					items: this.getLanguageMenu()
				},
				eyeshapes: {
					acceptReporters: true,
					items: 'Angry BoxLeft BoxRight Crying Eyeball Glasses Heart Large Sad SmallBall Square SunGlasses VerySad Full'
						.split(' ')
						.map(name => ({ text: name, value: name }))
				}
			}
		};
	}

	setMotorPosition(args) {

        unityInstance.SendMessage(
            Robot,
            "JSONCommand",
            JSON.stringify({ type: "setMotor", motor: args.MOTOR, value: args.POSITION })
        );

		return this.runCommand(['MM', args.MOTOR, args.POSITION]);
	}
	changeMotorPosition(args) {
        unityInstance.SendMessage(
            Robot,
            "JSONCommand",
            JSON.stringify({ type: "changeMotor", motor: args.MOTOR, value: args.POSITION })
        );
		return this.runCommand(['MC', args.MOTOR, args.POSITION]);
	}
	setMotorSpeed(args) {
		return this.runCommand(['MS', args.MOTOR, args.SPEED]);
	}
	setNamedColour(args) {
        unityInstance.SendMessage(Robot, "SetColByName",args.COLOURNAME);
		return this.runCommand(['CC', args.COLOURNAME]);
	}

	setEyeShape(args) {
        if(Robot == 'Picoh')
            {
                unityInstance.SendMessage(Robot, "SetEyeShape",args.EYESHAPE);
            }
		return this.runCommand(['ES', args.EYESHAPE]);
	}

	setRGBColour(args) {
        if (args.RGB === 'red') {
            unityInstance.SendMessage(Robot, "SetR", parseFloat(args.RGBCOLOUR));
        } else if (args.RGB === 'green') {
            unityInstance.SendMessage(Robot, "SetG", parseFloat(args.RGBCOLOUR));
        } else if (args.RGB === 'blue') {
            unityInstance.SendMessage(Robot, "SetB", parseFloat(args.RGBCOLOUR));
        }
		return this.runCommand(['CE', args.RGB, args.RGBCOLOUR]);
	}
    
	reset() {
		this._stopAll();
		this.runCommand(['R', '', '']);
        unityInstance.SendMessage(Robot, "ResetController");

	}

	runCommand(cmd) {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(editorExtensionId, cmd);
			resolve();
		}).then(() => new Promise(resolve => setTimeout(resolve, 100)));
	}

	/**
	 * Get the language code currently set in the editor, or fall back to the
	 * browser locale.
	 * @return {string} a Scratch locale code.
	 */
	getEditorLanguage() {
		const locale = formatMessage.setup().locale ||
			navigator.language || navigator.userLanguage || this.DEFAULT_LANGUAGE;
		return locale.toLowerCase();
	}

	/**
	 * Get the language code currently set for the extension.
	 * @returns {string} a Scratch locale code.
	 */
	getCurrentLanguage() {
		const stage = this.runtime.getTargetForStage();
		if (!stage) return this.DEFAULT_LANGUAGE;
		// If no language has been set, set it to the editor locale (or default).
		if (!stage.textToSpeechLanguage) {
			this.setCurrentLanguage(this.getEditorLanguage());
		}
		return stage.textToSpeechLanguage;
	}

	/**
	 * Set the language code for the extension.
	 * It is stored in the stage so it can be saved and loaded with the project.
	 * @param {string} locale a locale code.
	 */
	setCurrentLanguage(locale) {
		const stage = this.runtime.getTargetForStage();
		if (!stage) return;

		if (this.isSupportedLanguage(locale)) {
			stage.textToSpeechLanguage = this._getExtensionLocaleForSupportedLocale(locale);
		}

		// Support language names dropped onto the menu via reporter block
		// such as a variable containing a language name (in any language),
		// or the translate extension's language reporter.
		const localeForDroppedName = languageNames.nameMap[locale.toLowerCase()];
		if (localeForDroppedName && this.isSupportedLanguage(localeForDroppedName)) {
			stage.textToSpeechLanguage =
				this._getExtensionLocaleForSupportedLocale(localeForDroppedName);
		}

		// If the language is null, set it to the default language.
		// This can occur e.g. if the extension was loaded with the editor
		// set to a language that is not in the list.
		if (!stage.textToSpeechLanguage) {
			stage.textToSpeechLanguage = this.DEFAULT_LANGUAGE;
		}
	}

	/**
	 * Get the extension locale for a supported locale, or null.
	 * @param {string} locale a locale code.
	 * @returns {?string} a locale supported by the extension.
	 */
	_getExtensionLocaleForSupportedLocale(locale) {
		for (const lang in this.LANGUAGE_INFO) {
			if (this.LANGUAGE_INFO[lang].locales.includes(locale)) {
				return lang;
			}
		}
		log.error(`cannot find extension locale for locale ${locale}`);
	}

	/**
	 * Get the locale code used by the speech synthesis server corresponding to
	 * the current language code set for the extension.
	 * @returns {string} a speech synthesis locale.
	 */
	_getSpeechSynthLocale() {
		let speechSynthLocale = this.LANGUAGE_INFO[this.DEFAULT_LANGUAGE].speechSynthLocale;
		if (this.LANGUAGE_INFO[this.getCurrentLanguage()]) {
			speechSynthLocale = this.LANGUAGE_INFO[this.getCurrentLanguage()].speechSynthLocale;
		}
		return speechSynthLocale;
	}

	/**
	 * Get an array of the locales supported by this extension.
	 * @returns {Array} An array of locale strings.
	 */
	_getSupportedLocales() {
		return Object.keys(this.LANGUAGE_INFO).reduce((acc, lang) =>
			acc.concat(this.LANGUAGE_INFO[lang].locales), []);
	}

	/**
	 * Check if a Scratch language code is in the list of supported languages for the
	 * speech synthesis service.
	 * @param {string} languageCode the language code to check.
	 * @returns {boolean} true if the language code is supported.
	 */
	isSupportedLanguage(languageCode) {
		return this._supportedLocales.includes(languageCode);
	}

	/**
	 * Get the menu of voices for the "set voice" block.
	 * @return {array} the text and value for each menu item.
	 */
	getVoiceMenu() {
		return Object.keys(this.VOICE_INFO).map(voiceId => ({
			text: this.VOICE_INFO[voiceId].name,
			value: voiceId
		}));
	}

	/**
	 * Get the localized menu of languages for the "set language" block.
	 * For each language:
	 *	if there is a custom translated spoken language name, use that;
	 *	otherwise use the translation in the languageNames menuMap;
	 *	otherwise fall back to the untranslated name in LANGUAGE_INFO.
	 * @return {array} the text and value for each menu item.
	 */
	getLanguageMenu() {
		const editorLanguage = this.getEditorLanguage();
		// Get the array of localized language names
		const localizedNameMap = {};
		let nameArray = languageNames.menuMap[editorLanguage];
		if (nameArray) {
			// Also get any localized names of spoken languages
			let spokenNameArray = [];
			if (languageNames.spokenLanguages) {
				spokenNameArray = languageNames.spokenLanguages[editorLanguage];
				nameArray = nameArray.concat(spokenNameArray);
			}
			// Create a map of language code to localized name
			// The localized spoken language names have been concatenated onto
			// the end of the name array, so the result of the forEach below is
			// when there is both a written language name (e.g. 'Chinese
			// (simplified)') and a spoken language name (e.g. 'Chinese
			// (Mandarin)', we always use the spoken version.
			nameArray.forEach(lang => {
				localizedNameMap[lang.code] = lang.name;
			});
		}

		return Object.keys(this.LANGUAGE_INFO).map(key => {
			let name = this.LANGUAGE_INFO[key].name;
			const localizedName = localizedNameMap[key];
			if (localizedName) {
				name = localizedName;
			}
			// Uppercase the first character of the name
			name = name.charAt(0).toUpperCase() + name.slice(1);
			return {
				text: name,
				value: key
			};
		});
	}

	/**
	 * Set the voice for speech synthesis for this sprite.
	 * @param {object} args Block arguments
	 * @param {object} util Utility object provided by the runtime.
	 */
	setVoice(args, util) {
		const state = this._getState(util.target);

		let voice = args.VOICE;

		// If the arg is a dropped number, treat it as a voice index
		let voiceNum = parseInt(voice, 10);
		if (!isNaN(voiceNum)) {
			voiceNum -= 1; // Treat dropped args as one-indexed
			voiceNum = MathUtil.wrapClamp(voiceNum, 0, Object.keys(this.VOICE_INFO).length - 1);
			voice = Object.keys(this.VOICE_INFO)[voiceNum];
		}

		// Only set the voice if the arg is a valid voice id.
		if (Object.keys(this.VOICE_INFO).includes(voice)) {
			state.voiceId = voice;
		}
	}

	/**
	 * Set the language for speech synthesis.
	 * @param {object} args Block arguments
	 */
	setLanguage(args) {
		this.setCurrentLanguage(args.LANGUAGE);
	}

	getLip() {
		return this._lip;
	}

	oh_mouseX() {
		//return this._lip;
        
        return Math.round((this.runtime.ioDevices.mouse.getScratchX()+240)/4.8)/10;
        
	}	
    
    oh_mouseY() {
		//return this._lip;
        
        return Math.round((this.runtime.ioDevices.mouse.getScratchY()+180)/3.6)/10;
        
	}

	/**
	 * Stop all current speech.
	 */
	_stopAll() {
		//this.runCommand(['R', '', '']);
		this._soundPlayers.forEach(player => {
			player.stop();
		});
	}
    
   
/**
 * Convert the provided text into a sound file and then play the file.
 * @param	{object} args Block arguments
 * @param {object} util Utility object provided by the runtime.
 * @return {Promise} A promise that resolves after playing the sound
 */
speakNoWait(args, util) {
	return this._speak(args, util, false);
}

/**
 * Convert the provided text into a sound file and then play the file.
 * @param	{object} args Block arguments
 * @param {object} util Utility object provided by the runtime.
 * @return {Promise} A promise that resolves after playing the sound
 */
speakAndWait(args, util) {
	return this._speak(args, util, true);
}

askAndWait(args, util) {
	const question = Cast.toString(args.QUESTION);
	const speakArgs = { WORDS: question };

	return this._speak(speakArgs, util, true).then(() => {
		const askPrimitive = this.runtime &&
			this.runtime._primitives &&
			this.runtime._primitives.sensing_askandwait;

		if (typeof askPrimitive !== 'function') {
			log.warn('sensing_askandwait primitive unavailable for askAndWait block');
			return Promise.resolve();
		}

		return askPrimitive({ QUESTION: question }, util);
	});
}

_speak(args, util, wait) {
	// Cast input to string
	let words = Cast.toString(args.WORDS);
	let locale = this._getSpeechSynthLocale();

	const state = this._getState(util.target);

	let gender = this.VOICE_INFO[state.voiceId].gender;
	let playbackRate = this.VOICE_INFO[state.voiceId].playbackRate;

	// Special case for voices where the synthesis service only provides a
	// single gender voice. In that case, always request the female voice,
	// and set special playback rates for the tenor and giant voices.
	if (this.LANGUAGE_INFO[this.getCurrentLanguage()].singleGender) {
		gender = 'female';
		if (state.voiceId === TENOR_ID) {
			playbackRate = FEMALE_TENOR_RATE;
		}
		if (state.voiceId === GIANT_ID) {
			playbackRate = FEMALE_GIANT_RATE;
		}
	}

	// Build up URL
	let path = `${SERVER_HOST}/synth`;
	path += `?locale=${locale}`;
	path += `&gender=${gender}`;
	path += `&text=${encodeURIComponent(words.substring(0, 128))}`;

	// Perform HTTP request to get audio file
	var instance = this;
	var p = new Promise(resolve => {
		nets({
			url: path,
			timeout: SERVER_TIMEOUT
		}, (err, res, body) => {
			if (err) {
				log.warn(err);
				return resolve();
			}
			if (res.statusCode !== 200) {
				log.warn(res.statusCode);
				return resolve();
			}
			var buffer1 = body.buffer.slice(0);		// copy for audio processor
			var audioEngine = this.runtime.audioEngine;
			var audioProcessor = null;

			audioEngine.audioContext.decodeAudioData(body.buffer)
				.then(function (decoded) {
					const buf = decoded.getChannelData(0);
					var maxVolume = 0;
					for (var i = 0; i < buf.length; i++) {
						var absVolume = Math.abs(buf[i]);
						if (absVolume > maxVolume) {
							maxVolume = absVolume;
						}
					}
					return maxVolume;
				})
				.then(function (overallMax) {
					audioProcessor = audioEngine.audioContext.createScriptProcessor(0, 1, 1);
					audioProcessor.onaudioprocess = function (event) {
						const buf = event.inputBuffer.getChannelData(0);
						const len = buf.length;
						var sampleMax = 0;
						for (var i = 0; i < len; i++) {
							var abs = Math.abs(buf[i]);
							if (abs > sampleMax) {
								sampleMax = abs;
							}
						}
						var volume = LIP_MIN + (sampleMax / overallMax * (LIP_MAX - LIP_MIN));
						instance._lip = Math.round((volume + Number.EPSILON) * 100) / 100;
					};
					const sound = { data: { buffer: buffer1 } };
					return audioEngine.decodeSoundPlayer(sound);
				})
				.then(soundPlayer => {
					instance._soundPlayers.set(soundPlayer.id, soundPlayer);
					soundPlayer.setPlaybackRate(playbackRate);

					// Increase the volume
					const chain = audioEngine.createEffectChain();
					chain.set('volume', SPEECH_VOLUME);
					soundPlayer.connect(chain);

					// Play
					soundPlayer.play();
					soundPlayer.outputNode.connect(audioProcessor);
					audioProcessor.connect(audioEngine.audioContext.destination);

					soundPlayer.on('stop', () => {
						instance._soundPlayers.delete(soundPlayer.id);
						audioProcessor.onaudioprocess = null;
						audioProcessor = null;
						instance._lip = LIP_MIN;
						resolve();
					});
				});
		});
	});

	if (wait) {
		return p;
	}
	return Promise.resolve();
}
}

module.exports = Scratch3OhbotBlocks;