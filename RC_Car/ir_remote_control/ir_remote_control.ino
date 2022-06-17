/*
 * RC카 아두이노 소스코드 (IR 리모컨 + 라인트레이서)
 */

#include <IRremote.h>

// IR 리모컨
IRrecv irrecv(A0);
decode_results receive;

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

// 작동모드
enum MODE {
  MODE_MANUAL,
  MODE_LINE_TRACER,
};

// 작동모드
int Mode = MODE_MANUAL;

// 라인 트레이서 센서 바닥감지 기준 값
const int SENSOR_VAL = 100;

// 라인 트레이서 센서 감지 여부
bool LineLeft = false;
bool LineMiddle = false;
bool LineRight = false;

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

/*
 * 함수 원형 정의
 */
void ModeToggle();
void LineTracer();
void ManualControl();
void GetLineSensor();
void Movement(float, int = 0, DIR = FORWARD);

/*
 * 아두이노 작동 후 최초 1회 실행
 */
void setup() {
  Serial.begin(9500);
  Serial.println("--------------START--------------");

  irrecv.enableIRIn();

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
  ManualControl();

  if (Mode == MODE_LINE_TRACER) {
    LineTracer();
  }
}

/*
 * 모드 변경
 */
void ModeToggle() {
  if (Mode == MODE_MANUAL)
    Mode = MODE_LINE_TRACER;
  else
    Mode = MODE_MANUAL;
}

/*
 * 라인트레이싱 함수
 */
void LineTracer() {
  GetLineSensor();

  if (LineLeft && LineRight) {
    Serial.println("Stop");
    Movement(0, 1000);
    
  } else if (LineLeft && !LineRight) {
    Serial.println("Turn left");
    Movement(0, 100);
    Movement(SpeedHigh, 500, LEFT);
    
  } else if (!LineLeft && LineRight) {
    Serial.println("Turn right");
    Movement(0, 100);
    Movement(SpeedHigh, 500, RIGHT);
        
  } else {
    Serial.println("forward");
    Movement(SpeedNormal, 50);
  }
}

/*
 * 수동 조작 함수 (IR Remote)
 */
void ManualControl() {
  if (!irrecv.decode(&receive)) {
    Movement(0);
    return;
  }

  if (receive.value == IR_CHANNEL) {
    Serial.println("channel");
    ModeToggle();
    Movement(0);
  }

  if (Mode == MODE_MANUAL) {
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
  }
  
  irrecv.resume();
  delay(200); // 연속적으로 들어오는 신호 대기 (0.2 초)
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

  if (dir == FORWARD || dir == BACKWARD) {
    analogWrite(RightMotor_E_pin, speed);
    analogWrite(LeftMotor_E_pin, speed <= 0 ? 0 : speed+85);    
  } else {
    analogWrite(RightMotor_E_pin, speed);
    analogWrite(LeftMotor_E_pin, speed);
  }

  delay(delay_time);
}
