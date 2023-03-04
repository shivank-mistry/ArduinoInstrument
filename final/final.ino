// constants
int speaker = 9;
int echoPin = 5;
int trigPin = 3;
int distance;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(trigPin, HIGH); // send out the ultrasonic wave
  delayMicroseconds(10); // wait 10 microseconds
  digitalWrite(trigPin, LOW); // turn the ultrasonic wave off
  distance = pulseIn(echoPin, HIGH);
  distance = constrain(distance, 200, 2000);

  Serial.print("[");
  Serial.print(distance);
  Serial.print(",");
  Serial.print(1);
  Serial.println("]");
}
