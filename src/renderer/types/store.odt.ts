import { feedbackItem, listItem } from "./common.odt";

export type State = {
    isRecording: boolean;
    isPlaying: boolean;
    list: listItem[];
    feedbackList: feedbackItem[];
    addPageFlag: boolean;
    addIndex: number;
}

export type Action = {
    setIsRecording: (isRecording: boolean) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setList: (list: listItem[]) => void;
    setFeedbackList: (feedbackList: feedbackItem[]) => void;
    setAddPageFlag: (addPageFlag: boolean) => void;
    setAddIndex: (addIndex: number) => void;
}
