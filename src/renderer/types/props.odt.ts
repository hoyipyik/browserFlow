import { feedbackItem, listItem } from "./common.odt";

export type ListItemProps = {
    item: listItem;
}

export type FeedbackItemProps = {
    item: feedbackItem;
    index: number;
}