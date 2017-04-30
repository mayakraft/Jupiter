// Jupiter's Moons
// based on Astronomical Algorithms by Jean Meeus
// Robby Kraft

// NOW TIME in Processing is this computers' time. Needs to be UTC
//int TIME_ZONE_ADJUST = 5;  // adjusts New York back to UTC
int TIME_ZONE_ADJUST = 1;  // adjusts Spain to UTC
  
float SCALE = 13;
float centerX = 400;
float centerY = 200;

PImage jupiterImage;

void setup(){
  size(800, 400);
  jupiterImage = loadImage("jupiter.png");
  
  Date date = new Date();  // sets to now time
  date.hour += TIME_ZONE_ADJUST; // if server is elsewhere, move time to UTC
  date.correctDates();  // always call correctDates when you manually change time
  
  for(int imageNumber = 0; imageNumber < 90; imageNumber++){
    String filename = "images/output" + nf(imageNumber, 4) + ".png";
    saveImageWithDate(filename, date);
    // increment
    date.minute += 4;
    date.correctDates();
  }
  exit();
}

void saveImageWithDate(String filename, Date date){
  Moons moons = new Moons(date.year, date.month, date.day, date.hour, date.minute, date.second);
  background(0);
  fill(255);
  noStroke();
  image(jupiterImage, centerX - SCALE*2.0*0.5, centerY - SCALE*2.0*0.5, SCALE*2.0, SCALE*2.0);
  //text(year + " " + month + " " + day + " " + hour + ":" + minute, centerX - 50, 100);
  for(int i = 0; i < 4; i++){
    fill(moons.red[i], moons.green[i], moons.blue[i]);
    ellipse(centerX - moons.x[i]*SCALE, centerY + moons.y[i]*SCALE, 3, 3);
    text(moons.names[i], centerX - moons.x[i]*SCALE, centerY + moons.y[i]*SCALE + 50);
  }
  save(filename);
}