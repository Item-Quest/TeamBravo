import { indoorPredict } from "./indoorPredict";
import { outdoorPredict } from "./outdoorPredict";
import socket from '../socket';
import { getGameMode } from '../dataProvider.js';

let mode;

export async function loadModelAndPredict(imageData) {
    console.log(mode);

    if (mode === 'GeoQuest') {
        return outdoorPredict(imageData);
    } 
    else {
        return indoorPredict(imageData);
    }

}

export async function setMode(newMode) {
    mode = newMode;
}