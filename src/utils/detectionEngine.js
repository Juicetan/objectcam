import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let loadPromise = null;

export const OBJECT_TYPES = {
  "PERSON": "person",
  "AIRPLANE": "airplane",
  "APPLE": "apple",
  "BACKPACK": "backpack",
  "BANANA": "banana",
  "BASEBALL BAT": "baseball bat",
  "BASEBALL GLOVE": "baseball glove",
  "BEAR": "bear",
  "BED": "bed",
  "BENCH": "bench",
  "BICYCLE": "bicycle",
  "BIRD": "bird",
  "BOAT": "boat",
  "BOOK": "book",
  "BOTTLE": "bottle",
  "BOWL": "bowl",
  "BROCCOLI": "broccoli",
  "BUS": "bus",
  "CAKE": "cake",
  "CAR": "car",
  "CARROT": "carrot",
  "CAT": "cat",
  "CELL PHONE": "cell phone",
  "CHAIR": "chair",
  "CLOCK": "clock",
  "COUCH": "couch",
  "COW": "cow",
  "CUP": "cup",
  "DINING TABLE": "dining table",
  "DOG": "dog",
  "DONUT": "donut",
  "ELEPHANT": "elephant",
  "FIRE HYDRANT": "fire hydrant",
  "FORK": "fork",
  "FRISBEE": "frisbee",
  "GIRAFFE": "giraffe",
  "HAIR DRIER": "hair drier",
  "HANDBAG": "handbag",
  "HORSE": "horse",
  "HOT DOG": "hot dog",
  "KEYBOARD": "keyboard",
  "KITE": "kite",
  "KNIFE": "knife",
  "LAPTOP": "laptop",
  "MICROWAVE": "microwave",
  "MOTORCYCLE": "motorcycle",
  "MOUSE": "mouse",
  "ORANGE": "orange",
  "OVEN": "oven",
  "PARKING METER": "parking meter",
  "PIZZA": "pizza",
  "POTTED PLANT": "potted plant",
  "REFRIGERATOR": "refrigerator",
  "REMOTE": "remote",
  "SANDWICH": "sandwich",
  "SCISSORS": "scissors",
  "SHEEP": "sheep",
  "SINK": "sink",
  "SKATEBOARD": "skateboard",
  "SKIS": "skis",
  "SNOWBOARD": "snowboard",
  "SPOON": "spoon",
  "SPORTS BALL": "sports ball",
  "STOP SIGN": "stop sign",
  "SUITCASE": "suitcase",
  "SURFBOARD": "surfboard",
  "TEDDY BEAR": "teddy bear",
  "TENNIS RACKET": "tennis racket",
  "TIE": "tie",
  "TOASTER": "toaster",
  "TOILET": "toilet",
  "TOOTHBRUSH": "toothbrush",
  "TRAFFIC LIGHT": "traffic light",
  "TRAIN": "train",
  "TRUCK": "truck",
  "TV": "tv",
  "UMBRELLA": "umbrella",
  "VASE": "vase",
  "WINE GLASS": "wine glass",
  "ZEBRA": "zebra"
}

class DetectionModel{
  constructor(tfModel){
    this.tfModel = tfModel;
  }

  async detect(video, opts = {}){
    const { objType = OBJECT_TYPES.PERSON, confidence = 0.55 } = opts;
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