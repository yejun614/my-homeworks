/*
 * RC카 아두이노 소스코드 (기말 테스트)
 */

#include <IRremote.h>
#include <Servo.h>
#include <SoftwareSerial.h>

#define BT_TXD 3
#define BT_RXD 4

// 블루투스 모듈 소프트웨어 시리얼 객체
SoftwareSerial ble(BT_RXD, BT_TXD);
// 서보모터 객체
Servo myservo;
// IR Remote 객체
IRrecv irrecv(A0);
// IR Remote 데이터 수신 값
decode_results receive;

// 초음파 센서
const int trigPin = 13;
const int echoPin = 12;

// 기준 거리
const int min_distance = 100;

// DC 모터 방향
enum DIR {
  FORWARD = 10,  // 0101
  BACKWARD = 5,  // 1010
  LEFT = 6,      // 0110
  RIGHT = 9      // 1001
};

// IR 리모컨 버튼
enum REMOTE {
  IR_TOP = 16718055,
  IR_BOTTOM = 16730805,
  IR_LEFT = 16716015,
  IR_RIGHT = 16734885,
  IR_STOP = 16726215,
  IR_CHANNEL = 16736925,
  IR_END = 4294967295,
};

// 모드 변경
int Mode = 0;

// 라인 트레이서 센서 바닥감지 기준 값
const int SENSOR_VAL = 100;

// 라인 트레이서 센서 감지 여부
bool LineLeft = false;
bool LineMiddle = false;
bool LineRight = false;

// DC 모터 속도
const int SpeedNormal = 100;
const int SpeedHigh = 180;

// 모터 오차 적용
const int LeftMotor_Error = 100;
const int RightMotor_Error = 0;

// DC 모터 조작용 핀 번호
const int RightMotor_E_pin = 5;
const int RightMotor_1_pin = 8;
const int RightMotor_2_pin = 9;
const int LeftMotor_3_pin = 10;
const int LeftMotor_4_pin = 11;
const int LeftMotor_E_pin = 6;

/*
 * 함수 원형 정의
 */
void ModeToggle();
void LineTracer();
void IRManualControl();
void SimpleRadar();
void GetLineSensor();
long GetDistance();
void Movement(float, int = 0, DIR = FORWARD);

/*
 * 아두이노 작동 후 최초 1회 실행
 */
void setup() {
  // 시리얼 통신 설정
  Serial.begin(9500);
  Serial.println("--------------START--------------");

  // 블루투스 모듈 설정
  ble.begin(9600);

  // 초음파 센서 설정
  pinMode(echoPin, INPUT);
  pinMode(trigPin, OUTPUT);

  // 초음파 센서 조작용 서보모터 설정
  myservo.attach(2);
  myservo.write(90);

  // IRRemote 센서 설정
  irrecv.enableIRIn();

  // 라인트레이서 센서 설정
  pinMode(A3, INPUT);
  pinMode(A4, INPUT);
  pinMode(A5, INPUT);

  // 모터(바퀴) 설정
  pinMode(RightMotor_E_pin, OUTPUT);
  pinMode(RightMotor_1_pin, OUTPUT);
  pinMode(RightMotor_2_pin, OUTPUT);
  pinMode(LeftMotor_3_pin, OUTPUT);
  pinMode(LeftMotor_4_pin, OUTPUT);
  pinMode(LeftMotor_E_pin, OUTPUT);

  /*
  Serial.println("Turn Right");
  Movement(SpeedHigh, 560, RIGHT);
  Movement(0, 1000);

  Serial.println("Turn Left");
  Movement(SpeedHigh, 470, LEFT);
  Movement(0, 500);
  */
}

/*
 * 계속 반복해서 실행
 */
void loop() {
  BLEControl();
  if (Mode % 5 == 1) SimpleRadar();
  if (Mode % 5 == 2) IRManualControl();
  if (Mode % 5 == 4) LineTracer();
}

/*
 * 라인트레이싱 함수
 */
void LineTracer() {
  GetLineSensor();

  Serial.print("LINE: ");

  if (LineLeft && LineRight) {
    Serial.println("Stop");
    Movement(0, 1000);
    
  } else if (LineLeft && !LineRight) {
    Serial.println("Turn left");
    Movement(0, 100);
    Movement(230, 200, LEFT);
    
  } else if (!LineLeft && LineRight) {
    Serial.println("Turn right");
    Movement(0, 100);
    Movement(230, 230, RIGHT);
        
  } else {
    Serial.println("Forward");
    Movement(230, 50);
  }
}

