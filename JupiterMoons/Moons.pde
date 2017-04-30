float D2R = 0.017453292519943;

class Moons{

  String[] names = { "Io", "Europa", "Ganymede", "Callisto" };

  float[] x = new float[4];
  float[] y = new float[4];
  
  int[] red = {255, 193, 156, 138};
  int[] green = {233, 142, 144, 118};
  int[] blue = {122, 80, 127, 85};

  float J2000DaysFromUTCTime(int yr, int mon, int d, int hr, int min, int sec){
    float wholePart = 367*yr-floor(7*(yr+floor((mon+9)/12.0))/4.0)+floor(275*mon/9.0)+d-730531.5;
    float fractionalPart = (hr + min/60.0 + sec/3600.0)/24.0;
    // return value units in days
    return (float)wholePart + fractionalPart;
  }
  
  Moons(int yr, int mon, int da, int hr, int min, int sec){
    float J2000 = J2000DaysFromUTCTime(yr, mon, da, hr, min, sec);
    float d = J2000;  // d represents (d - delta/173)
    
    // JUPITER numbers
    float V = 172.74 + 0.00111588 * d;
    float M = 357.529 + 0.9856003 * d;
    float N = 20.020 + 0.0830853 * d + 0.329 * sin(V*D2R);
    float J = 66.115 + 0.9025179 * d - 0.329 * sin(V*D2R);
    float A = 1.915 * sin(M*D2R) + 0.020 * sin(2*M*D2R);
    float B = 5.555 * sin(N*D2R) + 0.168 * sin(2*N*D2R);
    float K = J + A - B;
    float R = 1.00014 - 0.01671 * cos(M*D2R) - 0.00014 * cos(2*M*D2R);
    float r = 5.20872 - 0.25208 * cos(N*D2R) - 0.00611 * cos(2*N*D2R);
    float delta = sqrt(pow(r,2) + pow(R,2) - 2*r*R*cos(K*D2R));
    float psi = asin(R/delta*sin(K*D2R)) / D2R;
    float lamda = 34.35 + 0.083091*d + 0.329*sin(V*D2R) + B;
    float Ds = 3.12 * sin( (lamda+42.8)*D2R );
    float De = Ds - 2.22 * sin(psi*D2R) * cos( (lamda+22)*D2R ) - 1.30 * (r-delta)/delta * sin( (lamda - 100.5)*D2R ); 
  
    // MOON numbers
    float[] u = new float[4];
    u[0] = 163.8069 + 203.4058646 * d + psi - B;
    u[1] = 358.4140 + 101.2916335 * d + psi - B;
    u[2] = 5.7176 + 50.2345180 * d + psi - B;
    u[3] = 224.8092 + 21.4879800 * d + psi - B;
    float G = 331.18 + 50.310482 * d;
    float H = 87.45 + 21.569231 * d;
    float[] correction = new float[4];
    correction[0] = 0.472 * sin((u[0] - u[1])*D2R)*2;
    correction[1] = 1.065 * sin((u[1] - u[2])*D2R)*2;
    correction[2] = 0.165 * sin(G*D2R);
    correction[3] = 0.843 * sin(H*D2R);
    float[] radius = new float[4];
    radius[0] = 5.9057 - 0.0244 * cos((u[0] - u[1])*D2R)*2;
    radius[1] = 9.3966 - 0.0882 * cos((u[1] - u[2])*D2R)*2;
    radius[2] = 14.9883 - 0.0216 * cos(G*D2R);
    radius[3] = 26.3627 - 0.1939 * cos(H*D2R);
    for(int i = 0; i < 4; i++){
      u[i] += correction[i];
    }
    for(int i = 0; i < 4; i++){
      x[i] = -radius[i] * sin(u[i]*D2R);
      y[i] = radius[i] * cos(u[i]*D2R)*sin(De*D2R);
    }  
  }
}