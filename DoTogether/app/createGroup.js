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
            router.push(`/viewGroup?groupId=${result.groupId}&groupName=${result.name}`);

            setGroupName('');
            setDescription('');
        }catch(error){
            console.log("Error. Failed to create group", error);
        }
    };

    const handleCancel = () =>{
        router.back();
    };
    
    return(
        <SafeAreaView style={StyleSheet.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create a New Group</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Group Name</Text>
                        <TextInput
                            style={styles.input}
                            value={groupName}
                            onChangeText={setGroupName}
                            placeholder='Enter group name'
                            placeholderTextColor='#888'
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder='Enter group description'
                            placeholderTextColor='#888'
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.createButton, loading && styles.disabledButton]}
                            onPress={handleCreateGroup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ):(
                                <Text style={styles.buttonText}>Create Group</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

});