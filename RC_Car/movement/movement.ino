/*
 * RC카 아두이노 소스코드 2
 *
 * 앞으로 계속 이동하다가 초음파 센서를 이용해서 로봇앞에 물체가 감지되면,
 * 뒤로 회전해서 왔던 길을 돌아간 다음 멈추는 코드.
 */

#include <Servo.h>
Servo myservo;

const int trigPin = 13;
const int echoPin = 12;

const int RightMotor_E_pin = 5;
const int RightMotor_1_pin = 8;
const int RightMotor_2_pin = 9;
const int LeftMotor_3_pin = 10;
const int LeftMotor_4_pin = 11;
const int LeftMotor_E_pin = 6;

const int E_carSpeed = 150;

int distance = 0;
bool isCollision = false;

void setup() {
  Serial.begin(9600);
  
  myservo.attach(2);
  myservo.write(90);
  
  pinMode(RightMotor_E_pin, OUTPUT);
  pinMode(RightMotor_1_pin, OUTPUT);
  pinMode(RightMotor_2_pin, OUTPUT);
  pinMode(LeftMotor_3_pin, OUTPUT);
  pinMode(LeftMotor_4_pin, OUTPUT);
  pinMode(LeftMotor_E_pin, OUTPUT);

  SmartCar_Forward();
}

void loop() {
  if (isCollision) {
    if (distance > 0) {
      distance --;
    } else {
      Stop();
      return;
    }
  } else {
   distance ++;
  }

  Forward();
  
  long distance = GetDistance();
  Serial.println(distance);
  
  if (distance <= 100) {
    isCollision = true;
    Stop();
    delay(1000);
    
    SmartCar_Left();
    Forward();
    delay(1500);
    
  } else {
    SmartCar_Forward();
  }
}

/*
 * 초음파 센서 거리 측정하기
 */
long GetDistance() {
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  long distance = ((float)(340 * duration) / 1000) / 2;
  
  return distance;
}

/*
 * 정지하는 함수
 */
void Stop() {
  digitalWrite(RightMotor_E_pin, LOW);
  digitalWrite(LeftMotor_E_pin, LOW);
}

/*
 * 앞으로 이동하는 함수
 */
void Forward() {
  analogWrite(RightMotor_E_pin, E_carSpeed);
  analogWrite(LeftMotor_E_pin, E_carSpeed);
}

/*
 * 모터 드라이버를 정방향(앞으로) 설정하는 함수
 */
void SmartCar_Forward() {
  Serial.println("Forward");
  
  digitalWrite(RightMotor_1_pin, LOW);
  digitalWrite(RightMotor_2_pin, HIGH);
  digitalWrite(LeftMotor_3_pin, LOW);
  digitalWrite(LeftMotor_4_pin, HIGH);
}

/*
 * 모터 드라이버를 역방향(뒤로) 설정하는 함수
 */
void SmartCar_Back() {
  Serial.println("Backward");
  
  digitalWrite(RightMotor_1_pin, HIGH);
  digitalWrite(RightMotor_2_pin, LOW);
  digitalWrite(LeftMotor_3_pin, HIGH);
  digitalWrite(LeftMotor_4_pin, LOW);
}

/*
 * 왼쪽으로 회전하는 함수 
 */
void SmartCar_Left() {
  Serial.println("Left");

  digitalWrite(RightMotor_1_pin, LOW);
  digitalWrite(RightMotor_2_pin, HIGH);
  digitalWrite(LeftMotor_3_pin, HIGH);
  digitalWrite(LeftMotor_4_pin, LOW);
}

/*
 * 오른쪽으로 회전하는 함수
 */
void SmartCar_Right() {
  Serial.println("Right");

  digitalWrite(RightMotor_1_pin, HIGH);
  digitalWrite(RightMotor_2_pin, LOW);
  digitalWrite(LeftMotor_3_pin, LOW);
  digitalWrite(LeftMotor_4_pin, HIGH);
}
