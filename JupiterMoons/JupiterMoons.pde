// Jupiter's Moons
// based on Astronomical Algorithms by Jean Meeus
// Robby Kraft

// NOW TIME in Processing is this computers' time. Needs to be UTC
//int TIME_ZONE_ADJUST = 4;  // adjusts New York back to UTC, for some reason it's 4 not 5
int TIME_ZONE_ADJUST = 1;  // adjusts Spain to UTC

float ZOOM = 14;

PImage jupiterImage;

void setup(){
  size(800, 400);
  jupiterImage = loadImage("jupiter.png");
  
  ////////////////////////////////////////////////////////
  // PRE CALCULATE THE ZOOM
  float moonZoom = 0;
  Date dateScan = new Date();
  dateScan.hour += TIME_ZONE_ADJUST;
  dateScan.correctDates();
  for(int i = 0; i < 90; i++){
    Moons moons = new Moons(dateScan.year, dateScan.month, dateScan.day, dateScan.hour, dateScan.minute, dateScan.second);
    dateScan.minute += 4;
    dateScan.correctDates();
    float thisZoom = moons.zoom();
    if(thisZoom > moonZoom) moonZoom = thisZoom;
  }
  ZOOM = 350/moonZoom;
  textSize(14 + (ZOOM-13)*0.5 );
  ////////////////////////////////////////////////////////
  
  
  Date date = new Date();  // sets to now time
  date.hour += TIME_ZONE_ADJUST; // if server is elsewhere, move time to UTC
  date.correctDates();  // always call correctDates when you manually change time
  //1. UNCOMMENT FOR IMAGE GENERATION
  for(int imageNumber = 0; imageNumber < 90; imageNumber++){
   imageWithDate(date);
   String filename = "images/output" + nf(imageNumber, 4) + ".png";
   save(filename);
   // increment
   date.minute += 4;
   date.correctDates();
  }
  exit();
  // 1. /////////////////////////////////
}

// 2. UNCOMMENT FOR DRAWING LOOPS
//Date date = new Date();
//void draw(){
//  date.minute += 8;
//  date.correctDates();
//  imageWithDate(date);
//}
// 2. ///////////////////////////////////

//float minZoom = 13;
//float triggerZoom = 30;
//float maxZoom = 60;

void imageWithDate(Date date){
  // calculations
  Moons moons = new Moons(date.year, date.month, date.day, date.hour, date.minute, date.second);
  // dynamic zoom
  //float moonZoom = moons.zoom();
  //ZOOM = 350/moonZoom;
  //float zoomTween = (ZOOM-minZoom) / (maxZoom - minZoom);
  //if(zoomTween > 1.0) zoomTween = 1.0;
  //zoomTween *= PI*0.5;
  //zoomTween = cos(PI*0.5 - zoomTween);
  //ZOOM = minZoom + zoomTween * (triggerZoom - minZoom);
  //textSize(14 + (ZOOM-minZoom)*0.5 );


  float centerX = width * 0.5;
  float centerY = height * 0.5;
  // draw
  background(0);
  //text(year + " " + month + " " + day + " " + hour + ":" + minute, centerX - 50, 100);
  for(int i = 0; i < 4; i++){
    if(moons.inFront[i] == false){
      fill(moons.red[i], moons.green[i], moons.blue[i]);
      ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, .15*ZOOM, .15*ZOOM);
      text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5, centerY + moons.y[i]*ZOOM + 2*ZOOM);
    }
  }
  fill(255);
  noStroke();
  image(jupiterImage, centerX - ZOOM*2.0*0.5, centerY - ZOOM*2.0*0.5, ZOOM*2.0, ZOOM*2.0);
  for(int i = 0; i < 4; i++){
    if(moons.inFront[i] == true){
      fill(moons.red[i], moons.green[i], moons.blue[i]);
      ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, .15*ZOOM, .15*ZOOM);
      text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5, centerY + moons.y[i]*ZOOM + 2*ZOOM);
    }
  }

}