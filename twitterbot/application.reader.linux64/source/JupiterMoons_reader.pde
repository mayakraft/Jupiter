// Jupiter's Moons
// based on Astronomical Algorithms by Jean Meeus
// Robby Kraft

// NOW TIME in Processing is this computers' time. Needs to be UTC
//int TIME_ZONE_ADJUST = 5;  // adjusts New York back to UTC
int TIME_ZONE_ADJUST = 1;  // adjusts Spain to UTC

float ZOOM = 14;

PImage jupiterImage;

void setup(){
  String filename = "images/output.png";
  size(800, 400);
  jupiterImage = loadImage("jupiter.png");

  Date date = new Date();  // sets to now time
    
  String[] lines = loadStrings("date.txt");
  if(lines.length >= 6){
    date.year = int(lines[0]);
    date.month = int(lines[1]);
    date.day = int(lines[2]);
    date.hour = int(lines[3]);
    date.minute = int(lines[4]);
    date.second = int(lines[5]);
  } else{
    save(filename);
    exit();
  }

  date.hour += TIME_ZONE_ADJUST; // if server is elsewhere, move time to UTC
  date.correctDates();  // always call correctDates when you manually change time
  
  imageWithDate(date);
  save(filename);
  exit();
}

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
  //text(date.year + " " + date.month + " " + date.day + " " + date.hour + ":" + date.minute, centerX - 50, 100);
  for(int i = 0; i < 4; i++){
    fill(moons.red[i], moons.green[i], moons.blue[i]);
    ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, 3, 3);
    text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5, centerY + moons.y[i]*ZOOM + 50);
  }
}