import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class JupiterMoons_reader extends PApplet {

// Jupiter's Moons
// based on Astronomical Algorithms by Jean Meeus
// Robby Kraft

// NOW TIME in Processing is this computers' time. Needs to be UTC
//int TIME_ZONE_ADJUST = 5;  // adjusts New York back to UTC
int TIME_ZONE_ADJUST = 1;  // adjusts Spain to UTC

float ZOOM = 14;

PImage jupiterImage;

public void setup(){
  String filename = "images/output.png";
  
  jupiterImage = loadImage("jupiter.png");

  Date date = new Date();  // sets to now time
    
  String[] lines = loadStrings("date.txt");
  if(lines.length >= 6){
    date.year = PApplet.parseInt(lines[0]);
    date.month = PApplet.parseInt(lines[1]);
    date.day = PApplet.parseInt(lines[2]);
    date.hour = PApplet.parseInt(lines[3]);
    date.minute = PApplet.parseInt(lines[4]);
    date.second = PApplet.parseInt(lines[5]);
  } else{
    save(filename);
    exit();
  }

  date.hour += TIME_ZONE_ADJUST; // if server is elsewhere, move time to UTC
  date.correctDates();  // always call correctDates when you manually change time
  
  // CALCULATE ZOOM
  Moons moons = new Moons(date.year, date.month, date.day, date.hour, date.minute, date.second);
  ZOOM = 350/moons.zoom() - 2;
  textSize(14 + (ZOOM-13)*0.5f );
  
  imageWithDate(date);
  save(filename);
  exit();
}

public void imageWithDate(Date date){
  // calculations
  Moons moons = new Moons(date.year, date.month, date.day, date.hour, date.minute, date.second);
  float centerX = width * 0.5f;
  float centerY = height * 0.5f;
  // draw
  background(0);
  //text(year + " " + month + " " + day + " " + hour + ":" + minute, centerX - 50, 100);
  for(int i = 0; i < 4; i++){
    if(moons.inFront[i] == false){
      fill(moons.red[i], moons.green[i], moons.blue[i]);
      ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, .15f*ZOOM, .15f*ZOOM);
      text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5f, centerY + moons.y[i]*ZOOM + 2*ZOOM);
    }
  }
  fill(255);
  noStroke();
  image(jupiterImage, centerX - ZOOM*2.0f*0.5f, centerY - ZOOM*2.0f*0.5f, ZOOM*2.0f, ZOOM*2.0f);
  for(int i = 0; i < 4; i++){
    if(moons.inFront[i] == true){
      fill(moons.red[i], moons.green[i], moons.blue[i]);
      ellipse(centerX - moons.x[i]*ZOOM, centerY + moons.y[i]*ZOOM, .15f*ZOOM, .15f*ZOOM);
      text(moons.names[i], centerX - moons.x[i]*ZOOM - textWidth(moons.names[i])*0.5f, centerY + moons.y[i]*ZOOM + 2*ZOOM);
    }
  }
}
class Date{
  int year, month, day, hour, minute, second;
  int[] monLen = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

  Date(){
    year = year();
    month = month();
    day = day();
    hour = hour();
    minute = minute();
    second = second();
  }
  
  public void correctDates(){
    if(year%4 == 0) monLen[2] = 29;
    else monLen[2] = 28;
    if(minute < 0) { minute += 60; hour--; }
    if(minute > 60) { minute -= 60; hour++; }
    if(hour < 0) { hour += 24; day--; }
    if(hour > 23) { hour -= 24; day++; }
    if(day < 1) { day += monLen[month-1]; month--; }
    if(day > monLen[month-1]) { day -= monLen[month-1]; month++; }
    if(month < 1) { month += 12; year--; }
    if(month > 12) { month -= 12; year++; }
  }

}
float D2R = 0.017453292519943f;

class Moons{

  String[] names = { "Io", "Europa", "Ganymede", "Callisto" };
  
  boolean[] inFront = {false, false, false, false};

  float[] x = new float[4];
  float[] y = new float[4];
  
  int[] red = {255, 193, 156, 138};
  int[] green = {233, 142, 144, 118};
  int[] blue = {122, 80, 127, 85};
  
