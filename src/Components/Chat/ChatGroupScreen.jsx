import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Keyboard } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';


const ChatGroupScreen = ({ route }) => {
  const { groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('GroupChats')
      .doc(groupId)
      .collection('Messages')
      .orderBy('createdAt', 'desc') // Sắp xếp theo thời gian tạo giảm dần
      .onSnapshot(snapshot => {
        const messageList = [];
        snapshot.forEach(doc => {
          messageList.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messageList);
      });
    return () => unsubscribe();
  }, [groupId]);


  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    Keyboard.dismiss(); // Ẩn bàn phím
    // Xóa nội dung tin nhắn sau khi gửi
    setNewMessage('');
    try {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('Error sending message: User is not logged in');
        return;
      }
      
      // Lấy thông tin của người gửi
      const senderSnapshot = await firestore().collection('Member').doc(currentUser.uid).get();
      const senderData = senderSnapshot.data();
      const senderName = senderData ? senderData.Name : "Unknown";
  
      // Đảm bảo rằng senderId và senderName có giá trị
      if (!currentUser.uid || !senderName) {
        console.error('Error sending message: Sender information is undefined');
        return;
      }
      // Thêm tin nhắn vào Firestore
      await firestore().collection('GroupChats').doc(groupId).collection('Messages').add({
        text: newMessage,
        createdAt: firestore.FieldValue.serverTimestamp(),
        senderId: currentUser.uid,
        senderName: senderName,
      });
      
      
      
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };
  


  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.senderId === firebase.auth().currentUser.uid;
    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {!isMyMessage && <Image style={styles.avatar} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtajIEIEWD4IRO96S1qflyEjySsZxXi7VxLdAdrmVWEA&s' }} />}
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageTime}>{formatMessageTime(item.createdAt)}</Text>
            <Text style={styles.messageSender}>{item.senderName}</Text>
          </View>
          <View style={[styles.message, isMyMessage ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
        {isMyMessage && <Image style={styles.avatar} source={{ uri: 'https://technewsdaily.vn/uploads/2023/01/20/f-14.jpg' }} />}
      </View>
    );
  };


  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted={true} // Đảo ngược danh sách để hiển thị tin nhắn mới nhất ở đầu
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    marginLeft: 10,
    marginRight: 10,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  message: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#4caf50',
  },
  myMessage: {
    backgroundColor: '#2196f3',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageSender: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 5
  },
  messageTime: {
    color: '#ccc',
    fontSize: 12,
    
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});


export default ChatGroupScreen;
