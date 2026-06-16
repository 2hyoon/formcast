export interface Preset {
  name: string; // 버튼에 표시할 이름 (예: "회원가입")
  schema: string; // JSON Schema 문자열 (들여쓰기된, 사람이 읽기 좋은 형태)
}

export const presets: Preset[] = [
  {
    name: "회원가입",
    schema: `{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "title": "이메일",
      "description": "로그인에 사용할 이메일 주소",
      "pattern": "^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$"
    },
    "password": {
      "type": "string",
      "title": "비밀번호",
      "description": "8자 이상 20자 이하",
      "minLength": 8,
      "maxLength": 20
    },
    "newsletter": {
      "type": "boolean",
      "title": "뉴스레터 수신 동의"
    }
  },
  "required": ["email", "password"]
}`,
  },
  {
    name: "설문",
    schema: `{
  "type": "object",
  "properties": {
    "age": {
      "type": "number",
      "title": "나이",
      "description": "0세 이상 120세 이하",
      "minimum": 0,
      "maximum": 120
    },
    "satisfaction": {
      "type": "string",
      "title": "만족도",
      "description": "서비스에 대한 전반적인 만족도",
      "enum": ["매우 불만족", "불만족", "보통", "만족", "매우 만족"]
    },
    "comment": {
      "type": "string",
      "title": "의견",
      "description": "자유롭게 작성해 주세요",
      "maxLength": 200
    }
  },
  "required": ["satisfaction"]
}`,
  },
  {
    name: "배송정보",
    schema: `{
  "type": "object",
  "properties": {
    "recipient": {
      "type": "string",
      "title": "받는 사람",
      "minLength": 2
    },
    "phone": {
      "type": "string",
      "title": "연락처",
      "description": "010-1234-5678 형식",
      "pattern": "^01[0-9]-\\\\d{3,4}-\\\\d{4}$"
    },
    "method": {
      "type": "string",
      "title": "배송 방법",
      "enum": ["일반", "빠른배송", "새벽배송"]
    },
    "giftWrap": {
      "type": "boolean",
      "title": "선물 포장"
    }
  },
  "required": ["recipient", "phone", "method"]
}`,
  },
];