  public float zoom(){
    float largest = 0.0f;
    for(int i = 0; i < 4; i++){
      if(abs(x[i]) > largest) largest = abs(x[i]);
    }
    return largest;
  }

  public float J2000DaysFromUTCTime(int yr, int mon, int d, int hr, int min, int sec){
    float wholePart = 367*yr-floor(7*(yr+floor((mon+9)/12.0f))/4.0f)+floor(275*mon/9.0f)+d-730531.5f;
    float fractionalPart = (hr + min/60.0f + sec/3600.0f)/24.0f;
    // return value units in days
    return (float)wholePart + fractionalPart;
  }
  
  Moons(int yr, int mon, int da, int hr, int min, int sec){
    float J2000 = J2000DaysFromUTCTime(yr, mon, da, hr, min, sec);
    float d = J2000;  // d represents (d - delta/173)
    
    // JUPITER numbers
    float V = 172.74f + 0.00111588f * d;
    float M = 357.529f + 0.9856003f * d;
    float N = 20.020f + 0.0830853f * d + 0.329f * sin(V*D2R);
    float J = 66.115f + 0.9025179f * d - 0.329f * sin(V*D2R);
    float A = 1.915f * sin(M*D2R) + 0.020f * sin(2*M*D2R);
    float B = 5.555f * sin(N*D2R) + 0.168f * sin(2*N*D2R);
    float K = J + A - B;
    float R = 1.00014f - 0.01671f * cos(M*D2R) - 0.00014f * cos(2*M*D2R);
    float r = 5.20872f - 0.25208f * cos(N*D2R) - 0.00611f * cos(2*N*D2R);
    float delta = sqrt(pow(r,2) + pow(R,2) - 2*r*R*cos(K*D2R));
    float psi = asin(R/delta*sin(K*D2R)) / D2R;
    float lamda = 34.35f + 0.083091f*d + 0.329f*sin(V*D2R) + B;
    float Ds = 3.12f * sin( (lamda+42.8f)*D2R );
    float De = Ds - 2.22f * sin(psi*D2R) * cos( (lamda+22)*D2R ) - 1.30f * (r-delta)/delta * sin( (lamda - 100.5f)*D2R ); 
  
    // MOON numbers
    float[] u = new float[4];
    u[0] = 163.8069f + 203.4058646f * d + psi - B;
    u[1] = 358.4140f + 101.2916335f * d + psi - B;
    u[2] = 5.7176f + 50.2345180f * d + psi - B;
    u[3] = 224.8092f + 21.4879800f * d + psi - B;
    float G = 331.18f + 50.310482f * d;
    float H = 87.45f + 21.569231f * d;
    float[] correction = new float[4];
    correction[0] = 0.472f * sin((u[0] - u[1])*D2R)*2;
    correction[1] = 1.065f * sin((u[1] - u[2])*D2R)*2;
    correction[2] = 0.165f * sin(G*D2R);
    correction[3] = 0.843f * sin(H*D2R);
    float[] radius = new float[4];
    radius[0] = 5.9057f - 0.0244f * cos((u[0] - u[1])*D2R)*2;
    radius[1] = 9.3966f - 0.0882f * cos((u[1] - u[2])*D2R)*2;
    radius[2] = 14.9883f - 0.0216f * cos(G*D2R);
    radius[3] = 26.3627f - 0.1939f * cos(H*D2R);
    for(int i = 0; i < 4; i++){
      u[i] += correction[i];
    }
    for(int i = 0; i < 4; i++){
      x[i] = -radius[i] * sin(u[i]*D2R);
      y[i] = radius[i] * cos(u[i]*D2R)*sin(De*D2R);
    }  
    // check if things are in front of jupiter
    //between 90 and 270
    for(int i = 0; i < 4; i++){
      if(u[i] > 360){
        while(u[i] > 360) u[i] -= 360;
      }
      if(u[i] < 90 || u[i] > 270) inFront[i] = true;
    }
  }
}
  public void settings() {  size(800, 400); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "JupiterMoons_reader" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
