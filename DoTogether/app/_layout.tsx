import React from 'react';
import { Stack } from 'expo-router';
import { GroupProvider } from '../contexts/GroupContext';

export default function RootLayout() {
    return (
        <GroupProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',
                    }}
                />
                <Stack.Screen
                    name="createGroup"
                    options={{
                        title: 'Create Group',
                    }}
                />
                <Stack.Screen
                    name="viewGroup"
                    options={{
                        title: 'Group Details',
                    }}
                />
            </Stack>
        </GroupProvider>
    );
}