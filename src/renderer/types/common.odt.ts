export type listItem = {
    id: string;
    timeStamp: number;
    eventType: string;
    cssSelector: string;
    // xpath: string;
    tagName: string;
    value: string;
    innerText: string;
    rawHtml: string;
    description: string;
    url: string;
    delay: number;
    autoDelay: boolean;
}

export type feedbackItem = {
    id: string;
    name: string;
    status: boolean;
    msg: string;
}

export type scriptResult = boolean | string;