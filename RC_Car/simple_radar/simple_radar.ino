/*
 * RC카 아두이노 소스코드 (간단한 미로 탈출)
 */

#include <Servo.h>
Servo myservo;

// 초음파 센서
const int trigPin = 13;
const int echoPin = 12;

// 기준 거리
const int min_distance = 150;

// DC 모터 속도
const int SpeedNormal = 120;
const int SpeedHigh = 200;

// DC 모터 조작용 핀 번호
const int RightMotor_E_pin = 5;
const int RightMotor_1_pin = 8;
const int RightMotor_2_pin = 9;
const int LeftMotor_3_pin = 10;
const int LeftMotor_4_pin = 11;
const int LeftMotor_E_pin = 6;

// DC 모터 방향
enum DIR {
  FORWARD = 10,  // 0101
  BACKWARD = 5,  // 1010
  LEFT = 6,      // 0110
  RIGHT = 9      // 1001
};

/*
 * 함수 원형 정의
 */
long GetDistance();
void Movement(float, int = 0, DIR = FORWARD);

/*
 * 아두이노 작동 후 최초 1회 실행
 */
void setup() {
  Serial.begin(9500);
  Serial.println("--------------START--------------");

  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);
 
  myservo.attach(2);
  myservo.write(90);

  pinMode(RightMotor_E_pin, OUTPUT);
  pinMode(RightMotor_1_pin, OUTPUT);
  pinMode(RightMotor_2_pin, OUTPUT);
  pinMode(LeftMotor_3_pin, OUTPUT);
  pinMode(LeftMotor_4_pin, OUTPUT);
  pinMode(LeftMotor_E_pin, OUTPUT);
}

/*
 * 계속 반복해서 실행
 */
void loop() {
  // 오른쪽 방향 확인
  for (int i = 150; i >= 30; i --) {
    myservo.write(i);
    delay(10);
  }
  long right = GetDistance();

  // 가운데 방향 확인
  for (int i = 30; i < 90; i ++) {
    myservo.write(i);
    delay(10);
  }

  long center = GetDistance();

  // 왼쪽 방향 확인
  for (int i = 90; i < 150; i ++) {
    myservo.write(i);
    delay(10);
  }
  long left = GetDistance();

  // 거리 출력
  Serial.print("Distance: ");
  Serial.print(left);
  Serial.print(", ");
  Serial.print(center);
  Serial.print(", ");
  Serial.println(right);

  if (left < 1 && center < 1 && right < 1) {
    Movement(SpeedNormal, 100, BACKWARD);
    Movement(0, 100);
    
  } else if (left < min_distance && center < min_distance && right < min_distance) {
    Serial.println("Backward");
    Movement(SpeedHigh, 1000, BACKWARD);
    Movement(0, 100);
    
  } else if (center < min_distance && right < min_distance) {
    Serial.println("Turn Left");
    Movement(SpeedHigh, 900, LEFT);
    Movement(0, 100);
    
  } else if (center < min_distance) {
    
    Serial.println("Turn Right");
    Movement(SpeedHigh, 900, RIGHT);
    Movement(0, 100);
    
  } else {
    Movement(SpeedNormal, 500, FORWARD);
    Movement(0, 100);
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
 * 이동하는 함수
 * speed : 속도 (0 - 정지)
 * delay_time : 이동시간 (1000 - 1초)
 * dir : 이동 방향
 */
void Movement(float speed, int delay_time = 0, DIR dir = FORWARD) {
  if (speed < 0) speed = 0;
  
  digitalWrite(RightMotor_1_pin, dir & 1);
  digitalWrite(RightMotor_2_pin, dir & 2);
  digitalWrite(LeftMotor_3_pin, dir & 4);
  digitalWrite(LeftMotor_4_pin, dir & 8);

  if (dir == FORWARD || dir == BACKWARD) {
    analogWrite(RightMotor_E_pin, speed);
    analogWrite(LeftMotor_E_pin, speed <= 0 ? 0 : speed+85);    
  } else {
    analogWrite(RightMotor_E_pin, speed);
    analogWrite(LeftMotor_E_pin, speed);
  }

  delay(delay_time);
}
