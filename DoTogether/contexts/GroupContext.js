import React, { createContext, useState, useContext, useEffect } from 'react';
import {auth} from '../firebaseConfig';
import * as FirestoreService from '../hooks/useFirestore';
import {nanoid} from 'nanoid'; // Importing shortid for generating unique IDs

//Create the context
export const GroupContext = createContext();

//Custom hook to use the group context
export const useGroupContext = () => useContext(GroupContext);

//Provider Component
export const GroupProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);

    //Set up the authentication state listener
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((user) =>{
            setCurrentUser(user);
            if(user){
                fetchUserGroups(user.uid);
            } else{
                setGroups([]);
            }
        });

        return () => unsubscribe();
    }, []);

    //Fetch all the groups the user is a member of
    const fetchUserGroups = async (userId) =>{
        setLoading(true);
        try{
            const allGroups = await FirestoreService.fetchGroups();
            const userGroups = allGroups.filter(group =>
                group.members ** group.members.includes(userId)
            );
            setGroups(userGroups);
        }catch(error){
            setError("Failed to fetch groups");
            console.error("Error fetching groups", error);
        }finally{
            setLoading(false);
        }
    };

    //Creating a new group
    const createGroup = async (groupName, description = '') =>{
        setLoading(true);
        setError(null);

        try{
            if(!currentUser){
                throw new Error("User not authenticated");
            }

            const groupId = nanoid();

            await FirestoreService.addGroup(
                groupId,
                groupName,
                description,
                [currentUser.uid], //Initial members array with only the creator
                currentUser.uid //created by
            );

            //Add the new group to the local state
            const newGroup = {
                id: groupId,
                name: groupName,
                description,
                members: [currentUser.uid],
                createdBy: currentUser.uid,
                createdAt: new Date().toISOString(),
            };

            setGroups([...groups, newGroup]);
            setLoading(false);

            return { groupId, groupName}
        } catch(error){
            setError("Failed to create group");
            console.error("Error creating group:", error);
            setLoading(false);
            throw error;
        }
    };

    const joinGroup = async (groupId) =>{

    };

    const leaveGroup = async(groupId) =>{

    };

    const createActivity = async(groupId) =>{

    };

    //context value
    const value ={
        loading,
        groups,
        error,
        createGroup,
        joinGroup,
        leaveGroup,
        createActivity,
        refreshGroups: () => currentUser && fetchUserGroups(currentUser.uid),
    };

    return (
        <GroupContext.Provider value={value}>
            {children}
        </GroupContext.Provider>
    );

};