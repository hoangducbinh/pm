import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Modal, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/FontAwesome';
import Emoji from 'react-native-vector-icons/Entypo';
import EmojiSelector from 'react-native-emoji-selector';

const Chats = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('GroupChats')
      .doc(groupId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
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
    Keyboard.dismiss();
    setNewMessage('');
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('Error sending message: User is not logged in');
        return;
      }
      const senderSnapshot = await firestore().collection('Member').doc(currentUser.uid).get();
      const senderData = senderSnapshot.data();
      const senderName = senderData ? senderData.Name : "Unknown";
  
      if (!currentUser.uid || !senderName) {
        console.error('Error sending message: Sender information is undefined');
        return;
      }
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
  
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji);
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  const handleEmojiPickerCancel = () => {
    setShowEmojiPicker(false); // Close emoji picker without selecting any emoji
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#007bff" />
      </TouchableOpacity>
      <Text style={styles.title}>Group Chat</Text>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
         <TouchableOpacity style={styles.emojiButton} onPress={() => setShowEmojiPicker(true)}>
          <Emoji name="emoji-happy" size={15} color="#007bff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
       
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={20} color="#007bff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Modal
        visible={showEmojiPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
        <TouchableOpacity onPress={handleEmojiPickerCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          <View style={styles.modalContent}>
          
            <EmojiSelector onEmojiSelected={handleEmojiSelect} />
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  messageList: {
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
  emojiButton: {
    marginRight: 10,
  },
  sendButton: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: Dimensions.get('window').height * 0.5, // Set modal height to half the screen height
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Chats;
