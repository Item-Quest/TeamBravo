import { indoorPredict } from "./indoorPredict";
import { outdoorPredict } from "./outdoorPredict";
import socket from '../socket';
import { getGameMode } from '../dataProvider.js';

let mode;

export async function loadModelAndPredict(imageData) {

    if (mode === 'GeoQuest') {
        return await outdoorPredict(imageData); // returns [{ label, bbox }]
    } else {
        return await indoorPredict(imageData);  
    }
}

export async function setModelMode(newMode) {
    if(mode !== newMode) {
        console.log("Model mode set to: ", newMode);
    }
    mode = newMode;
}