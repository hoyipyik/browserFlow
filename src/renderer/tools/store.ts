import { create } from 'zustand';
import { Action, State } from '../types/store.odt';
import { feedbackItem, listItem } from '../types/common.odt';
import { list } from './dammyData';

export const useStore = create<State & Action>((set) => ({
    isPlaying: false,
    isRecording: false,
    list: list as listItem[],
    feedbackList: [] as feedbackItem[],
    addPageFlag: false,
    addIndex: -1,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsRecording: (isRecording) => set({ isRecording }),
    setList: (list) => set({ list }),
    setFeedbackList: (feedbackList: feedbackItem[]) => set({ feedbackList }),
    setAddPageFlag: (addPageFlag: boolean) => set({ addPageFlag }),
    setAddIndex: (addIndex: number) => set({ addIndex }),
}));