/*
 * 수동 조작 함수 (IR Remote)
 */
void IRManualControl() {
  if (!irrecv.decode(&receive)) {
    Movement(0);
    return;
  }

  switch (receive.value) {
  case IR_TOP:
    Serial.println("top");
    Movement(SpeedNormal, 100, FORWARD);
    break;
    
  case IR_LEFT:
    Serial.println("left");
    Movement(SpeedHigh, 0, LEFT);
    break;
    
  case IR_RIGHT:
    Serial.println("right");
    Movement(SpeedHigh, 0, RIGHT);
    break;
    
  case IR_BOTTOM:
    Serial.println("bottom");
    Movement(SpeedNormal, 0, BACKWARD);
    break;
    
  case IR_STOP:
    Serial.println("stop");
    Movement(0);
    break;
  }

  IrReceiver.resume();
  delay(150); // 연속적으로 들어오는 신호 대기 (0.15 초)
              // 리모컨 연속 수신 안되면 0.2초 대기로 변경할 것.
}

void BLEControl() {
  if (!ble.available()) {
    return;
  }

  int input = ble.read();

  switch (input) {
  case '3':
    Serial.println("left");
    Movement(SpeedHigh, 0, LEFT);
    break;

  case '4':
    Serial.println("right");
    Movement(SpeedHigh, 0, RIGHT);
    break;

  case '2':
    Serial.println("bottom");
    Movement(SpeedNormal, 0, BACKWARD);
    break;

  case '1':
    Serial.println("top");
    Movement(SpeedNormal, 0, FORWARD);
    break;

  case 'a':
    Serial.print("CHANNEL:");
    Mode = 0;
    Serial.println(Mode);
    break;

  case 'c':
    Serial.print("CHANNEL:");
    Mode = Mode >= 4 ? 4 : Mode + 1;
    Serial.println(Mode);
    break;

  case 'd':
    Serial.println("stop");
    Movement(0);
    break;
  }
}

void SimpleRadar() {
  myservo.write(90);
  long d = GetDistance();
  //Serial.println(d);
  delay(50);
  if (d >= 100) {
    Movement(SpeedNormal, 0, FORWARD);
    return;
  }

  Movement(0, 500);
  
  // 오른쪽 방향 확인
  for (int i = 150; i >= 30; i --) {
    myservo.write(i);
    delay(5);
  }
  long right = GetDistance();

  // 가운데 방향 확인
  for (int i = 30; i < 90; i ++) {
    myservo.write(i);
    delay(5);
  }

  long center = GetDistance();

  // 왼쪽 방향 확인
  for (int i = 90; i < 150; i ++) {
    myservo.write(i);
    delay(5);
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
    Serial.println("Backward 1");
    Movement(SpeedNormal, 100, BACKWARD);
    Movement(0, 100);
    
  } else if (left < min_distance && center < min_distance && right < min_distance) {
    Serial.println("Backward 2");
    Movement(SpeedHigh, 500, BACKWARD);
    Movement(0, 100);
    
  } else if (center < min_distance && right < min_distance) {
    Serial.println("Turn Left");
    Movement(SpeedHigh, 500, LEFT);
    Movement(0, 100);
    
  } else if (center < min_distance) {
    
    Serial.println("Turn Right");
    Movement(SpeedHigh, 700, RIGHT);
    Movement(0, 100);
    
  } else {
    Serial.println("Forward");
    Movement(SpeedNormal, 600, FORWARD);
    Movement(0, 100);
  }
}

/*
 * 라인트레이서 센서 값 읽어오는 함수 
 */
void GetLineSensor() {
  LineLeft = analogRead(A5) > SENSOR_VAL;
  LineMiddle = analogRead(A4) > SENSOR_VAL;
  LineRight = analogRead(A3) > SENSOR_VAL;
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

  if (dir == FORWARD) {
    analogWrite(RightMotor_E_pin, speed <= 0 ? 0 : speed+RightMotor_Error);
    analogWrite(LeftMotor_E_pin, speed <= 0 ? 0 : speed+LeftMotor_Error);
  } else if (dir == BACKWARD) {
    analogWrite(RightMotor_E_pin, speed <= 0 ? 0 : speed+LeftMotor_Error);
    analogWrite(LeftMotor_E_pin, speed <= 0 ? 0 : speed+RightMotor_Error+60);
  } else {
    analogWrite(RightMotor_E_pin, speed);
    analogWrite(LeftMotor_E_pin, speed);
  }

  delay(delay_time);
}
