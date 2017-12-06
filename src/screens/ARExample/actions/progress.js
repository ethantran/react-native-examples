export const SET_PROGRESS = 'progress/SET';
export const CLOSE_PROGRESS = 'progress/CLOSE';

export const setProgress = progress => ({ type: SET_PROGRESS, progress });
export const closeProgress = () => ({ type: CLOSE_PROGRESS });