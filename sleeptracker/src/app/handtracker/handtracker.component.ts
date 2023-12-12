import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import * as handTrack from 'handtrackjs';
import { PredictionEvent } from '../prediction-event';

@Component({
  selector: 'app-handtracker',
  templateUrl: './handtracker.component.html',
  styleUrls: ['./handtracker.component.css']
})
export class HandtrackerComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Output() onGestureDetected = new EventEmitter<PredictionEvent>();
  @ViewChild('htvideo') video: any;
  
  /* 
  SAMPLERATE determines the rate at which detection occurs (in milliseconds)
  500, or one half second is about right, but feel free to experiment with faster
  or slower rates
  */
  SAMPLERATE: number = 500; 
  
  detectedGesture:string = "None"
  width:string = "400"
  height:string = "400"

  private model: any = null;
  private runInterval: any = null;

  //handTracker model
  private modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
  };

  constructor() {
  }
  
  ngOnInit(): void{
    handTrack.load(this.modelParams).then((lmodel: any) =>{
        this.model = lmodel;
        console.log("loaded");
    });
  }

  ngOnDestroy(): void{
      this.model.dispose();
  }

  startVideo(): Promise<any> {
    return handTrack.startVideo(this.video.nativeElement).then(function(status: any){
        return status;
    }, (err: any) => { return err; }) 
  }

  startDetection(){
    this.startVideo().then(()=>{
        //The default size set in the library is 20px. Change here or use styling
        //to hide if video is not desired in UI.
        this.video.nativeElement.style.height = "200px"

        console.log("starting predictions");
        this.runInterval = setInterval(()=>{
            this.runDetection();
        }, this.SAMPLERATE);
    }, (err: any) => { console.log(err); });
  }

  stopDetection(){
    console.log("stopping predictions");
    clearInterval(this.runInterval);
    handTrack.stopVideo(this.video.nativeElement);
  }

  /*
    runDetection demonstrates how to capture predictions from the handTrack library.
    It is not feature complete! Feel free to change/modify/delete whatever you need
    to meet your desired set of interactions
  */
  runDetection(){
    // // Stop detecting gestures if modal is open
    // if (this.isModalOpen) {
    //   return;
    // }
    if (this.model != null){
      let predictions = this.model.detect(this.video.nativeElement).then((predictions: any) => {
        if (predictions.length <= 0) return;
        
        let openhands = 0;
        let closedhands = 0;
        let pointing = 0;
        let pinching = 0;
        let palmUp = 0;
        let palmDown = 0;

        for(let p of predictions){
          console.log(p.label + " at X: " + p.bbox[0] + ", Y: " + p.bbox[1] + " at X: " + p.bbox[2] + ", Y: " + p.bbox[3]);

          const aspectRatio = p.bbox.width / p.bbox.height;
          const aspectRatioThreshold = 0.8; // Adjust based on camera angle & hand size
          const palmUpThreshold = 300; // Y-coordinate value
          const palmDownThreshold = 200; // Y-coordinate value

          if (p.label === 'open' && aspectRatio > aspectRatioThreshold) {
            openhands++;
          } else if (p.label === 'closed'){
            closedhands++;
          } else if (p.label === 'point'){
            pointing++;
          } else if (p.label === 'pinch'){
            pinching++;
          } else if (p.label === 'palm' && p.bbox[1] < palmUpThreshold) {
            palmUp++;
          } else if (p.label === 'palm' && p.bbox[1] >= palmDownThreshold) {
            palmDown++;
          }
        }

        if (openhands > 1) this.detectedGesture = "Two Open Hands";
        else if(openhands == 1) this.detectedGesture = "Open Hand";
        
        if (closedhands > 1) this.detectedGesture = "Two Closed Hands";
        else if(closedhands == 1) this.detectedGesture = "Closed Hand";
        
        // if (pointing > 1) this.detectedGesture = "Two Hands Pointing";
        // else if(pointing == 1) this.detectedGesture = "Hand Pointing";
        
        if (pinching > 1) this.detectedGesture = "Two Hands Pinching";
        else if(pinching == 1) this.detectedGesture = "Hand Pinching";

        if (palmUp > 1) this.detectedGesture = 'Two Hands Palm Up';
        else if (palmUp == 1) this.detectedGesture = 'Hand Palm Up';

        if (palmDown > 1) this.detectedGesture = 'Two Hands Palm Down';
        else if (palmDown == 1) this.detectedGesture = 'Hand Palm Down';

        if (openhands == 0 && closedhands == 0 && pointing == 0 && pinching == 0 && palmUp == 0 && palmDown == 0) {
          this.detectedGesture = 'None';
        }
        
        this.onGestureDetected.emit({
          prediction: this.detectedGesture,
          getPrediction: () => this.detectedGesture,
        });
      }, (err: any) => {
          console.log('ERROR');
          console.log(err);
        });
    } else {
      console.log('no model');
    }
  }
}