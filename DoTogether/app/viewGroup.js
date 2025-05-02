import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Share, Alert, ActivityIndicator, FlatList} from 'react-native';
import { useGroupContext } from "../contexts/GroupContext";
import * as FirestoreService from '../hooks/useFirestore';
import {auth} from '../firebaseConfig';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

export default function viewGroup (){
    const { groupId, groupName} = useLocalSearchParams();
    const { leaveGroup, loading, error} = useGroupContext();

    const [groupDetails, setGroupDetails] = useState(null);
    const [members, setMembers] = useState([]);
    const [ activity, setActivity] = useState([]); //MAY NEED TO CHANGE
    const [loadingData, setLoadingData] = useState(true);

    //Current user id
    const currentUserId = auth.currentUser?.uid;

    //Check if the user is the creater of the group
    const isCreator = groupDetails?.createdBy === currentUserId;

    useEffect(()=>{
        const fetchGroupDetails = async () =>{
            setLoadingData(true);
            try{
                const group = await FirestoreService.fetchGroupById(groupId);
                setGroupDetails(group);

                //Fetch member details
                const memberDetails = await Promise.all(
                    (group.members || []).map(async(memberId) =>{
                        try{
                            const user = await FirestoreService.fetchUserById(memberId);
                            return { id: memberId, name: user?.name || 'Unknown User'};
                        }catch(error){
                            console.log("Error fetching member", error);
                            return {id: memberId, name: 'Unknown User'};
                        }
                    })
                );
                setMembers(memberDetails);

                const fetchActivities = await FirestoreService.fetchActivitiesByGroupId(groupId);
                setActivity(fetchActivities || []); //MAY NEED TO CHANGE
            }catch(error){
                console.log("Error fetching group details", error);
            }finally{
                setLoadingData(false);
            }
        };

        if(groupId){
            fetchGroupDetails();
        }
    }, [groupId]);

    const handleShareCode = async () =>{
        try{
            const result = await Share.share({
                message: `Join my group "${groupName}" in the DoTogether app. Use code: ${groupId}`,
            });
        }catch(error){
            console.error("Error, could not share the group code", error);
        }
    };

    //FOR LAINA TO ADD TO
    const handleLeaveGroup = () =>{

    };

    //TO DO STILL 
    const handleCreateActivity = () =>{

    };

    if(loadingData){
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3f51b5" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress = {()=> router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#3f51b5" />
                    </TouchableOpacity>
                    <Text style={styles.groupName}>{groupName}</Text>
                </View>

                {/*Group Description */}
                {groupDetails?.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{groupDetails.description}</Text>
                    </View>
                )}

                {/* Share Code Button */}
                <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
                    <Ionicons name="share-outline" size={20} color="#fff" />
                    <Text style={styles.shareButtonText}>Share Group Code</Text>
                </TouchableOpacity>

                {/** Members Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Members ({members.length})</Text>
                    <View style={styles.membersList}>
                        {members.map((member) => (
                        <View key={member.id} style={styles.memberItem}>
                            <View style={styles.memberAvatar}>
                            <Text style={styles.memberInitial}>
                                {member.name.charAt(0).toUpperCase()}
                            </Text>
                            </View>
                            <Text style={styles.memberName}>
                            {member.name} {member.id === groupDetails?.createdBy && '(Creator)'} 
                            {member.id === currentUserId && ' (You)'}
                            </Text>
                        </View>
                        ))}
                    </View>
                </View>

                {/** Activities Section NEED TO DO*/}

                {/** Leave Group */}
                {!isCreator && (
                    <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
                        <Ionicons name="exit-outline" size={20} color="#fff" />
                        <Text style={styles.leaveButtonText}>Leave Group</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

});