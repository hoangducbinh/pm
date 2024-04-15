import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const ProjectScreen = () => {
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
    // Kiểm tra xem nhóm chat đã tồn tại chưa
    const groupChatRef = await firestore().collection('GroupChats').where('projectId', '==', projectId).get();
   
    if (groupChatRef.empty) {
      // Nếu nhóm chat chưa tồn tại, tạo một nhóm chat mới
      const projectRef = await firestore().collection('Project').doc(projectId).get();
      const projectData = projectRef.data();
     
      if (!projectData) {
        console.error(`Project with ID ${projectId} does not exist`);
        return;
      }


      // Tạo nhóm chat mới và thêm các thành viên vào nhóm đó
      const newGroupChatRef = await firestore().collection('GroupChats').add({
        projectId: projectId,
      });


      const membersSnapshot = await firestore().collection('Project').doc(projectId).collection('Member_PJ').get();
      const members = membersSnapshot.docs.map(doc => doc.data());


      members.forEach(member => {
        newGroupChatRef.collection('Members').add(member);
      });


      // Chuyển hướng sang màn hình trò chuyện nhóm với ID của nhóm chat mới
      navigation.navigate('ChatGroup', { groupId: newGroupChatRef.id });
    } else {
      // Nếu nhóm chat đã tồn tại, chuyển hướng người dùng sang màn hình trò chuyện nhóm với ID của nhóm chat
      navigation.navigate('ChatGroup', { groupId: groupChatRef.docs[0].id });
    }
  };


  const renderProjectItem = ({ item }) => (
    <TouchableOpacity style={styles.projectItem} onPress={() => handleProjectPress(item.id)}>
      <Text style={styles.projectName}>{item.Project_name}</Text>
      <Text>{item.Description}</Text>
      <Text>Start day: {item.Start_day.toDate().toDateString()}</Text>
      <Text>End day: {item.End_day.toDate().toDateString()}</Text>
      <Button title="Chat" onPress={() => handleChatButtonPress(item.id)} />
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  projectItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});


export default ProjectScreen;
