// constants
int echoPin = 5;
int trigPin = 3;
int trigPin2 = 10;
int echoPin2 = 9;


int distance;
int distance2; 

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
    pinMode(trigPin2, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin2, INPUT); // Sets the echoPin as an Input
}

void loop() {
  // -- first ultrasonic sensor --- // 
  digitalWrite(trigPin, HIGH); // send out the ultrasonic wave
  delayMicroseconds(10); // wait 10 microseconds
  digitalWrite(trigPin, LOW); // turn the ultrasonic wave off
  distance = pulseIn(echoPin, HIGH);
  distance = constrain(distance, 150, 1400);


  // -- first ultrasonic sensor --- // 
  digitalWrite(trigPin2, HIGH); // send out the ultrasonic wave
  delayMicroseconds(10); // wait 10 microseconds
  digitalWrite(trigPin2, LOW); // turn the ultrasonic wave off
  distance2 = pulseIn(echoPin2, HIGH);
  distance2 = constrain(distance2, 150, 1400);


// store data into constructed array and sent to serial. 
  Serial.print("[");
  Serial.print(distance);
  Serial.print(",");
  Serial.print(distance2);
  Serial.println("]");
  delay(10);

}
