import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const token = localStorage.getItem('token');
const client = new Client({
  brokerURL: `http://localhost:3000/ws?token=${token}`, // WebSocket endpoint từ backend
  connectHeaders: {
    Authorization: 'Bearer ' + localStorage.getItem('token'), // Gửi JWT nếu cần
  },
  debug: function (str) {
    console.log(str);
  },
  reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây
  webSocketFactory: () =>
    new SockJS(`http://localhost:3000/ws?token=${token}`, null, {
      withCredentials: true, // Cho phép gửi thông tin xác thực (cookies hoặc headers)
    }),
});

// Kết nối thành công
client.onConnect = () => {
  console.log('Connected to WebSocket');

  client.publish({
    destination: '/app/authenticate',
    body: JSON.stringify({ token }), // Token được gửi thông qua tin nhắn sau khi kết nối
  });

  // Subscribe để nhận tin nhắn từ backend
  client.subscribe('/user/queue/messages', (message) => {
    console.log('Received message:', JSON.parse(message.body));
  });
};

// Kết nối lỗi
client.onStompError = (frame) => {
  console.error('Broker reported error:', frame.headers['message']);
  console.error('Additional details:', frame.body);
};

// Kích hoạt WebSocket client
client.activate();


// Kết nối và subscribe
export function connectToSocket(onMessageReceived) {
    client.onConnect = () => {
      console.log('Connected to STOMP');
  
      // Subcribe đến tin nhắn nhận được
      client.subscribe('/user/queue/messages', (message) => {
        const data = JSON.parse(message.body);
        // console.log("ảo quá bay ơi")
        console.log('Tin nhắn mới:', data);
        onMessageReceived(data);
      });
    };
  
    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
    };
  
    client.activate();
  }


// Gửi tin nhắn
export function createNewMessage(content, recipientId) {
  client.publish({
    destination: '/app/chat', // Gửi tới backend theo prefix /app
    body: JSON.stringify({ content, recipientId }),
  });
}
