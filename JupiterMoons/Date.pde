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
  
  void correctDates(){
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