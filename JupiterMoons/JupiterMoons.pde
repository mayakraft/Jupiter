// Jupiter's Moons
// based on Astronomical Algorithms by Jean Meeus
// Robby Kraft

// NOW TIME in Processing is this computers' time. Needs to be UTC
//int TIME_ZONE_ADJUST = 5;  // adjusts New York back to UTC
int TIME_ZONE_ADJUST = 1;  // adjusts Spain to UTC

float ZOOM = 14;

PImage jupiterImage;

void setup(){
  size(800, 400);
  jupiterImage = loadImage("jupiter.png");
  
  Date date = new Date();  // sets to now time
  date.hour += TIME_ZONE_ADJUST; // if server is elsewhere, move time to UTC
  date.correctDates();  // always call correctDates when you manually change time
  
  // 1. UNCOMMENT FOR IMAGE GENERATION
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
//  date.minute += 16;
//  date.correctDates();
//  imageWithDate(date);
//}
// 2. ///////////////////////////////////

void imageWithDate(Date date){
  // calculations
  Moons moons = new Moons(date.year, date.month, date.day, date.hour, date.minute, date.second);
  float centerX = width * 0.5;
  float centerY = height * 0.5;
  // draw
  background(0);
  fill(255);
  noStroke();
  image(jupiterImage, centerX - ZOOM*2.0*0.5, centerY - ZOOM*2.0*0.5, ZOOM*2.0, ZOOM*2.0);
  //text(year + " " + month + " " + day + " " + hour + ":" + minute, centerX - 50, 100);
  for(int i = 0; i < 4; i++){
    fill(moons.red[i], moons.green[i], moons.blue[i]);
    ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, 3, 3);
    text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5, centerY + moons.y[i]*ZOOM + 50);
  }
}