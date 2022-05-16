/*
 * RC카 아두이노 소스코드 (라인 트레이서)
 */

// 라인 트레이서 센서 바닥감지 기준 값
const int SENSOR_VAL = 100;

// 라인 트레이서 센서 감지 여부
bool LineLeft = false;
bool LineMiddle = false;
bool LineRight = false;

// DC 모터 조작용 핀 번호
const int RightMotor_E_pin = 5;
const int RightMotor_1_pin = 8;
const int RightMotor_2_pin = 9;
const int LeftMotor_3_pin = 10;
const int LeftMotor_4_pin = 11;
const int LeftMotor_E_pin = 6;

// DC 모터 속도
const int SpeedNomal = 120;
const int SpeedHigh = 200;

// DC 모터 방향
enum DIR {
  FORWARD = 10,
  BACKWARD = 5,
  LEFT = 6,
  RIGHT = 9
};

/*
 * 함수 원형 정의
 */
void GetLineSensor();
void Movement(float, int = 0, DIR = FORWARD);

/*
 * 아두이노 작동 후 최초 1회 실행
 */
void setup() {
  Serial.begin(9500);
  
  pinMode(A3, INPUT);
  pinMode(A4, INPUT);
  pinMode(A5, INPUT);
  
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
  GetLineSensor();

  if (LineLeft && LineMiddle && LineRight) {
    Serial.println("Stop");
    Movement(0, 1000);
    
  } else if (LineLeft) {
    Serial.println("Turn left");
    
    Movement(0, 100);
    Movement(SpeedHigh, 500, LEFT);
    
  } else if (LineRight) {
    Serial.println("Turn right");

    Movement(0, 100);
    Movement(SpeedHigh, 500, RIGHT);
        
  } else {
    Movement(SpeedNomal);
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

  analogWrite(RightMotor_E_pin, speed);
  analogWrite(LeftMotor_E_pin, speed);

  delay(delay_time);
}
