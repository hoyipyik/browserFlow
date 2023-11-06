import { listItem } from "./common.odt";

export type ChromeMsg = {
    channel: Channel,
    data: any
}

export type Channel = 'recorder' | 'player' | 'recording-item'
    | 'test' | 'playing-feedback' | 'recorder-status' | 'clear-tab-flag';

export type RecorderMsgData = {
    isRecording: boolean;
}

export type PlayerMsgData = {
    isPlaying: boolean;
    list: listItem[];
}