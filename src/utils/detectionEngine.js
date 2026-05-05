import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let loadPromise = null;

export const OBJECT_TYPES = {
  PERSON: 'person',
  BICYCLE: 'bicycle',
  CAR: 'car',
  MOTORCYCLE: 'motorcycle',
  AIRPLANE: 'airplane',
  BUS: 'bus',
  TRAIN: 'train',
  TRUCK: 'truck',
  BOAT: 'boat',
  TRAFFIC_LIGHT: 'traffic light',
  CARROT: 'carrot',
  HOT_DOG: 'hot dog',
  PIZZA: 'pizza',
  DONUT: 'donut',
  CAKE: 'cake',
  CHAIR: 'chair',
  COUCH: 'couch',
  POTTED_PLANT: 'potted plant',
  BED: 'bed',
  DINING_TABLE: 'dining table',
  TOILET: 'toilet',
  TV: 'tv',
  LAPTOP: 'laptop',
  MOUSE: 'mouse',
  REMOTE: 'remote',
  KEYBOARD: 'keyboard',
  CELL_PHONE: 'cell phone',
  MICROWAVE: 'microwave',
  OVEN: 'oven',
  TOASTER: 'toaster',
  SINK: 'sink',
  REFRIGERATOR: 'refrigerator',
  BOOK: 'book',
  CLOCK: 'clock',
  VASE: 'vase',
  SCISSORS: 'scissors',
  TEDDY_BEAR: 'teddy bear',
  HAIR_DRIER: 'hair drier',
  TOOTHBRUSH: 'toothbrush',
};

class DetectionModel{
  constructor(tfModel){
    this.tfModel = tfModel;
  }

  async detect(video, opts = {}){
    const { objType = OBJECT_TYPES.PERSON, confidence = 0.66 } = opts;
    const predictions = await this.tfModel.detect(video);
    return predictions.filter((p) => p.class === objType && p.score >= confidence).map((p) => ({
      objType: p.class,
      confidence: p.score,
      position: {
        x: p.bbox[0],
        y: p.bbox[1],
        width: p.bbox[2],
        height: p.bbox[3],
      },
    }));
  }
}

export const getModel = async () => {
  if(!loadPromise){
    loadPromise = (async () => {
      await tf.ready();
      const tfModel = await cocoSsd.load();
      return new DetectionModel(tfModel);
    })();
  }
  return loadPromise;
}