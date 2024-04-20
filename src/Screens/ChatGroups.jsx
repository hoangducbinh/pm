import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ChatGroups = () => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Project')
      .onSnapshot(snapshot => {
        const projectList = [];
        snapshot.forEach(doc => {
          projectList.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectList);
      });
    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const handleChatButtonPress = async (projectId) => {
    const groupChatRef = await firestore().collection('GroupChats').where('projectId', '==', projectId).get();
    if (groupChatRef.empty) {
      const projectRef = await firestore().collection('Project').doc(projectId).get();
      const projectData = projectRef.data();
      if (!projectData) {
        console.error(`Project with ID ${projectId} does not exist`);
        return;
      }

      const newGroupChatRef = await firestore().collection('GroupChats').add({
        projectId: projectId,
      });

      const membersSnapshot = await firestore().collection('Project').doc(projectId).collection('Member_PJ').get();
      const members = membersSnapshot.docs.map(doc => doc.data());

      members.forEach(member => {
        newGroupChatRef.collection('Members').add(member);
      });

      navigation.navigate('Chats', { groupId: newGroupChatRef.id });
    } else {
      navigation.navigate('Chats', { groupId: groupChatRef.docs[0].id });
    }
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity style={styles.projectItem} onPress={() => handleChatButtonPress(item.id)}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.Project_name}</Text>
        <Text style={styles.date}>Start day: {item.Start_day.toDate().toDateString()}</Text>
        <Text style={styles.date}>End day: {item.End_day.toDate().toDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.container}
      data={projects}
      renderItem={renderProjectItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  projectItem: {
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2, // Tạo hiệu ứng nổi bật
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  date: {
    color: '#999',
  },
});

export default ChatGroups;
