import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useGroupContext } from '../contexts/GroupContext';
import { router } from 'expo-router';
import { use } from 'react';

export default function groupScreen() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');

    const {createGroup, loading, error} = useGroupContext();

    const handleCreateGroup = async () =>{
        if(!groupName.trim()){
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        try{
            const result = await createGroup(groupName, description);
            router.replace('/viewGroup');

            setGroupName('');
            setDescription('');
        }catch(error){
            console.log("Error. Failed to create group", error);
        }
    };

    //TO BE DONE
    return(
        <Text>Testing</Text>
    )
};