export interface IUserData {
    login: string;
    password: string;
}

export interface IPagination {
    mainDictionary: number;
    maxMainDictionary: number;
    draftDictionary: number;
    maxDraftDictionary: number;
}

export interface IWord {
    word: string;
    translations: Array<string>;
    imageURL?: string;
}

export interface IGameStat extends IWord {
    isAnswered: boolean;
    userAnswer?: string;
}